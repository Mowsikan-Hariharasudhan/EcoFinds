const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [100, 'Product title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: [true, 'Product category is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  condition: {
    type: String,
    enum: ['new', 'like-new', 'good', 'fair', 'poor'],
    required: [true, 'Product condition is required']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Product seller is required']
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'sold', 'archived', 'suspended'],
    default: 'active'
  },
  shipping: {
    available: {
      type: Boolean,
      default: false
    },
    cost: {
      type: Number,
      default: 0,
      min: [0, 'Shipping cost cannot be negative']
    },
    freeShipping: {
      type: Boolean,
      default: false
    },
    estimatedDays: {
      type: Number,
      min: 1,
      max: 30
    }
  },
  pickup: {
    available: {
      type: Boolean,
      default: true
    },
    location: {
      address: String,
      city: String,
      state: String,
      zipCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    }
  },
  negotiable: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  specifications: [{
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  }],
  stats: {
    views: {
      type: Number,
      default: 0
    },
    favorites: {
      type: Number,
      default: 0
    },
    inquiries: {
      type: Number,
      default: 0
    }
  },
  sustainability: {
    ecoScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 50
    },
    carbonFootprint: {
      type: Number,
      min: 0
    },
    recyclable: {
      type: Boolean,
      default: false
    },
    energyEfficient: {
      type: Boolean,
      default: false
    }
  },
  metadata: {
    featured: {
      type: Boolean,
      default: false
    },
    urgent: {
      type: Boolean,
      default: false
    },
    promoted: {
      type: Boolean,
      default: false
    },
    lastViewed: Date,
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    }
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
productSchema.index({ title: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ seller: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ 'pickup.location.coordinates': '2dsphere' });

// Virtual for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
  justOne: false
});

// Virtual for main image
productSchema.virtual('mainImage').get(function() {
  const mainImg = this.images.find(img => img.isMain);
  return mainImg ? mainImg.url : (this.images[0] ? this.images[0].url : '/assets/images/no_image.png');
});

// Pre-save middleware
productSchema.pre('save', function(next) {
  // Ensure at least one image is marked as main
  if (this.images.length > 0 && !this.images.some(img => img.isMain)) {
    this.images[0].isMain = true;
  }
  
  // Generate tags from title and description
  if (this.isModified('title') || this.isModified('description')) {
    const text = `${this.title} ${this.description}`.toLowerCase();
    const words = text.match(/\b\w{3,}\b/g) || [];
    const uniqueWords = [...new Set(words)];
    this.tags = [...new Set([...this.tags, ...uniqueWords])].slice(0, 20);
  }
  
  next();
});

// Update seller stats when product status changes
productSchema.post('save', async function() {
  if (this.isModified('status')) {
    const User = mongoose.model('User');
    await User.findByIdAndUpdate(this.seller, {
      $inc: {
        'stats.totalSales': this.status === 'sold' ? 1 : 0
      }
    });
  }
});

// Method to increment views
productSchema.methods.incrementViews = function() {
  this.stats.views += 1;
  this.metadata.lastViewed = new Date();
  return this.save();
};

// Method to calculate eco score
productSchema.methods.calculateEcoScore = function() {
  let score = 50; // Base score
  
  // Condition affects score
  const conditionScores = {
    'new': -10,
    'like-new': 20,
    'good': 15,
    'fair': 10,
    'poor': 5
  };
  score += conditionScores[this.condition] || 0;
  
  // Age affects score (older items are more sustainable)
  const ageInMonths = (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24 * 30);
  score += Math.min(ageInMonths * 2, 20);
  
  // Local pickup is more sustainable
  if (this.pickup.available) score += 10;
  
  // Specific sustainability features
  if (this.sustainability.recyclable) score += 10;
  if (this.sustainability.energyEfficient) score += 15;
  
  this.sustainability.ecoScore = Math.max(0, Math.min(100, score));
  return this.sustainability.ecoScore;
};

module.exports = mongoose.model('Product', productSchema);

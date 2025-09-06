const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  order: {
    type: mongoose.Schema.ObjectId,
    ref: 'Order'
  },
  rating: {
    overall: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    quality: {
      type: Number,
      min: 1,
      max: 5
    },
    sustainability: {
      type: Number,
      min: 1,
      max: 5
    },
    packaging: {
      type: Number,
      min: 1,
      max: 5
    },
    shipping: {
      type: Number,
      min: 1,
      max: 5
    },
    communication: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  title: {
    type: String,
    maxlength: 100
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  images: [{
    url: String,
    publicId: String,
    caption: String
  }],
  tags: [{
    type: String,
    enum: ['verified-purchase', 'eco-friendly', 'fast-shipping', 'great-quality', 'good-value', 'excellent-seller']
  }],
  helpful: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }]
  },
  response: {
    content: String,
    respondedAt: Date,
    respondedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'hidden'],
    default: 'pending'
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  metadata: {
    reportCount: {
      type: Number,
      default: 0
    },
    reportedBy: [{
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      },
      reason: String,
      date: {
        type: Date,
        default: Date.now
      }
    }],
    moderatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    moderatedAt: Date,
    moderationNote: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ reviewer: 1, createdAt: -1 });
reviewSchema.index({ seller: 1, createdAt: -1 });
reviewSchema.index({ 'rating.overall': 1 });
reviewSchema.index({ status: 1 });

// Compound index for unique review per user per product
reviewSchema.index({ product: 1, reviewer: 1 }, { unique: true });

// Pre-save middleware to check verified purchase
reviewSchema.pre('save', async function(next) {
  if (this.isNew && this.order) {
    // Check if this order contains the product and the reviewer is the buyer
    const Order = mongoose.model('Order');
    const order = await Order.findById(this.order);
    
    if (order && order.buyer.toString() === this.reviewer.toString()) {
      const hasProduct = order.items.some(item => 
        item.product.toString() === this.product.toString()
      );
      
      if (hasProduct && ['delivered', 'completed'].includes(order.status)) {
        this.isVerifiedPurchase = true;
        this.tags.push('verified-purchase');
      }
    }
  }
  next();
});

// Post-save middleware to update product rating
reviewSchema.post('save', async function(doc) {
  if (doc.status === 'approved') {
    await doc.updateProductRating();
  }
});

// Post-remove middleware to update product rating
reviewSchema.post('remove', async function(doc) {
  await doc.updateProductRating();
});

// Method to update product average rating
reviewSchema.methods.updateProductRating = async function() {
  const Review = this.constructor;
  const Product = mongoose.model('Product');
  
  const stats = await Review.aggregate([
    {
      $match: { 
        product: this.product,
        status: 'approved'
      }
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating.overall' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating.overall'
        }
      }
    }
  ]);
  
  if (stats.length > 0) {
    const stat = stats[0];
    
    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stat.ratingDistribution.forEach(rating => {
      distribution[Math.round(rating)]++;
    });
    
    await Product.findByIdAndUpdate(this.product, {
      'reviews.averageRating': Math.round(stat.averageRating * 10) / 10,
      'reviews.totalReviews': stat.totalReviews,
      'reviews.distribution': distribution
    });
  } else {
    // No approved reviews left
    await Product.findByIdAndUpdate(this.product, {
      'reviews.averageRating': 0,
      'reviews.totalReviews': 0,
      'reviews.distribution': { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    });
  }
};

// Method to mark review as helpful
reviewSchema.methods.markHelpful = function(userId) {
  if (!this.helpful.users.includes(userId)) {
    this.helpful.users.push(userId);
    this.helpful.count = this.helpful.users.length;
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to unmark review as helpful
reviewSchema.methods.unmarkHelpful = function(userId) {
  const index = this.helpful.users.indexOf(userId);
  if (index > -1) {
    this.helpful.users.splice(index, 1);
    this.helpful.count = this.helpful.users.length;
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to add seller response
reviewSchema.methods.addResponse = function(content, respondedBy) {
  this.response = {
    content,
    respondedAt: new Date(),
    respondedBy
  };
  return this.save();
};

// Method to report review
reviewSchema.methods.reportReview = function(userId, reason) {
  // Check if user already reported
  const existingReport = this.metadata.reportedBy.find(
    report => report.user.toString() === userId.toString()
  );
  
  if (!existingReport) {
    this.metadata.reportedBy.push({
      user: userId,
      reason
    });
    this.metadata.reportCount = this.metadata.reportedBy.length;
    
    // Auto-hide if too many reports
    if (this.metadata.reportCount >= 5) {
      this.status = 'hidden';
    }
    
    return this.save();
  }
  
  return Promise.resolve(this);
};

// Virtual for review age
reviewSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for overall rating calculation if sub-ratings exist
reviewSchema.virtual('calculatedOverallRating').get(function() {
  const ratings = [];
  if (this.rating.quality) ratings.push(this.rating.quality);
  if (this.rating.sustainability) ratings.push(this.rating.sustainability);
  if (this.rating.packaging) ratings.push(this.rating.packaging);
  if (this.rating.shipping) ratings.push(this.rating.shipping);
  if (this.rating.communication) ratings.push(this.rating.communication);
  
  if (ratings.length > 0) {
    return Math.round((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length) * 10) / 10;
  }
  
  return this.rating.overall;
});

module.exports = mongoose.model('Review', reviewSchema);

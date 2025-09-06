const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  buyer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending'
    },
    trackingNumber: String,
    shippingMethod: {
      type: String,
      enum: ['pickup', 'standard', 'express', 'overnight']
    },
    deliveryDate: Date,
    notes: String
  }],
  shippingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phone: String
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ['card', 'paypal', 'bank_transfer', 'cash'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'USD'
    },
    paidAt: Date,
    refundedAt: Date,
    refundAmount: Number
  },
  totals: {
    subtotal: {
      type: Number,
      required: true
    },
    shippingCost: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  timeline: [{
    status: String,
    date: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  }],
  communication: [{
    from: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    to: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['message', 'system', 'notification'],
      default: 'message'
    }
  }],
  metadata: {
    estimatedDelivery: Date,
    actualDelivery: Date,
    source: {
      type: String,
      enum: ['web', 'mobile', 'api'],
      default: 'web'
    },
    promotions: [{
      code: String,
      discount: Number,
      type: String
    }],
    notes: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ 'items.seller': 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get the count of orders today
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const count = await this.constructor.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
    
    const orderNum = (count + 1).toString().padStart(4, '0');
    this.orderNumber = `EF${year}${month}${day}${orderNum}`;
    
    // Add initial status to timeline
    this.timeline.push({
      status: 'pending',
      note: 'Order created',
      updatedBy: this.buyer
    });
  }
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = function(newStatus, note, updatedBy) {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    note: note || `Order status updated to ${newStatus}`,
    updatedBy: updatedBy
  });
  
  // Update individual item statuses if needed
  if (['confirmed', 'shipped', 'delivered', 'cancelled'].includes(newStatus)) {
    this.items.forEach(item => {
      if (item.status === 'pending' || 
          (newStatus === 'delivered' && item.status === 'shipped') ||
          (newStatus === 'shipped' && item.status === 'confirmed')) {
        item.status = newStatus;
      }
    });
  }
  
  return this.save();
};

// Method to add communication
orderSchema.methods.addMessage = function(from, to, message, type = 'message') {
  this.communication.push({
    from,
    to,
    message,
    type
  });
  return this.save();
};

// Virtual for order age
orderSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for total items
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

module.exports = mongoose.model('Order', orderSchema);

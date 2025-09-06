const express = require('express');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const { validateReview, handleValidationErrors } = require('../middleware/validation');
const router = express.Router();

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      rating,
      verified = 'all'
    } = req.query;

    const skip = (page - 1) * limit;

    // Build filter
    const filter = {
      product: req.params.productId,
      status: 'approved'
    };

    if (rating) {
      filter['rating.overall'] = parseInt(rating);
    }

    if (verified === 'true') {
      filter.isVerifiedPurchase = true;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const reviews = await Review.find(filter)
      .populate('reviewer', 'firstName lastName avatar')
      .populate('response.respondedBy', 'firstName lastName avatar business')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(filter);

    // Get rating distribution
    const ratingStats = await Review.aggregate([
      {
        $match: {
          product: req.params.productId,
          status: 'approved'
        }
      },
      {
        $group: {
          _id: '$rating.overall',
          count: { $sum: 1 }
        }
      }
    ]);

    const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingStats.forEach(stat => {
      ratingDistribution[stat._id] = stat.count;
    });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        ratingDistribution
      }
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
});

// Create a new review
router.post('/', auth, validateReview, handleValidationErrors, async (req, res) => {
  try {
    const { productId, orderId, ...reviewData } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      reviewer: req.user.userId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // If order is provided, verify the purchase
    if (orderId) {
      const order = await Order.findOne({
        _id: orderId,
        buyer: req.user.userId,
        'items.product': productId,
        status: { $in: ['delivered', 'completed'] }
      });

      if (!order) {
        return res.status(400).json({
          success: false,
          message: 'Invalid order or product not purchased'
        });
      }
    }

    const review = new Review({
      ...reviewData,
      product: productId,
      reviewer: req.user.userId,
      seller: product.seller,
      order: orderId
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'firstName lastName avatar')
      .populate('product', 'name images');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { review: populatedReview }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message
    });
  }
});

// Get user's reviews
router.get('/my-reviews', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const reviews = await Review.find({ reviewer: req.user.userId })
      .populate('product', 'name images price')
      .populate('seller', 'firstName lastName business')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ reviewer: req.user.userId });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user reviews',
      error: error.message
    });
  }
});

// Get reviews for seller's products
router.get('/seller-reviews', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status = 'approved'
    } = req.query;

    const skip = (page - 1) * limit;

    // Build filter
    const filter = { seller: req.user.userId };
    if (status !== 'all') {
      filter.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const reviews = await Review.find(filter)
      .populate('reviewer', 'firstName lastName avatar')
      .populate('product', 'name images')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments(filter);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get seller reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching seller reviews',
      error: error.message
    });
  }
});

// Update review
router.put('/:reviewId', auth, validateReview, handleValidationErrors, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.reviewId,
      reviewer: req.user.userId
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or unauthorized'
      });
    }

    // Update review fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'reviewer' && key !== 'product') {
        review[key] = req.body[key];
      }
    });

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate('reviewer', 'firstName lastName avatar')
      .populate('product', 'name images');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: { review: updatedReview }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message
    });
  }
});

// Delete review
router.delete('/:reviewId', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.reviewId,
      reviewer: req.user.userId
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or unauthorized'
      });
    }

    await Review.findByIdAndDelete(req.params.reviewId);

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
});

// Mark review as helpful
router.post('/:reviewId/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.markHelpful(req.user.userId);

    res.json({
      success: true,
      message: 'Review marked as helpful',
      data: {
        helpfulCount: review.helpful.count,
        isHelpful: review.helpful.users.includes(req.user.userId)
      }
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking review as helpful',
      error: error.message
    });
  }
});

// Remove helpful mark
router.delete('/:reviewId/helpful', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.unmarkHelpful(req.user.userId);

    res.json({
      success: true,
      message: 'Helpful mark removed',
      data: {
        helpfulCount: review.helpful.count,
        isHelpful: review.helpful.users.includes(req.user.userId)
      }
    });
  } catch (error) {
    console.error('Remove helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing helpful mark',
      error: error.message
    });
  }
});

// Add seller response to review
router.post('/:reviewId/response', auth, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Response content is required'
      });
    }

    const review = await Review.findOne({
      _id: req.params.reviewId,
      seller: req.user.userId
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or unauthorized'
      });
    }

    await review.addResponse(content, req.user.userId);

    const updatedReview = await Review.findById(review._id)
      .populate('reviewer', 'firstName lastName avatar')
      .populate('response.respondedBy', 'firstName lastName business');

    res.json({
      success: true,
      message: 'Response added successfully',
      data: { review: updatedReview }
    });
  } catch (error) {
    console.error('Add response error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding response',
      error: error.message
    });
  }
});

// Report review
router.post('/:reviewId/report', auth, async (req, res) => {
  try {
    const { reason } = req.body;

    if (!reason || reason.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Report reason is required'
      });
    }

    const review = await Review.findById(req.params.reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    await review.reportReview(req.user.userId, reason);

    res.json({
      success: true,
      message: 'Review reported successfully'
    });
  } catch (error) {
    console.error('Report review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error reporting review',
      error: error.message
    });
  }
});

module.exports = router;

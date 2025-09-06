const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Create order from cart
router.post('/create', auth, async (req, res) => {
  try {
    const { shippingAddress, billingAddress, paymentMethod, notes } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.userId })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Verify all products are still available
    for (const item of cart.items) {
      if (item.product.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: `Product ${item.product.name} is no longer available`
        });
      }

      if (item.product.quantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${item.product.name}`
        });
      }
    }

    // Create order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      seller: item.product.seller,
      quantity: item.quantity,
      price: item.price,
      shippingCost: 0, // Calculate based on seller settings
      shippingMethod: 'standard'
    }));

    // Create order
    const order = new Order({
      buyer: req.user.userId,
      items: orderItems,
      shippingAddress,
      billingAddress,
      paymentDetails: {
        method: paymentMethod,
        amount: cart.total,
        status: 'pending'
      },
      totals: {
        subtotal: cart.subtotal,
        shippingCost: 0,
        tax: 0,
        total: cart.total
      },
      metadata: {
        notes
      }
    });

    await order.save();

    // Update product quantities
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { quantity: -item.quantity }
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    // Populate order for response
    const populatedOrder = await Order.findById(order._id)
      .populate('buyer', 'firstName lastName email')
      .populate('items.product', 'name images')
      .populate('items.seller', 'firstName lastName business');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order: populatedOrder }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
});

// Get user's orders (as buyer)
router.get('/my-orders', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;

    // Build filter
    const filter = { buyer: req.user.userId };
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(filter)
      .populate('items.product', 'name images')
      .populate('items.seller', 'firstName lastName business')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// Get orders for seller
router.get('/my-sales', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;

    // Build filter
    const filter = { 'items.seller': req.user.userId };
    if (status && status !== 'all') {
      filter['items.status'] = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const orders = await Order.find(filter)
      .populate('buyer', 'firstName lastName email')
      .populate('items.product', 'name images')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Filter items to only show seller's items
    const filteredOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.filter(
        item => item.seller.toString() === req.user.userId
      );
      return orderObj;
    });

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      data: {
        orders: filteredOrders,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get my sales error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sales',
      error: error.message
    });
  }
});

// Get single order
router.get('/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('buyer', 'firstName lastName email phoneNumber')
      .populate('items.product', 'name images description')
      .populate('items.seller', 'firstName lastName business')
      .populate('timeline.updatedBy', 'firstName lastName')
      .populate('communication.from communication.to', 'firstName lastName');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized to view this order
    const isBuyer = order.buyer._id.toString() === req.user.userId;
    const isSeller = order.items.some(
      item => item.seller._id.toString() === req.user.userId
    );

    if (!isBuyer && !isSeller) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this order'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// Update order status (seller only)
router.put('/:orderId/status', auth, async (req, res) => {
  try {
    const { status, note, trackingNumber, estimatedDelivery } = req.body;

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is a seller for this order
    const isSeller = order.items.some(
      item => item.seller.toString() === req.user.userId
    );

    if (!isSeller) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this order'
      });
    }

    // Update order status
    await order.updateStatus(status, note, req.user.userId);

    // Update specific fields if provided
    if (trackingNumber) {
      order.items.forEach(item => {
        if (item.seller.toString() === req.user.userId) {
          item.trackingNumber = trackingNumber;
        }
      });
    }

    if (estimatedDelivery) {
      order.metadata.estimatedDelivery = estimatedDelivery;
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('buyer', 'firstName lastName email')
      .populate('items.product', 'name images')
      .populate('items.seller', 'firstName lastName business');

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order: updatedOrder }
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

// Add message to order
router.post('/:orderId/message', auth, async (req, res) => {
  try {
    const { message, recipientId } = req.body;

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized
    const isBuyer = order.buyer.toString() === req.user.userId;
    const isSeller = order.items.some(
      item => item.seller.toString() === req.user.userId
    );

    if (!isBuyer && !isSeller) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to message on this order'
      });
    }

    await order.addMessage(req.user.userId, recipientId, message);

    const updatedOrder = await Order.findById(order._id)
      .populate('communication.from communication.to', 'firstName lastName');

    res.json({
      success: true,
      message: 'Message added successfully',
      data: { order: updatedOrder }
    });
  } catch (error) {
    console.error('Add order message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding message',
      error: error.message
    });
  }
});

// Cancel order (buyer only, within cancellation window)
router.post('/:orderId/cancel', auth, async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is the buyer
    if (order.buyer.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Only the buyer can cancel the order'
      });
    }

    // Check if order can be cancelled
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    // Update order status
    await order.updateStatus('cancelled', reason || 'Cancelled by buyer', req.user.userId);

    // Restore product quantities
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { quantity: item.quantity }
      });
    }

    const updatedOrder = await Order.findById(order._id)
      .populate('buyer', 'firstName lastName email')
      .populate('items.product', 'name images')
      .populate('items.seller', 'firstName lastName business');

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order: updatedOrder }
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
});

// Get order analytics for seller
router.get('/analytics/seller', auth, async (req, res) => {
  try {
    const { startDate, endDate, period = '30d' } = req.query;

    // Build date filter
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
      const days = parseInt(period.replace('d', ''));
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      dateFilter = { createdAt: { $gte: cutoffDate } };
    }

    const analytics = await Order.aggregate([
      {
        $match: {
          'items.seller': req.user.userId,
          ...dateFilter
        }
      },
      {
        $unwind: '$items'
      },
      {
        $match: {
          'items.seller': req.user.userId
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalItems: { $sum: '$items.quantity' },
          averageOrderValue: { $avg: { $multiply: ['$items.price', '$items.quantity'] } },
          statusBreakdown: {
            $push: '$items.status'
          }
        }
      }
    ]);

    const result = analytics[0] || {
      totalOrders: 0,
      totalRevenue: 0,
      totalItems: 0,
      averageOrderValue: 0,
      statusBreakdown: []
    };

    // Calculate status breakdown
    const statusCounts = {};
    result.statusBreakdown.forEach(status => {
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        ...result,
        statusBreakdown: statusCounts
      }
    });
  } catch (error) {
    console.error('Get order analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order analytics',
      error: error.message
    });
  }
});

module.exports = router;

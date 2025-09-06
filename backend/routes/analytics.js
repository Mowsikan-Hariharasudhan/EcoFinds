const express = require('express');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const Review = require('../models/Review');
const auth = require('../middleware/auth');
const router = express.Router();

// Get dashboard analytics for seller
router.get('/dashboard', auth, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    // Calculate date range
    const days = parseInt(period.replace('d', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get basic stats
    const [
      totalProducts,
      activeProducts,
      totalOrders,
      totalRevenue,
      averageRating,
      totalReviews
    ] = await Promise.all([
      Product.countDocuments({ seller: req.user.userId }),
      Product.countDocuments({ seller: req.user.userId, status: 'active' }),
      Order.countDocuments({
        'items.seller': req.user.userId,
        createdAt: { $gte: startDate }
      }),
      Order.aggregate([
        {
          $match: {
            'items.seller': req.user.userId,
            createdAt: { $gte: startDate }
          }
        },
        { $unwind: '$items' },
        {
          $match: { 'items.seller': req.user.userId }
        },
        {
          $group: {
            _id: null,
            total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
          }
        }
      ]).then(result => result[0]?.total || 0),
      Review.aggregate([
        {
          $match: {
            seller: req.user.userId,
            status: 'approved'
          }
        },
        {
          $group: {
            _id: null,
            average: { $avg: '$rating.overall' }
          }
        }
      ]).then(result => result[0]?.average || 0),
      Review.countDocuments({ seller: req.user.userId, status: 'approved' })
    ]);

    // Get sales trend (last 7 days)
    const salesTrend = await Order.aggregate([
      {
        $match: {
          'items.seller': req.user.userId,
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      { $unwind: '$items' },
      {
        $match: { 'items.seller': req.user.userId }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          sales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Get top selling products
    const topProducts = await Order.aggregate([
      {
        $match: {
          'items.seller': req.user.userId,
          createdAt: { $gte: startDate }
        }
      },
      { $unwind: '$items' },
      {
        $match: { 'items.seller': req.user.userId }
      },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);

    // Get recent orders
    const recentOrders = await Order.find({
      'items.seller': req.user.userId
    })
    .populate('buyer', 'firstName lastName')
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 })
    .limit(5);

    res.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          activeProducts,
          totalOrders,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          averageRating: Math.round(averageRating * 10) / 10,
          totalReviews
        },
        salesTrend,
        topProducts,
        recentOrders: recentOrders.map(order => ({
          ...order.toObject(),
          items: order.items.filter(item => 
            item.seller.toString() === req.user.userId
          )
        }))
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard analytics',
      error: error.message
    });
  }
});

// Get sales analytics
router.get('/sales', auth, async (req, res) => {
  try {
    const { 
      period = '30d', 
      groupBy = 'day' // day, week, month
    } = req.query;

    const days = parseInt(period.replace('d', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    let dateFormat;
    switch (groupBy) {
      case 'week':
        dateFormat = '%Y-W%U';
        break;
      case 'month':
        dateFormat = '%Y-%m';
        break;
      default:
        dateFormat = '%Y-%m-%d';
    }

    const salesData = await Order.aggregate([
      {
        $match: {
          'items.seller': req.user.userId,
          createdAt: { $gte: startDate }
        }
      },
      { $unwind: '$items' },
      {
        $match: { 'items.seller': req.user.userId }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: dateFormat, date: '$createdAt' }
          },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orders: { $sum: 1 },
          items: { $sum: '$items.quantity' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    // Get product performance
    const productPerformance = await Order.aggregate([
      {
        $match: {
          'items.seller': req.user.userId,
          createdAt: { $gte: startDate }
        }
      },
      { $unwind: '$items' },
      {
        $match: { 'items.seller': req.user.userId }
      },
      {
        $group: {
          _id: '$items.product',
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          quantitySold: { $sum: '$items.quantity' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' }
    ]);

    res.json({
      success: true,
      data: {
        salesData,
        productPerformance,
        summary: {
          totalRevenue: salesData.reduce((sum, item) => sum + item.revenue, 0),
          totalOrders: salesData.reduce((sum, item) => sum + item.orders, 0),
          totalItems: salesData.reduce((sum, item) => sum + item.items, 0)
        }
      }
    });
  } catch (error) {
    console.error('Get sales analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sales analytics',
      error: error.message
    });
  }
});

// Get customer analytics
router.get('/customers', auth, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    const days = parseInt(period.replace('d', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get customer data
    const customerData = await Order.aggregate([
      {
        $match: {
          'items.seller': req.user.userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$buyer',
          orders: { $sum: 1 },
          totalSpent: { $sum: '$totals.total' },
          lastOrder: { $max: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'customer'
        }
      },
      { $unwind: '$customer' },
      { $sort: { totalSpent: -1 } }
    ]);

    // Get new vs returning customers
    const customerSegmentation = await Order.aggregate([
      {
        $match: {
          'items.seller': req.user.userId
        }
      },
      {
        $group: {
          _id: '$buyer',
          firstOrder: { $min: '$createdAt' },
          totalOrders: { $sum: 1 }
        }
      },
      {
        $addFields: {
          isNewCustomer: {
            $gte: ['$firstOrder', startDate]
          },
          isReturning: {
            $gt: ['$totalOrders', 1]
          }
        }
      },
      {
        $group: {
          _id: null,
          newCustomers: {
            $sum: { $cond: ['$isNewCustomer', 1, 0] }
          },
          returningCustomers: {
            $sum: { $cond: ['$isReturning', 1, 0] }
          },
          totalCustomers: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        customers: customerData,
        segmentation: customerSegmentation[0] || {
          newCustomers: 0,
          returningCustomers: 0,
          totalCustomers: 0
        }
      }
    });
  } catch (error) {
    console.error('Get customer analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching customer analytics',
      error: error.message
    });
  }
});

// Get product analytics
router.get('/products', auth, async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    const days = parseInt(period.replace('d', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get product performance metrics
    const productMetrics = await Product.aggregate([
      {
        $match: { seller: req.user.userId }
      },
      {
        $lookup: {
          from: 'orders',
          let: { productId: '$_id' },
          pipeline: [
            { $unwind: '$items' },
            {
              $match: {
                $expr: { $eq: ['$items.product', '$$productId'] },
                'items.seller': req.user.userId,
                createdAt: { $gte: startDate }
              }
            },
            {
              $group: {
                _id: null,
                totalSold: { $sum: '$items.quantity' },
                revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
              }
            }
          ],
          as: 'salesData'
        }
      },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'product',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          totalSold: { $ifNull: [{ $arrayElemAt: ['$salesData.totalSold', 0] }, 0] },
          revenue: { $ifNull: [{ $arrayElemAt: ['$salesData.revenue', 0] }, 0] },
          averageRating: { $avg: '$reviews.rating.overall' },
          totalReviews: { $size: '$reviews' }
        }
      },
      {
        $project: {
          name: 1,
          price: 1,
          quantity: 1,
          status: 1,
          views: 1,
          likes: 1,
          totalSold: 1,
          revenue: 1,
          averageRating: 1,
          totalReviews: 1,
          conversionRate: {
            $cond: [
              { $gt: ['$views', 0] },
              { $multiply: [{ $divide: ['$totalSold', '$views'] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // Get category performance
    const categoryPerformance = await Product.aggregate([
      {
        $match: { seller: req.user.userId }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: '$categoryInfo' },
      {
        $lookup: {
          from: 'orders',
          let: { productId: '$_id' },
          pipeline: [
            { $unwind: '$items' },
            {
              $match: {
                $expr: { $eq: ['$items.product', '$$productId'] },
                'items.seller': req.user.userId,
                createdAt: { $gte: startDate }
              }
            }
          ],
          as: 'orders'
        }
      },
      {
        $group: {
          _id: '$category',
          categoryName: { $first: '$categoryInfo.name' },
          products: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: { $size: '$likes' } },
          orderCount: { $sum: { $size: '$orders' } }
        }
      },
      { $sort: { orderCount: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        products: productMetrics,
        categoryPerformance
      }
    });
  } catch (error) {
    console.error('Get product analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product analytics',
      error: error.message
    });
  }
});

// Get marketplace overview (public analytics)
router.get('/marketplace', async (req, res) => {
  try {
    const { period = '30d' } = req.query;
    
    const days = parseInt(period.replace('d', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [
      totalProducts,
      totalSellers,
      totalOrders,
      totalUsers,
      categoryStats,
      recentActivity
    ] = await Promise.all([
      Product.countDocuments({ status: 'active' }),
      User.countDocuments({ accountType: 'business', isActive: true }),
      Order.countDocuments({ createdAt: { $gte: startDate } }),
      User.countDocuments({ isActive: true }),
      
      // Category statistics
      Product.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: '_id',
            foreignField: '_id',
            as: 'category'
          }
        },
        { $unwind: '$category' },
        {
          $project: {
            name: '$category.name',
            count: 1
          }
        },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),

      // Recent activity
      Order.find({ createdAt: { $gte: startDate } })
        .populate('buyer', 'firstName lastName')
        .populate('items.product', 'name')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          totalSellers,
          totalOrders,
          totalUsers
        },
        categoryStats,
        recentActivity
      }
    });
  } catch (error) {
    console.error('Get marketplace analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching marketplace analytics',
      error: error.message
    });
  }
});

// Export sales data
router.get('/export/sales', auth, async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      format = 'json' // json, csv
    } = req.query;

    const filter = {
      'items.seller': req.user.userId
    };

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const salesData = await Order.find(filter)
      .populate('buyer', 'firstName lastName email')
      .populate('items.product', 'name category')
      .sort({ createdAt: -1 });

    // Filter items to only include seller's items
    const filteredData = salesData.map(order => ({
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      buyer: `${order.buyer.firstName} ${order.buyer.lastName}`,
      buyerEmail: order.buyer.email,
      items: order.items.filter(item => 
        item.seller.toString() === req.user.userId
      ),
      status: order.status,
      total: order.totals.total
    }));

    if (format === 'csv') {
      // Convert to CSV format
      const csv = convertToCSV(filteredData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=sales-export.csv');
      return res.send(csv);
    }

    res.json({
      success: true,
      data: filteredData
    });
  } catch (error) {
    console.error('Export sales data error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting sales data',
      error: error.message
    });
  }
});

// Helper function to convert data to CSV
function convertToCSV(data) {
  const headers = ['Order Number', 'Date', 'Buyer', 'Product', 'Quantity', 'Price', 'Total', 'Status'];
  const csvRows = [headers.join(',')];

  data.forEach(order => {
    order.items.forEach(item => {
      const row = [
        order.orderNumber,
        order.orderDate.toISOString().split('T')[0],
        order.buyer,
        item.product.name,
        item.quantity,
        item.price,
        item.price * item.quantity,
        order.status
      ];
      csvRows.push(row.join(','));
    });
  });

  return csvRows.join('\n');
}

module.exports = router;

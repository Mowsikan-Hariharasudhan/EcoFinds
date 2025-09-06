const express = require('express');
const Product = require('../models/Product');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all products with filtering, sorting, and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      minPrice,
      maxPrice,
      condition,
      location,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      ecoFriendly,
      seller
    } = req.query;

    const skip = (page - 1) * limit;

    // Build filter query
    const filter = { status: 'active' };

    if (category) {
      // if a category slug is provided, find its ObjectId
      const catDoc = await Category.findOne({ slug: category });
      if (!catDoc) {
        // no such category, return empty list
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        return res.json({
          success: true,
          data: {
            products: [],
            pagination: { page: pageNum, limit: limitNum, total: 0, pages: 0 }
          }
        });
      }
      filter.category = catDoc._id;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (condition) {
      filter.condition = condition;
    }

    if (location) {
      filter['location.city'] = { $regex: location, $options: 'i' };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (ecoFriendly === 'true') {
      filter['sustainability.ecoScore'] = { $gte: 7 };
    }

    if (seller) {
      filter.seller = seller;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(filter)
      .populate('seller', 'firstName lastName avatar business')
      .populate('category', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'firstName lastName avatar business')
      .populate('category', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// Create new product
router.post('/', auth, async (req, res) => {
  try {
    const productData = {
      ...req.body,
      seller: req.user.userId
    };

    const product = new Product(productData);
    await product.save();

    const populatedProduct = await Product.findById(product._id)
      .populate('seller', 'firstName lastName avatar business')
      .populate('category', 'name');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product: populatedProduct }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

// Update product
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user.userId
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unauthorized'
      });
    }

    // Update product fields
    Object.keys(req.body).forEach(key => {
      if (key !== 'seller') { // Prevent seller change
        product[key] = req.body[key];
      }
    });

    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate('seller', 'firstName lastName avatar business')
      .populate('category', 'name');

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
});

// Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user.userId
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or unauthorized'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
});

// Get user's products (my listings)
router.get('/user/:userId', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status = 'all',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;

    // Build filter
    const filter = { seller: req.params.userId };
    
    if (status !== 'all') {
      filter.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(filter)
      .populate('category', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get user products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user products',
      error: error.message
    });
  }
});

// Get related products
router.get('/:id/related', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      status: 'active',
      $or: [
        { category: product.category },
        { tags: { $in: product.tags } }
      ]
    })
    .populate('seller', 'firstName lastName avatar business')
    .populate('category', 'name')
    .limit(8)
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { products: relatedProducts }
    });
  } catch (error) {
    console.error('Get related products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching related products',
      error: error.message
    });
  }
});

// Toggle product like/unlike
router.post('/:id/like', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const userId = req.user.userId;
    const isLiked = product.likes.includes(userId);

    if (isLiked) {
      product.likes.pull(userId);
    } else {
      product.likes.push(userId);
    }

    await product.save();

    res.json({
      success: true,
      message: isLiked ? 'Product unliked' : 'Product liked',
      data: {
        isLiked: !isLiked,
        likesCount: product.likes.length
      }
    });
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling like',
      error: error.message
    });
  }
});

// Get featured products
router.get('/featured/list', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.find({
      status: 'active',
      featured: true
    })
    .populate('seller', 'firstName lastName avatar business')
    .populate('category', 'name')
    .sort({ featuredAt: -1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured products',
      error: error.message
    });
  }
});

// Get trending products
router.get('/trending/list', async (req, res) => {
  try {
    const { limit = 10, days = 7 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const products = await Product.find({
      status: 'active',
      createdAt: { $gte: cutoffDate }
    })
    .populate('seller', 'firstName lastName avatar business')
    .populate('category', 'name')
    .sort({ views: -1, likes: -1 })
    .limit(parseInt(limit));

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Get trending products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trending products',
      error: error.message
    });
  }
});

module.exports = router;

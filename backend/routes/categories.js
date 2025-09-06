const express = require('express');
const Category = require('../models/Category');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { includeProductCount = false } = req.query;

    let categories;

    if (includeProductCount === 'true') {
      categories = await Category.aggregate([
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: 'category',
            as: 'products'
          }
        },
        {
          $addFields: {
            productCount: { $size: '$products' }
          }
        },
        {
          $project: {
            products: 0
          }
        },
        {
          $sort: { name: 1 }
        }
      ]);
    } else {
      categories = await Category.find({ isActive: true }).sort({ name: 1 });
    }

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: { category }
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message
    });
  }
});

// Get category tree (hierarchical structure)
router.get('/tree/all', async (req, res) => {
  try {
    // Get all root categories (no parent)
    const rootCategories = await Category.find({
      parent: null,
      isActive: true
    }).sort({ name: 1 });

    // Recursively build the tree
    const buildCategoryTree = async (categories) => {
      const tree = [];
      
      for (const category of categories) {
        const children = await Category.find({
          parent: category._id,
          isActive: true
        }).sort({ name: 1 });

        const categoryObj = category.toObject();
        
        if (children.length > 0) {
          categoryObj.children = await buildCategoryTree(children);
        }

        tree.push(categoryObj);
      }

      return tree;
    };

    const categoryTree = await buildCategoryTree(rootCategories);

    res.json({
      success: true,
      data: { categories: categoryTree }
    });
  } catch (error) {
    console.error('Get category tree error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category tree',
      error: error.message
    });
  }
});

// Get products by category
router.get('/:id/products', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      includeSubcategories = true
    } = req.query;

    const skip = (page - 1) * limit;

    // Build category filter
    let categoryFilter;
    
    if (includeSubcategories === 'true') {
      // Get all subcategories
      const getAllSubcategories = async (categoryId) => {
        const subcategories = await Category.find({ parent: categoryId });
        let allCategories = [categoryId];
        
        for (const subcat of subcategories) {
          const nested = await getAllSubcategories(subcat._id);
          allCategories = allCategories.concat(nested);
        }
        
        return allCategories;
      };

      const allCategoryIds = await getAllSubcategories(req.params.id);
      categoryFilter = { category: { $in: allCategoryIds } };
    } else {
      categoryFilter = { category: req.params.id };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find({
      ...categoryFilter,
      status: 'active'
    })
    .populate('seller', 'firstName lastName avatar business')
    .populate('category', 'name')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

    const total = await Product.countDocuments({
      ...categoryFilter,
      status: 'active'
    });

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
    console.error('Get category products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching category products',
      error: error.message
    });
  }
});

// Create new category (admin only - simplified for now)
router.post('/', auth, async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message
    });
  }
});

// Update category (admin only - simplified for now)
router.put('/:id', auth, async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: { category }
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message
    });
  }
});

// Delete category (admin only - simplified for now)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if category has products
    const productCount = await Product.countDocuments({ category: req.params.id });
    
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing products'
      });
    }

    // Check if category has subcategories
    const subcategoryCount = await Category.countDocuments({ parent: req.params.id });
    
    if (subcategoryCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with subcategories'
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message
    });
  }
});

// Get popular categories (based on product count)
router.get('/popular/list', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const popularCategories = await Category.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        $addFields: {
          productCount: { $size: '$products' }
        }
      },
      {
        $match: {
          isActive: true,
          productCount: { $gt: 0 }
        }
      },
      {
        $sort: { productCount: -1 }
      },
      {
        $limit: parseInt(limit)
      },
      {
        $project: {
          products: 0
        }
      }
    ]);

    res.json({
      success: true,
      data: { categories: popularCategories }
    });
  } catch (error) {
    console.error('Get popular categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular categories',
      error: error.message
    });
  }
});

// Search categories
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const categories = await Category.find({
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ]
    })
    .sort({ name: 1 })
    .limit(20);

    res.json({
      success: true,
      data: { categories }
    });
  } catch (error) {
    console.error('Search categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching categories',
      error: error.message
    });
  }
});

module.exports = router;

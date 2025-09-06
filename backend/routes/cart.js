const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

// Get user's cart
router.get('/', auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.userId })
      .populate({
        path: 'items.product',
        populate: {
          path: 'seller',
          select: 'firstName lastName avatar business'
        }
      });

    if (!cart) {
      cart = new Cart({ user: req.user.userId });
      await cart.save();
    }

    res.json({
      success: true,
      data: { cart }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
});

// Add item to cart
router.post('/add', auth, async (req, res) => {
  try {
    const { productId, quantity = 1, options = {} } = req.body;

    // Verify product exists and is available
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Product is not available'
      });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      cart = new Cart({ user: req.user.userId });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && 
               JSON.stringify(item.options) === JSON.stringify(options)
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
      
      // Check if new quantity exceeds stock
      if (cart.items[existingItemIndex].quantity > product.quantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient stock for requested quantity'
        });
      }
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        options
      });
    }

    await cart.save();
    await cart.populate({
      path: 'items.product',
      populate: {
        path: 'seller',
        select: 'firstName lastName avatar business'
      }
    });

    res.json({
      success: true,
      message: 'Item added to cart',
      data: { cart }
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding item to cart',
      error: error.message
    });
  }
});

// Update cart item quantity
router.put('/item/:itemId', auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Check product availability
    const product = await Product.findById(item.product);
    if (quantity > product.quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    item.quantity = quantity;
    await cart.save();
    
    await cart.populate({
      path: 'items.product',
      populate: {
        path: 'seller',
        select: 'firstName lastName avatar business'
      }
    });

    res.json({
      success: true,
      message: 'Cart item updated',
      data: { cart }
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
});

// Remove item from cart
router.delete('/item/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items.id(itemId).remove();
    await cart.save();

    await cart.populate({
      path: 'items.product',
      populate: {
        path: 'seller',
        select: 'firstName lastName avatar business'
      }
    });

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: { cart }
    });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing cart item',
      error: error.message
    });
  }
});

// Clear entire cart
router.delete('/clear', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared',
      data: { cart }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
});

// Get cart summary (item count, total)
router.get('/summary', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.userId });
    
    if (!cart) {
      return res.json({
        success: true,
        data: {
          itemCount: 0,
          subtotal: 0,
          total: 0
        }
      });
    }

    const summary = {
      itemCount: cart.totalItems,
      subtotal: cart.subtotal,
      total: cart.total
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Get cart summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart summary',
      error: error.message
    });
  }
});

// Save item for later
router.post('/save-for-later/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Move item to saved for later
    cart.savedForLater.push({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
      options: item.options,
      savedAt: new Date()
    });

    cart.items.id(itemId).remove();
    await cart.save();

    await cart.populate({
      path: 'items.product savedForLater.product',
      populate: {
        path: 'seller',
        select: 'firstName lastName avatar business'
      }
    });

    res.json({
      success: true,
      message: 'Item saved for later',
      data: { cart }
    });
  } catch (error) {
    console.error('Save for later error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving item for later',
      error: error.message
    });
  }
});

// Move item from saved for later back to cart
router.post('/move-to-cart/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const savedItem = cart.savedForLater.id(itemId);
    if (!savedItem) {
      return res.status(404).json({
        success: false,
        message: 'Saved item not found'
      });
    }

    // Check product availability
    const product = await Product.findById(savedItem.product);
    if (!product || product.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Product is no longer available'
      });
    }

    if (product.quantity < savedItem.quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock'
      });
    }

    // Move item back to cart
    cart.items.push({
      product: savedItem.product,
      quantity: savedItem.quantity,
      price: product.price, // Use current price
      options: savedItem.options
    });

    cart.savedForLater.id(itemId).remove();
    await cart.save();

    await cart.populate({
      path: 'items.product savedForLater.product',
      populate: {
        path: 'seller',
        select: 'firstName lastName avatar business'
      }
    });

    res.json({
      success: true,
      message: 'Item moved to cart',
      data: { cart }
    });
  } catch (error) {
    console.error('Move to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error moving item to cart',
      error: error.message
    });
  }
});

// Remove item from saved for later
router.delete('/saved-for-later/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.savedForLater.id(itemId).remove();
    await cart.save();

    await cart.populate({
      path: 'savedForLater.product',
      populate: {
        path: 'seller',
        select: 'firstName lastName avatar business'
      }
    });

    res.json({
      success: true,
      message: 'Item removed from saved for later',
      data: { cart }
    });
  } catch (error) {
    console.error('Remove saved item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing saved item',
      error: error.message
    });
  }
});

module.exports = router;

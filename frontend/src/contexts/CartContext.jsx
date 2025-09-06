import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext({});

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      // Clear cart when user logs out
      setCartItems([]);
      setCartCount(0);
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      const cart = response.data;
      
      setCartItems(cart.items || []);
      setCartCount(cart.totalItems || 0);
    } catch (error) {
      console.error('Failed to load cart:', error);
      setCartItems([]);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error('Please login to add items to cart');
    }

    try {
      setLoading(true);
      const response = await cartAPI.add(productId, quantity);
      const updatedCart = response.data;
      
      setCartItems(updatedCart.items || []);
      setCartCount(updatedCart.totalItems || 0);
      
      return { success: true, message: 'Item added to cart successfully' };
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to add item to cart' 
      };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!isAuthenticated) {
      throw new Error('Please login to update cart');
    }

    try {
      setLoading(true);
      const response = await cartAPI.update(productId, quantity);
      const updatedCart = response.data;
      
      setCartItems(updatedCart.items || []);
      setCartCount(updatedCart.totalItems || 0);
      
      return { success: true, message: 'Cart updated successfully' };
    } catch (error) {
      console.error('Failed to update cart:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to update cart' 
      };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated) {
      throw new Error('Please login to remove items from cart');
    }

    try {
      setLoading(true);
      const response = await cartAPI.remove(productId);
      const updatedCart = response.data;
      
      setCartItems(updatedCart.items || []);
      setCartCount(updatedCart.totalItems || 0);
      
      return { success: true, message: 'Item removed from cart successfully' };
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to remove item from cart' 
      };
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      throw new Error('Please login to clear cart');
    }

    try {
      setLoading(true);
      await cartAPI.clear();
      
      setCartItems([]);
      setCartCount(0);
      
      return { success: true, message: 'Cart cleared successfully' };
    } catch (error) {
      console.error('Failed to clear cart:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to clear cart' 
      };
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * (item.quantity || 0);
    }, 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.product?._id === productId || item.product?.id === productId);
  };

  const getCartItem = (productId) => {
    return cartItems.find(item => item.product?._id === productId || item.product?.id === productId);
  };

  const value = {
    cartItems,
    cartCount,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    loadCart,
    getCartTotal,
    getCartItemCount,
    isInCart,
    getCartItem,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;

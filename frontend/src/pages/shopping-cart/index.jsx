import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import CartItem from './components/CartItem';
import OrderSummary from './components/OrderSummary';
import EmptyCart from './components/EmptyCart';
import SavedForLater from './components/SavedForLater';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ShoppingCart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSavedItems, setShowSavedItems] = useState(false);

  // Mock cart data
  useEffect(() => {
    const mockCartItems = [
      {
        id: 1,
        name: 'Vintage Wooden Dining Chair',
        category: 'Furniture',
        price: 89.99,
        originalPrice: 120.00,
        quantity: 1,
        maxQuantity: 3,
        stock: 2,
        condition: 'Excellent',
        location: 'San Francisco, CA',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
        sellerId: 'seller123'
      },
      {
        id: 2,
        name: 'MacBook Pro 13" 2019 - Space Gray',
        category: 'Electronics',
        price: 899.99,
        originalPrice: 1299.99,
        quantity: 1,
        maxQuantity: 1,
        stock: 1,
        condition: 'Very Good',
        location: 'New York, NY',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
        sellerId: 'seller456'
      },
      {
        id: 3,
        name: 'Organic Cotton Summer Dress',
        category: 'Clothing',
        price: 34.50,
        originalPrice: 65.00,
        quantity: 2,
        maxQuantity: 5,
        stock: 8,
        condition: 'Like New',
        location: 'Los Angeles, CA',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop',
        sellerId: 'seller789'
      }
    ];

    const mockSavedItems = [
      {
        id: 4,
        name: 'Vintage Leather Armchair',
        category: 'Furniture',
        price: 245.00,
        condition: 'Good',
        location: 'Chicago, IL',
        image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop',
        description: 'Beautiful vintage leather armchair with minor wear. Perfect for reading corner.',
        stock: 1,
        savedDate: '3 days ago'
      },
      {
        id: 5,
        name: 'iPhone 12 Pro - Pacific Blue',
        category: 'Electronics',
        price: 599.99,
        condition: 'Excellent',
        location: 'Seattle, WA',
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
        description: 'iPhone 12 Pro in excellent condition with original box and accessories.',
        stock: 0,
        savedDate: '1 week ago'
      }
    ];

    setTimeout(() => {
      setCartItems(mockCartItems);
      setSavedItems(mockSavedItems);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems?.map(item =>
        item?.id === itemId
          ? { ...item, quantity: Math.min(newQuantity, item?.maxQuantity) }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(prevItems => prevItems?.filter(item => item?.id !== itemId));
  };

  const handleSaveForLater = (itemId) => {
    const itemToSave = cartItems?.find(item => item?.id === itemId);
    if (itemToSave) {
      const savedItem = {
        ...itemToSave,
        savedDate: 'Just now',
        description: `${itemToSave?.condition} condition ${itemToSave?.category?.toLowerCase()} from ${itemToSave?.location}`
      };
      setSavedItems(prev => [savedItem, ...prev]);
      setCartItems(prev => prev?.filter(item => item?.id !== itemId));
    }
  };

  const handleMoveToCart = (itemId) => {
    const itemToMove = savedItems?.find(item => item?.id === itemId);
    if (itemToMove && itemToMove?.stock > 0) {
      const cartItem = {
        ...itemToMove,
        quantity: 1,
        maxQuantity: itemToMove?.stock
      };
      setCartItems(prev => [...prev, cartItem]);
      setSavedItems(prev => prev?.filter(item => item?.id !== itemId));
    }
  };

  const handleRemoveFromSaved = (itemId) => {
    setSavedItems(prev => prev?.filter(item => item?.id !== itemId));
  };

  const handleProceedToCheckout = () => {
    setIsProcessing(true);
    // Simulate checkout process
    setTimeout(() => {
      setIsProcessing(false);
      // In real app, navigate to checkout page
      alert('Proceeding to secure checkout...');
    }, 2000);
  };

  // Calculate order summary
  const subtotal = cartItems?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);
  const discount = cartItems?.reduce((sum, item) => {
    const itemDiscount = item?.originalPrice ? (item?.originalPrice - item?.price) * item?.quantity : 0;
    return sum + itemDiscount;
  }, 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 9.99; // Free shipping over $50
  const total = subtotal + tax + shipping;
  const itemCount = cartItems?.reduce((sum, item) => sum + item?.quantity, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your cart...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <BreadcrumbNavigation />
          </div>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Shopping Cart
              </h1>
              <p className="text-muted-foreground">
                Review your sustainable marketplace selections
              </p>
            </div>
            
            {cartItems?.length > 0 && (
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  {itemCount} item{itemCount !== 1 ? 's' : ''} • ${total?.toFixed(2)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSavedItems(!showSavedItems)}
                  iconName="Heart"
                  iconPosition="left"
                >
                  Saved ({savedItems?.length})
                </Button>
              </div>
            )}
          </div>

          {/* Main Content */}
          {cartItems?.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {/* Cart Items List */}
                <div className="space-y-4">
                  {cartItems?.map((item) => (
                    <CartItem
                      key={item?.id}
                      item={item}
                      onUpdateQuantity={handleUpdateQuantity}
                      onRemove={handleRemoveItem}
                      onSaveForLater={handleSaveForLater}
                    />
                  ))}
                </div>

                {/* Saved for Later Section */}
                {showSavedItems && savedItems?.length > 0 && (
                  <div className="mt-8">
                    <SavedForLater
                      savedItems={savedItems}
                      onMoveToCart={handleMoveToCart}
                      onRemoveFromSaved={handleRemoveFromSaved}
                    />
                  </div>
                )}

                {/* Additional Actions */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Icon name="Gift" size={18} />
                    Special Offers
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-md">
                      <div className="flex items-center gap-2">
                        <Icon name="Truck" size={16} className="text-success" />
                        <span className="text-sm font-medium text-success">
                          Free shipping on orders over $50
                        </span>
                      </div>
                      <Icon name="Check" size={16} className="text-success" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-2">
                        <Icon name="Percent" size={16} className="text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Add $25 more for 5% eco-discount
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ${(50 - subtotal)?.toFixed(2)} to go
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <OrderSummary
                  subtotal={subtotal}
                  tax={tax}
                  shipping={shipping}
                  discount={discount}
                  total={total}
                  itemCount={itemCount}
                  onProceedToCheckout={handleProceedToCheckout}
                  isProcessing={isProcessing}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const CartIndicator = ({ className = '' }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Mock cart data - in real app, this would come from context/state management
  useEffect(() => {
    // Simulate cart items
    const mockCartItems = [
      { id: 1, name: 'Vintage Wooden Chair', price: 89.99, quantity: 1 },
      { id: 2, name: 'Organic Cotton Shirt', price: 34.50, quantity: 2 }
    ];
    setCartItems(mockCartItems);
  }, []);

  const totalItems = cartItems?.reduce((sum, item) => sum + item?.quantity, 0);
  const totalPrice = cartItems?.reduce((sum, item) => sum + (item?.price * item?.quantity), 0);

  const handleCartUpdate = (newItems) => {
    setCartItems(newItems);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <Link
      to="/shopping-cart"
      className={`relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth hover-lift ${className}`}
      aria-label={`Shopping cart with ${totalItems} items`}
    >
      <div className="relative">
        <Icon name="ShoppingCart" size={24} />
        
        {/* Cart Badge */}
        {totalItems > 0 && (
          <div className={`absolute -top-2 -right-2 min-w-[20px] h-5 bg-accent text-accent-foreground rounded-full flex items-center justify-center text-xs font-medium font-data transition-transform duration-200 ${
            isAnimating ? 'scale-125' : 'scale-100'
          }`}>
            {totalItems > 99 ? '99+' : totalItems}
          </div>
        )}
      </div>
      {/* Tooltip on hover - Desktop only */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover border border-border rounded-md shadow-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-[1100] hidden lg:block">
        <div className="text-sm text-popover-foreground">
          {totalItems > 0 ? (
            <div className="space-y-1">
              <div className="font-medium">{totalItems} item{totalItems !== 1 ? 's' : ''}</div>
              <div className="font-data text-xs text-muted-foreground">
                ${totalPrice?.toFixed(2)}
              </div>
            </div>
          ) : (
            <div className="text-sm">Cart is empty</div>
          )}
        </div>
        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-border"></div>
      </div>
    </Link>
  );
};

export default CartIndicator;
import React, { useState, forwardRef } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductCard = forwardRef(({ product, onAddToCart, className = '' }, ref) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsAddingToCart(true);
    
    try {
      await onAddToCart(product);
    } finally {
      setTimeout(() => setIsAddingToCart(false), 500);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(price);
  };

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'excellent':
        return 'text-success bg-success/10';
      case 'good':
        return 'text-primary bg-primary/10';
      case 'fair':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div 
      ref={ref}
      className={`group bg-card border border-border rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-all duration-200 hover-lift ${className}`}
    >
      <Link to={`/product-detail?id=${product?.id}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product?.mainImage || product?.image || product?.images?.[0]?.url}
            alt={product?.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Condition Badge */}
          <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium ${getConditionColor(product?.condition)}`}>
            {product?.condition}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e?.preventDefault();
              e?.stopPropagation();
            }}
            className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-background"
            aria-label="Add to favorites"
          >
            <Icon name="Heart" size={16} className="text-muted-foreground hover:text-error" />
          </button>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="space-y-2">
            {/* Category */}
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {product?.category?.name || product?.category}
            </div>

            {/* Title */}
            <h3 className="font-heading font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {product?.title}
            </h3>

            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-lg font-bold text-primary">
                  {formatPrice(product?.price)}
                </div>
                {product?.originalPrice && product?.originalPrice > product?.price && (
                  <div className="text-sm text-muted-foreground line-through">
                    {formatPrice(product?.originalPrice)}
                  </div>
                )}
              </div>
              
              {/* Savings Badge */}
              {product?.originalPrice && product?.originalPrice > product?.price && (
                <div className="bg-accent text-accent-foreground px-2 py-1 rounded-md text-xs font-medium">
                  Save {Math.round(((product?.originalPrice - product?.price) / product?.originalPrice) * 100)}%
                </div>
              )}
            </div>

            {/* Seller Info */}
            <div className="flex items-center space-x-2 pt-2">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-muted">
                <Image
                  src={product?.seller?.avatar}
                  alt={product?.seller?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-muted-foreground truncate">
                  {product?.seller?.name}
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {product?.seller?.location || product?.location || 'Location not specified'}
                  </span>
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={12} className="text-warning fill-current" />
                <span className="text-xs text-muted-foreground">
                  {product?.seller?.rating}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      {/* Action Buttons */}
      <div className="px-4 pb-4">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleAddToCart}
            loading={isAddingToCart}
            iconName="ShoppingCart"
            iconPosition="left"
            iconSize={16}
          >
            Add to Cart
          </Button>
          
          <Link to={`/product-detail?id=${product?.id}`}>
            <Button
              variant="default"
              size="sm"
              iconName="Eye"
              iconPosition="left"
              iconSize={16}
            >
              View
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductInfo = ({ product, onAddToCart, onContactSeller }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getConditionColor = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'excellent':
        return 'text-success bg-success/10';
      case 'good':
        return 'text-primary bg-primary/10';
      case 'fair':
        return 'text-warning bg-warning/10';
      case 'poor':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getAvailabilityColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'sold':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Title and Price */}
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-semibold text-foreground">
          {product?.title}
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-4xl font-heading font-bold text-primary">
            {formatPrice(product?.price)}
          </span>
          {product?.originalPrice && product?.originalPrice > product?.price && (
            <span className="text-lg text-muted-foreground line-through">
              {formatPrice(product?.originalPrice)}
            </span>
          )}
        </div>
      </div>
      {/* Product Attributes */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">Category</span>
          <div className="flex items-center space-x-2">
            <Icon name="Tag" size={16} className="text-muted-foreground" />
            <span className="text-foreground font-medium">{product?.category}</span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">Condition</span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(product?.condition)}`}>
            {product?.condition}
          </span>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">Availability</span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(product?.availability)}`}>
            {product?.availability}
          </span>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-muted-foreground">Listed</span>
          <div className="flex items-center space-x-2">
            <Icon name="Calendar" size={16} className="text-muted-foreground" />
            <span className="text-foreground">{formatDate(product?.listedDate)}</span>
          </div>
        </div>
      </div>
      {/* Product Description */}
      <div className="space-y-3">
        <h3 className="text-lg font-heading font-semibold text-foreground">Description</h3>
        <div className="prose prose-sm max-w-none">
          <p className="text-foreground leading-relaxed whitespace-pre-line">
            {product?.description}
          </p>
        </div>
      </div>
      {/* Key Features */}
      {product?.features && product?.features?.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-heading font-semibold text-foreground">Key Features</h3>
          <ul className="space-y-2">
            {product?.features?.map((feature, index) => (
              <li key={index} className="flex items-start space-x-2">
                <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          variant="default"
          size="lg"
          iconName="ShoppingCart"
          iconPosition="left"
          onClick={onAddToCart}
          disabled={product?.availability?.toLowerCase() !== 'available'}
          className="flex-1"
        >
          Add to Cart
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          iconName="MessageCircle"
          iconPosition="left"
          onClick={onContactSeller}
          className="flex-1"
        >
          Contact Seller
        </Button>
      </div>
      {/* Product Stats */}
      <div className="flex items-center space-x-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Eye" size={16} />
          <span>{product?.views || 0} views</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Heart" size={16} />
          <span>{product?.likes || 0} likes</span>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Share2" size={16} />
          <span>Share</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
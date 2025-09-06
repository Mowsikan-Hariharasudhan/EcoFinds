import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RelatedProducts = ({ products = [], title = "Related Products" }) => {
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

  if (!products || products?.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-heading font-semibold text-foreground">
          {title}
        </h2>
        <Link
          to="/product-feed"
          className="text-primary hover:text-primary/80 font-medium text-sm transition-smooth flex items-center space-x-1"
        >
          <span>View all</span>
          <Icon name="ArrowRight" size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => (
          <Link
            key={product?.id}
            to={`/product-detail?id=${product?.id}`}
            className="group bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-all duration-200 hover-lift"
          >
            {/* Product Image */}
            <div className="aspect-square overflow-hidden bg-muted">
              <Image
                src={product?.image}
                alt={product?.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Product Info */}
            <div className="p-4 space-y-3">
              <div className="space-y-2">
                <h3 className="font-medium text-card-foreground line-clamp-2 group-hover:text-primary transition-smooth">
                  {product?.title}
                </h3>
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-primary">
                    {formatPrice(product?.price)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(product?.condition)}`}>
                    {product?.condition}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={14} />
                  <span>{product?.location}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={14} />
                  <span>{product?.timeAgo}</span>
                </div>
              </div>

              {/* Seller Info */}
              <div className="flex items-center space-x-2 pt-2 border-t border-border">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <Image
                    src={product?.seller?.avatar}
                    alt={product?.seller?.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {product?.seller?.username}
                </span>
                {product?.seller?.isVerified && (
                  <Icon name="CheckCircle" size={14} className="text-success" />
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
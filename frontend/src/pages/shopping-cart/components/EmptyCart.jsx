import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyCart = () => {
  const suggestedCategories = [
    { name: 'Furniture', icon: 'Armchair', path: '/product-feed?category=furniture' },
    { name: 'Electronics', icon: 'Smartphone', path: '/product-feed?category=electronics' },
    { name: 'Clothing', icon: 'Shirt', path: '/product-feed?category=clothing' },
    { name: 'Books', icon: 'Book', path: '/product-feed?category=books' }
  ];

  const popularItems = [
    {
      id: 1,
      name: 'Vintage Wooden Chair',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
      category: 'Furniture'
    },
    {
      id: 2,
      name: 'MacBook Pro 2019',
      price: 899.99,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
      category: 'Electronics'
    },
    {
      id: 3,
      name: 'Designer Leather Jacket',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=300&fit=crop',
      category: 'Clothing'
    }
  ];

  return (
    <div className="text-center py-12">
      {/* Empty Cart Icon */}
      <div className="w-24 h-24 mx-auto mb-6 bg-muted/50 rounded-full flex items-center justify-center">
        <Icon name="ShoppingCart" size={48} className="text-muted-foreground" />
      </div>
      {/* Empty State Message */}
      <h2 className="text-2xl font-semibold text-foreground mb-3">
        Your cart is empty
      </h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Looks like you haven't added any sustainable products to your cart yet. 
        Start browsing to find amazing pre-owned items!
      </p>
      {/* Primary Action */}
      <div className="mb-12">
        <Link to="/product-feed">
          <Button
            variant="default"
            size="lg"
            iconName="Search"
            iconPosition="left"
            className="mb-4"
          >
            Browse Products
          </Button>
        </Link>
        <div className="text-sm text-muted-foreground">
          Discover thousands of sustainable products
        </div>
      </div>
      {/* Suggested Categories */}
      <div className="mb-12">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Popular Categories
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {suggestedCategories?.map((category) => (
            <Link
              key={category?.name}
              to={category?.path}
              className="p-4 bg-card border border-border rounded-lg hover:shadow-medium transition-all duration-200 hover-lift group"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon name={category?.icon} size={24} className="text-primary" />
              </div>
              <div className="font-medium text-foreground text-sm">
                {category?.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* Popular Items */}
      <div className="max-w-4xl mx-auto">
        <h3 className="text-lg font-semibold text-foreground mb-6">
          Popular Items
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularItems?.map((item) => (
            <div
              key={item?.id}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-medium transition-all duration-200 hover-lift"
            >
              <div className="w-full h-32 bg-muted rounded-lg overflow-hidden mb-3">
                <img
                  src={item?.image}
                  alt={item?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/assets/images/no_image.png';
                  }}
                />
              </div>
              <h4 className="font-medium text-foreground mb-1 text-sm line-clamp-2">
                {item?.name}
              </h4>
              <p className="text-xs text-muted-foreground mb-2">
                {item?.category}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground font-data">
                  ${item?.price}
                </span>
                <Link to="/product-detail">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Help Section */}
      <div className="mt-12 p-6 bg-muted/30 rounded-lg max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Icon name="HelpCircle" size={20} className="text-primary" />
          <span className="font-medium text-foreground">Need Help?</span>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Have questions about our sustainable marketplace? We're here to help!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" size="sm" iconName="MessageCircle" iconPosition="left">
            Contact Support
          </Button>
          <Button variant="ghost" size="sm" iconName="Book" iconPosition="left">
            Shopping Guide
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;
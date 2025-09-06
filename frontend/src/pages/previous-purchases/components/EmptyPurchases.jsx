import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyPurchases = () => {
  return (
    <div className="text-center py-16">
      <div className="max-w-md mx-auto">
        {/* Empty State Icon */}
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="ShoppingBag" size={48} className="text-muted-foreground" />
        </div>

        {/* Empty State Content */}
        <h3 className="text-xl font-semibold text-foreground mb-3">
          No Purchases Yet
        </h3>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          You haven't made any purchases yet. Start exploring our sustainable marketplace 
          to find amazing second-hand treasures and eco-friendly products.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            variant="default"
            iconName="Search"
            iconPosition="left"
          >
            <Link to="/product-feed">
              Browse Products
            </Link>
          </Button>
          
          <Button
            asChild
            variant="outline"
            iconName="ShoppingCart"
            iconPosition="left"
          >
            <Link to="/shopping-cart">
              View Cart
            </Link>
          </Button>
        </div>

        {/* Benefits Section */}
        <div className="mt-12 p-6 bg-success/5 rounded-lg border border-success/20">
          <div className="flex items-center gap-2 justify-center mb-3">
            <Icon name="Leaf" size={20} className="text-success" />
            <span className="font-medium text-success">Why Shop Second-Hand?</span>
          </div>
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-success" />
              <span>Reduce environmental impact</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-success" />
              <span>Save money on quality items</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-success" />
              <span>Support circular economy</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Check" size={16} className="text-success" />
              <span>Find unique and vintage items</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyPurchases;
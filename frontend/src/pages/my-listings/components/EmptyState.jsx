import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ statusFilter }) => {
  const getEmptyStateContent = () => {
    switch (statusFilter) {
      case 'active':
        return {
          icon: 'CheckCircle',
          title: 'No Active Listings',
          description: 'You don\'t have any active listings at the moment. Activate some of your inactive listings or create new ones.',
          actionText: 'View All Listings',
          actionPath: '/my-listings'
        };
      case 'inactive':
        return {
          icon: 'Clock',
          title: 'No Inactive Listings',
          description: 'All your listings are currently active. Great job keeping your inventory live!',
          actionText: 'View All Listings',
          actionPath: '/my-listings'
        };
      case 'sold':
        return {
          icon: 'Package',
          title: 'No Sold Items',
          description: 'You haven\'t sold any items yet. Keep promoting your listings to attract buyers.',
          actionText: 'View Active Listings',
          actionPath: '/my-listings'
        };
      default:
        return {
          icon: 'Package',
          title: 'No Listings Yet',
          description: 'Start your sustainable selling journey by creating your first product listing. Share items you no longer need with eco-conscious buyers.',
          actionText: 'Create First Listing',
          actionPath: '/add-product'
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
        <Icon name={content?.icon} size={48} className="text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2 text-center">
        {content?.title}
      </h3>
      <p className="text-muted-foreground text-center max-w-md mb-8 leading-relaxed">
        {content?.description}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        {statusFilter === 'all' ? (
          <Button
            as={Link}
            to={content?.actionPath}
            variant="default"
            iconName="Plus"
            iconPosition="left"
            iconSize={18}
          >
            {content?.actionText}
          </Button>
        ) : (
          <Button
            as={Link}
            to="/my-listings"
            variant="outline"
            iconName="ArrowLeft"
            iconPosition="left"
            iconSize={18}
          >
            {content?.actionText}
          </Button>
        )}
        
        {statusFilter !== 'all' && (
          <Button
            as={Link}
            to="/add-product"
            variant="default"
            iconName="Plus"
            iconPosition="left"
            iconSize={18}
          >
            Add New Listing
          </Button>
        )}
      </div>
      {/* Tips Section */}
      <div className="mt-12 max-w-2xl">
        <h4 className="text-lg font-medium text-foreground mb-4 text-center">
          Tips for Successful Selling
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-card border border-border rounded-lg">
            <Icon name="Camera" size={24} className="text-primary mx-auto mb-2" />
            <h5 className="font-medium text-card-foreground mb-1">Quality Photos</h5>
            <p className="text-sm text-muted-foreground">Use clear, well-lit photos from multiple angles</p>
          </div>
          <div className="text-center p-4 bg-card border border-border rounded-lg">
            <Icon name="FileText" size={24} className="text-primary mx-auto mb-2" />
            <h5 className="font-medium text-card-foreground mb-1">Detailed Descriptions</h5>
            <p className="text-sm text-muted-foreground">Include condition, dimensions, and key features</p>
          </div>
          <div className="text-center p-4 bg-card border border-border rounded-lg">
            <Icon name="DollarSign" size={24} className="text-primary mx-auto mb-2" />
            <h5 className="font-medium text-card-foreground mb-1">Fair Pricing</h5>
            <p className="text-sm text-muted-foreground">Research similar items to set competitive prices</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
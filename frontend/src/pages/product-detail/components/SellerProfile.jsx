import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SellerProfile = ({ seller, onContactSeller, onViewProfile }) => {
  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={16} className="text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="Star" size={16} className="text-warning fill-current opacity-50" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={16} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  const getVerificationBadge = (isVerified) => {
    if (!isVerified) return null;
    
    return (
      <div className="flex items-center space-x-1 text-success">
        <Icon name="CheckCircle" size={16} />
        <span className="text-xs font-medium">Verified</span>
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-soft space-y-4">
      <h3 className="text-lg font-heading font-semibold text-card-foreground mb-4">
        Seller Information
      </h3>
      {/* Seller Avatar and Basic Info */}
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border flex-shrink-0">
          <Image
            src={seller?.avatar}
            alt={seller?.username}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center space-x-2">
            <h4 className="text-lg font-medium text-card-foreground">
              {seller?.username}
            </h4>
            {getVerificationBadge(seller?.isVerified)}
          </div>
          
          <div className="flex items-center space-x-1">
            {getRatingStars(seller?.rating)}
            <span className="text-sm text-muted-foreground ml-2">
              ({seller?.reviewCount} reviews)
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Calendar" size={14} />
            <span>Member since {formatDate(seller?.joinDate)}</span>
          </div>
        </div>
      </div>
      {/* Seller Stats */}
      <div className="grid grid-cols-3 gap-4 py-4 border-t border-border">
        <div className="text-center">
          <div className="text-lg font-semibold text-card-foreground">
            {seller?.totalListings}
          </div>
          <div className="text-xs text-muted-foreground">Listings</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-card-foreground">
            {seller?.completedSales}
          </div>
          <div className="text-xs text-muted-foreground">Sales</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-card-foreground">
            {seller?.responseRate}%
          </div>
          <div className="text-xs text-muted-foreground">Response</div>
        </div>
      </div>
      {/* Seller Description */}
      {seller?.bio && (
        <div className="space-y-2">
          <h5 className="font-medium text-card-foreground">About</h5>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {seller?.bio}
          </p>
        </div>
      )}
      {/* Trust Indicators */}
      <div className="space-y-2">
        <h5 className="font-medium text-card-foreground">Trust & Safety</h5>
        <div className="space-y-1">
          {seller?.isVerified && (
            <div className="flex items-center space-x-2 text-sm">
              <Icon name="Shield" size={14} className="text-success" />
              <span className="text-muted-foreground">Identity verified</span>
            </div>
          )}
          
          {seller?.hasPhoneVerified && (
            <div className="flex items-center space-x-2 text-sm">
              <Icon name="Phone" size={14} className="text-success" />
              <span className="text-muted-foreground">Phone verified</span>
            </div>
          )}
          
          {seller?.hasEmailVerified && (
            <div className="flex items-center space-x-2 text-sm">
              <Icon name="Mail" size={14} className="text-success" />
              <span className="text-muted-foreground">Email verified</span>
            </div>
          )}
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col space-y-2 pt-4 border-t border-border">
        <Button
          variant="default"
          size="sm"
          iconName="MessageCircle"
          iconPosition="left"
          onClick={onContactSeller}
          fullWidth
        >
          Contact Seller
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          iconName="User"
          iconPosition="left"
          onClick={onViewProfile}
          fullWidth
        >
          View Profile
        </Button>
      </div>
      {/* Last Active */}
      <div className="text-xs text-muted-foreground text-center pt-2">
        Last active: {seller?.lastActive}
      </div>
    </div>
  );
};

export default SellerProfile;
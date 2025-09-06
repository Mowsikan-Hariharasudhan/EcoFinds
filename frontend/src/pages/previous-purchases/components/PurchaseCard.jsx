import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PurchaseCard = ({ purchase, onReorder, onReview, onReportIssue }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'text-success bg-success/10';
      case 'shipped':
        return 'text-primary bg-primary/10';
      case 'processing':
        return 'text-warning bg-warning/10';
      case 'cancelled':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft hover:shadow-medium transition-smooth">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        {/* Product Image */}
        <div className="w-full lg:w-32 h-32 rounded-md overflow-hidden bg-muted flex-shrink-0">
          <Image
            src={purchase?.product?.image}
            alt={purchase?.product?.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Purchase Details */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
            <div>
              <Link
                to={`/product-detail?id=${purchase?.product?.id}`}
                className="text-lg font-semibold text-foreground hover:text-primary transition-smooth"
              >
                {purchase?.product?.title}
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                Sold by {purchase?.seller?.name}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-foreground">
                ${purchase?.totalAmount?.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                Qty: {purchase?.quantity}
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={16} className="text-muted-foreground" />
              <span className="text-muted-foreground">
                Ordered: {formatDate(purchase?.orderDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="CreditCard" size={16} className="text-muted-foreground" />
              <span className="text-muted-foreground">
                {purchase?.paymentMethod}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Hash" size={16} className="text-muted-foreground" />
              <span className="text-muted-foreground font-data">
                {purchase?.orderId}
              </span>
            </div>
          </div>

          {/* Status and Tracking */}
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(purchase?.status)}`}>
              {purchase?.status}
            </span>
            {purchase?.trackingNumber && (
              <div className="flex items-center gap-2 text-sm">
                <Icon name="Truck" size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground">
                  Tracking: {purchase?.trackingNumber}
                </span>
              </div>
            )}
            {purchase?.deliveryDate && (
              <div className="flex items-center gap-2 text-sm">
                <Icon name="Package" size={16} className="text-muted-foreground" />
                <span className="text-muted-foreground">
                  Delivered: {formatDate(purchase?.deliveryDate)}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              iconName="RotateCcw"
              iconPosition="left"
              onClick={() => onReorder(purchase)}
            >
              Reorder
            </Button>
            
            {purchase?.status?.toLowerCase() === 'delivered' && !purchase?.hasReview && (
              <Button
                variant="outline"
                size="sm"
                iconName="Star"
                iconPosition="left"
                onClick={() => onReview(purchase)}
              >
                Leave Review
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              iconName="MessageCircle"
              iconPosition="left"
            >
              Contact Seller
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              iconName="AlertTriangle"
              iconPosition="left"
              onClick={() => onReportIssue(purchase)}
            >
              Report Issue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCard;
import React, { useState } from 'react';

import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ListingCard = ({ listing, onEdit, onDelete, onToggleStatus }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-success bg-success/10';
      case 'inactive':
        return 'text-warning bg-warning/10';
      case 'sold':
        return 'text-muted-foreground bg-muted';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return 'CheckCircle';
      case 'inactive':
        return 'Clock';
      case 'sold':
        return 'Package';
      default:
        return 'Circle';
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(listing?.id);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft hover:shadow-medium transition-all duration-200 overflow-hidden">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={listing?.image}
          alt={listing?.title}
          className="w-full h-full object-cover"
        />
        
        {/* Status Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium flex items-center space-x-1 ${getStatusColor(listing?.status)}`}>
          <Icon name={getStatusIcon(listing?.status)} size={12} />
          <span className="capitalize">{listing?.status}</span>
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => onEdit(listing)}
            className="w-8 h-8 bg-background/80 backdrop-blur-sm"
          >
            <Icon name="Edit2" size={14} />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={handleDeleteClick}
            className="w-8 h-8 bg-background/80 backdrop-blur-sm"
          >
            <Icon name="Trash2" size={14} />
          </Button>
        </div>
      </div>
      {/* Product Details */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-card-foreground line-clamp-2 flex-1 mr-2">
            {listing?.title}
          </h3>
          <div className="text-lg font-bold text-primary font-data">
            ${listing?.price}
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {listing?.description}
        </p>

        {/* Listing Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Icon name="Eye" size={12} />
              <span>{listing?.views} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="MessageCircle" size={12} />
              <span>{listing?.inquiries} inquiries</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={12} />
            <span>Listed {formatDate(listing?.createdAt)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(listing)}
            className="flex-1"
            iconName="Edit2"
            iconPosition="left"
            iconSize={14}
          >
            Edit
          </Button>
          
          <Button
            variant={listing?.status === 'active' ? 'secondary' : 'default'}
            size="sm"
            onClick={() => onToggleStatus(listing?.id, listing?.status)}
            className="flex-1"
            iconName={listing?.status === 'active' ? 'Pause' : 'Play'}
            iconPosition="left"
            iconSize={14}
          >
            {listing?.status === 'active' ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-prominent max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Delete Listing</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete "{listing?.title}"? This will permanently remove the listing and all associated data.
            </p>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleCancelDelete}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingCard;
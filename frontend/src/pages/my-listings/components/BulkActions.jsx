import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const BulkActions = ({ 
  selectedListings, 
  onSelectAll, 
  onDeselectAll, 
  onBulkDelete, 
  onBulkStatusChange,
  totalListings,
  isAllSelected 
}) => {
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  const handleSelectAllChange = (checked) => {
    if (checked) {
      onSelectAll();
    } else {
      onDeselectAll();
    }
  };

  const handleBulkDelete = () => {
    setShowBulkDeleteConfirm(true);
  };

  const handleConfirmBulkDelete = () => {
    onBulkDelete(selectedListings);
    setShowBulkDeleteConfirm(false);
  };

  const handleCancelBulkDelete = () => {
    setShowBulkDeleteConfirm(false);
  };

  if (selectedListings?.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          {/* Selection Info */}
          <div className="flex items-center space-x-4">
            <Checkbox
              checked={isAllSelected}
              onChange={(e) => handleSelectAllChange(e?.target?.checked)}
              label={`${selectedListings?.length} of ${totalListings} selected`}
            />
          </div>

          {/* Bulk Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkStatusChange(selectedListings, 'active')}
              iconName="Play"
              iconPosition="left"
              iconSize={14}
            >
              Activate
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkStatusChange(selectedListings, 'inactive')}
              iconName="Pause"
              iconPosition="left"
              iconSize={14}
            >
              Deactivate
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkStatusChange(selectedListings, 'sold')}
              iconName="Package"
              iconPosition="left"
              iconSize={14}
            >
              Mark as Sold
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              iconName="Trash2"
              iconPosition="left"
              iconSize={14}
            >
              Delete ({selectedListings?.length})
            </Button>
          </div>
        </div>
      </div>
      {/* Bulk Delete Confirmation Modal */}
      {showBulkDeleteConfirm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg shadow-prominent max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} className="text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">Delete Multiple Listings</h3>
                <p className="text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete {selectedListings?.length} selected listing{selectedListings?.length !== 1 ? 's' : ''}? This will permanently remove all selected listings and their associated data.
            </p>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleCancelBulkDelete}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmBulkDelete}
                className="flex-1"
              >
                Delete {selectedListings?.length} Listing{selectedListings?.length !== 1 ? 's' : ''}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BulkActions;
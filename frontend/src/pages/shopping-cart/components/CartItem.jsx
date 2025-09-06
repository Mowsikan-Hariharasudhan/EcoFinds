import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CartItem = ({ item, onUpdateQuantity, onRemove, onSaveForLater }) => {
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      await onUpdateQuantity(item?.id, newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = () => {
    onRemove(item?.id);
    setShowRemoveConfirm(false);
  };

  const handleSaveForLater = () => {
    onSaveForLater(item?.id);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-6 shadow-soft">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-full sm:w-24 md:w-32 h-32 bg-muted rounded-lg overflow-hidden">
            <Image
              src={item?.image}
              alt={item?.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground text-lg mb-1 line-clamp-2">
                {item?.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                Category: {item?.category}
              </p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">Condition:</span>
                <span className="text-sm font-medium text-success">{item?.condition}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="MapPin" size={14} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{item?.location}</span>
              </div>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground font-data">
                ${item?.price?.toFixed(2)}
              </div>
              {item?.originalPrice && item?.originalPrice > item?.price && (
                <div className="text-sm text-muted-foreground line-through">
                  ${item?.originalPrice?.toFixed(2)}
                </div>
              )}
            </div>
          </div>

          {/* Quantity Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground">Quantity:</span>
              <div className="flex items-center border border-border rounded-md">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(item?.quantity - 1)}
                  disabled={item?.quantity <= 1 || isUpdating}
                  className="h-8 w-8 p-0 rounded-none border-r border-border"
                >
                  <Icon name="Minus" size={14} />
                </Button>
                <span className="px-3 py-1 text-sm font-medium font-data min-w-[3rem] text-center">
                  {item?.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuantityChange(item?.quantity + 1)}
                  disabled={item?.quantity >= item?.maxQuantity || isUpdating}
                  className="h-8 w-8 p-0 rounded-none border-l border-border"
                >
                  <Icon name="Plus" size={14} />
                </Button>
              </div>
              {item?.quantity >= item?.maxQuantity && (
                <span className="text-xs text-warning">Max available</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSaveForLater}
                iconName="Heart"
                iconPosition="left"
                className="text-muted-foreground hover:text-foreground"
              >
                Save for Later
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRemoveConfirm(true)}
                iconName="Trash2"
                iconPosition="left"
                className="text-muted-foreground hover:text-error"
              >
                Remove
              </Button>
            </div>
          </div>

          {/* Stock Warning */}
          {item?.quantity > item?.stock && (
            <div className="mt-3 p-2 bg-warning/10 border border-warning/20 rounded-md">
              <div className="flex items-center gap-2">
                <Icon name="AlertTriangle" size={16} className="text-warning" />
                <span className="text-sm text-warning">
                  Only {item?.stock} items available. Quantity will be adjusted.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Remove Confirmation Modal */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-popover border border-border rounded-lg p-6 max-w-md w-full shadow-prominent">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center">
                <Icon name="Trash2" size={20} className="text-error" />
              </div>
              <div>
                <h3 className="font-semibold text-popover-foreground">Remove Item</h3>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to remove this item from your cart?
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowRemoveConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRemove}
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartItem;
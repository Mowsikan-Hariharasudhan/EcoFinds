import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SavedForLater = ({ savedItems, onMoveToCart, onRemoveFromSaved }) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpanded = (itemId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded?.has(itemId)) {
      newExpanded?.delete(itemId);
    } else {
      newExpanded?.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  if (savedItems?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <Icon name="Heart" size={32} className="text-muted-foreground mx-auto mb-3" />
        <h3 className="font-medium text-foreground mb-2">No saved items</h3>
        <p className="text-sm text-muted-foreground">
          Items you save for later will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Icon name="Heart" size={20} />
          Saved for Later ({savedItems?.length})
        </h2>
      </div>
      <div className="space-y-4">
        {savedItems?.map((item) => {
          const isExpanded = expandedItems?.has(item?.id);
          
          return (
            <div key={item?.id} className="border border-border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <div className="w-full sm:w-20 h-20 bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={item?.image}
                      alt={item?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1 line-clamp-1">
                        {item?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {item?.category}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon name="MapPin" size={12} />
                        <span>{item?.location}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground font-data">
                        ${item?.price?.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Saved {item?.savedDate}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-2">
                        {item?.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Condition:</span>
                          <span className="font-medium text-success">{item?.condition}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground">Stock:</span>
                          <span className="font-medium text-foreground">{item?.stock}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-3">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onMoveToCart(item?.id)}
                        iconName="ShoppingCart"
                        iconPosition="left"
                      >
                        Move to Cart
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(item?.id)}
                        iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                        iconPosition="right"
                      >
                        {isExpanded ? 'Less' : 'More'}
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFromSaved(item?.id)}
                      iconName="X"
                      iconPosition="left"
                      className="text-muted-foreground hover:text-error"
                    >
                      Remove
                    </Button>
                  </div>

                  {/* Availability Status */}
                  {item?.stock === 0 && (
                    <div className="mt-2 p-2 bg-error/10 border border-error/20 rounded-md">
                      <div className="flex items-center gap-2">
                        <Icon name="AlertCircle" size={14} className="text-error" />
                        <span className="text-sm text-error">Currently out of stock</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Bulk Actions */}
      {savedItems?.length > 1 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              size="sm"
              iconName="ShoppingCart"
              iconPosition="left"
              onClick={() => savedItems?.forEach(item => onMoveToCart(item?.id))}
            >
              Move All to Cart
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="Trash2"
              iconPosition="left"
              className="text-muted-foreground hover:text-error"
              onClick={() => savedItems?.forEach(item => onRemoveFromSaved(item?.id))}
            >
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedForLater;
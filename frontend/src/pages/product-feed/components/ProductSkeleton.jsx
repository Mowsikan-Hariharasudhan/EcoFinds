import React from 'react';

const ProductSkeleton = ({ className = '' }) => {
  return (
    <div className={`bg-card border border-border rounded-lg overflow-hidden shadow-soft animate-pulse ${className}`}>
      {/* Image Skeleton */}
      <div className="aspect-square bg-muted"></div>
      
      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <div className="h-3 bg-muted rounded w-1/3"></div>
        
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="h-5 bg-muted rounded w-1/4"></div>
          <div className="h-4 bg-muted rounded w-1/5"></div>
        </div>
        
        {/* Seller Info */}
        <div className="flex items-center space-x-2 pt-2">
          <div className="w-6 h-6 bg-muted rounded-full"></div>
          <div className="flex-1 space-y-1">
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="h-3 bg-muted rounded w-1/3"></div>
          </div>
          <div className="h-3 bg-muted rounded w-8"></div>
        </div>
      </div>
      
      {/* Action Buttons Skeleton */}
      <div className="px-4 pb-4">
        <div className="flex space-x-2">
          <div className="flex-1 h-8 bg-muted rounded"></div>
          <div className="w-16 h-8 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
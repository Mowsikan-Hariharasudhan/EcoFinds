import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProductGrid = ({ 
  products, 
  loading, 
  hasMore, 
  onLoadMore, 
  onAddToCart,
  className = '' 
}) => {
  const [cartNotification, setCartNotification] = useState(null);
  const observerRef = useRef();
  const loadingRef = useRef();

  // Infinite scroll implementation
  const lastProductElementRef = useCallback(node => {
    if (loading) return;
    if (observerRef?.current) observerRef?.current?.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });
    
    if (node) observerRef?.current?.observe(node);
  }, [loading, hasMore, onLoadMore]);

  const handleAddToCart = async (product) => {
    try {
      await onAddToCart(product);
      setCartNotification({
        product,
        timestamp: Date.now()
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setCartNotification(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  // Generate skeleton items for loading state
  const renderSkeletons = () => {
    return Array.from({ length: 8 }, (_, index) => (
      <ProductSkeleton key={`skeleton-${index}`} />
    ));
  };

  if (!loading && products?.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Icon name="Package" size={48} className="text-muted-foreground" />
        </div>
        <h3 className="font-heading font-semibold text-xl text-foreground mb-2">
          No products found
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
        <Button
          variant="outline"
          onClick={() => window.location?.reload()}
          iconName="RefreshCw"
          iconPosition="left"
          iconSize={16}
        >
          Refresh Results
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product, index) => {
          const isLast = index === products?.length - 1;
          return (
            <ProductCard
              key={product?.id}
              product={product}
              onAddToCart={handleAddToCart}
              ref={isLast ? lastProductElementRef : null}
            />
          );
        })}
        
        {/* Loading Skeletons */}
        {loading && renderSkeletons()}
      </div>
      {/* Load More Button (fallback for infinite scroll) */}
      {!loading && hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            onClick={onLoadMore}
            iconName="ChevronDown"
            iconPosition="right"
            iconSize={16}
          >
            Load More Products
          </Button>
        </div>
      )}
      {/* End of Results Message */}
      {!loading && !hasMore && products?.length > 0 && (
        <div className="text-center py-8">
          <div className="text-muted-foreground">
            You've reached the end of the results
          </div>
        </div>
      )}
      {/* Loading Indicator for Infinite Scroll */}
      {loading && products?.length > 0 && (
        <div ref={loadingRef} className="flex justify-center py-8">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Loading more products...</span>
          </div>
        </div>
      )}
      {/* Cart Notification */}
      {cartNotification && (
        <div className="fixed bottom-4 right-4 z-[1100] animate-slide-in">
          <div className="bg-success text-success-foreground px-4 py-3 rounded-lg shadow-prominent flex items-center space-x-3 max-w-sm">
            <Icon name="CheckCircle" size={20} />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">Added to cart!</div>
              <div className="text-xs opacity-90 truncate">
                {cartNotification?.product?.title}
              </div>
            </div>
            <button
              onClick={() => setCartNotification(null)}
              className="text-success-foreground/80 hover:text-success-foreground"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
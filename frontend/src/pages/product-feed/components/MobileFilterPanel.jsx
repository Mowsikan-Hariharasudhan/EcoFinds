import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const MobileFilterPanel = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  sortBy, 
  onSortChange,
  totalResults = 0,
  categories = []
}) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [localSortBy, setLocalSortBy] = useState(sortBy);
  const [priceRange, setPriceRange] = useState([filters?.minPrice || 0, filters?.maxPrice || 1000]);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...(Array.isArray(categories) ? categories.map(cat => ({
      value: cat.slug || cat._id,
      label: cat.name
    })) : [])
  ];

  const conditions = [
    { value: 'all', label: 'All Conditions' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'rating', label: 'Highest Rated' }
  ];

  const handleCategoryChange = (category) => {
    setLocalFilters({
      ...localFilters,
      category: category === 'all' ? '' : category
    });
  };

  const handleConditionChange = (condition) => {
    setLocalFilters({
      ...localFilters,
      condition: condition === 'all' ? '' : condition
    });
  };

  const handlePriceRangeChange = (min, max) => {
    setPriceRange([min, max]);
    setLocalFilters({
      ...localFilters,
      minPrice: min,
      maxPrice: max
    });
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onSortChange(localSortBy);
    onClose();
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      category: '',
      condition: '',
      minPrice: 0,
      maxPrice: 1000,
      searchQuery: localFilters?.searchQuery || ''
    };
    setLocalFilters(clearedFilters);
    setLocalSortBy('relevance');
    setPriceRange([0, 1000]);
  };

  const hasActiveFilters = localFilters?.category || localFilters?.condition || localFilters?.minPrice > 0 || localFilters?.maxPrice < 1000;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] lg:hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-card border-l border-border shadow-prominent animate-slide-in">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="space-y-1">
              <h2 className="font-heading font-semibold text-lg text-card-foreground">
                Filters & Sort
              </h2>
              <div className="text-sm text-muted-foreground">
                {totalResults?.toLocaleString()} products found
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
            >
              <Icon name="X" size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Sort Options */}
            <div className="space-y-3">
              <h3 className="font-heading font-medium text-card-foreground">Sort By</h3>
              <Select
                options={sortOptions}
                value={localSortBy}
                onChange={setLocalSortBy}
                className="w-full"
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <h3 className="font-heading font-medium text-card-foreground">Category</h3>
              <Select
                options={categoryOptions}
                value={localFilters?.category || 'all'}
                onChange={handleCategoryChange}
                className="w-full"
              />
            </div>

            {/* Condition Filter */}
            <div className="space-y-3">
              <h3 className="font-heading font-medium text-card-foreground">Condition</h3>
              <Select
                options={conditions}
                value={localFilters?.condition || 'all'}
                onChange={handleConditionChange}
                className="w-full"
              />
            </div>

            {/* Price Range */}
            <div className="space-y-3">
              <h3 className="font-heading font-medium text-card-foreground">Price Range</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange?.[0]}
                    onChange={(e) => handlePriceRangeChange(parseInt(e?.target?.value) || 0, priceRange?.[1])}
                    className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <span className="text-muted-foreground">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange?.[1]}
                    onChange={(e) => handlePriceRangeChange(priceRange?.[0], parseInt(e?.target?.value) || 1000)}
                    className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  ${priceRange?.[0]} - ${priceRange?.[1]}
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-medium text-card-foreground">Active Filters</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    iconName="X"
                    iconPosition="left"
                    iconSize={14}
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {localFilters?.category && (
                    <div className="flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      <span>{categoryOptions?.find(c => c?.value === localFilters?.category)?.label}</span>
                      <button
                        onClick={() => handleCategoryChange('all')}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </div>
                  )}
                  
                  {localFilters?.condition && (
                    <div className="flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      <span>{conditions?.find(c => c?.value === localFilters?.condition)?.label}</span>
                      <button
                        onClick={() => handleConditionChange('all')}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </div>
                  )}
                  
                  {(localFilters?.minPrice > 0 || localFilters?.maxPrice < 1000) && (
                    <div className="flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      <span>${localFilters?.minPrice} - ${localFilters?.maxPrice}</span>
                      <button
                        onClick={() => handlePriceRangeChange(0, 1000)}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <Icon name="X" size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border space-y-3">
            <Button
              variant="default"
              fullWidth
              onClick={applyFilters}
              iconName="Check"
              iconPosition="left"
              iconSize={16}
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterPanel;
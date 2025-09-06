import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const FilterToolbar = ({ 
  filters, 
  onFiltersChange, 
  sortBy, 
  onSortChange, 
  totalResults = 0,
  onToggleMobileFilters,
  categories = [],
  className = '' 
}) => {
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
    onFiltersChange({
      ...filters,
      category: category === 'all' ? '' : category
    });
  };

  const handleConditionChange = (condition) => {
    onFiltersChange({
      ...filters,
      condition: condition === 'all' ? '' : condition
    });
  };

  const handlePriceRangeChange = (min, max) => {
    setPriceRange([min, max]);
    onFiltersChange({
      ...filters,
      minPrice: min,
      maxPrice: max
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      category: '',
      condition: '',
      minPrice: 0,
      maxPrice: 1000,
      searchQuery: filters?.searchQuery || ''
    });
    setPriceRange([0, 1000]);
  };

  const hasActiveFilters = filters?.category || filters?.condition || filters?.minPrice > 0 || filters?.maxPrice < 1000;

  return (
    <div className={`bg-card border border-border rounded-lg p-4 space-y-4 ${className}`}>
      {/* Mobile Filter Toggle */}
      <div className="flex items-center justify-between lg:hidden">
        <div className="text-sm text-muted-foreground">
          {totalResults?.toLocaleString()} products found
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggleMobileFilters}
          iconName="Filter"
          iconPosition="left"
          iconSize={16}
        >
          Filters
        </Button>
      </div>
      {/* Desktop Filters */}
      <div className="hidden lg:block space-y-4">
        {/* Results Count & Clear Filters */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {totalResults?.toLocaleString()} products found
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              iconName="X"
              iconPosition="left"
              iconSize={14}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category Filter */}
          <Select
            label="Category"
            options={categoryOptions}
            value={filters?.category || 'all'}
            onChange={handleCategoryChange}
            className="w-full"
          />

          {/* Condition Filter */}
          <Select
            label="Condition"
            options={conditions}
            value={filters?.condition || 'all'}
            onChange={handleConditionChange}
            className="w-full"
          />

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Price Range</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange?.[0]}
                onChange={(e) => handlePriceRangeChange(parseInt(e?.target?.value) || 0, priceRange?.[1])}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-muted-foreground">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange?.[1]}
                onChange={(e) => handlePriceRangeChange(priceRange?.[0], parseInt(e?.target?.value) || 1000)}
                className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Sort Options */}
          <Select
            label="Sort By"
            options={sortOptions}
            value={sortBy}
            onChange={onSortChange}
            className="w-full"
          />
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {filters?.category && (
              <div className="flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                <span>{categoryOptions?.find(c => c?.value === filters?.category)?.label}</span>
                <button
                  onClick={() => handleCategoryChange('all')}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
            
            {filters?.condition && (
              <div className="flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                <span>{conditions?.find(c => c?.value === filters?.condition)?.label}</span>
                <button
                  onClick={() => handleConditionChange('all')}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
            
            {(filters?.minPrice > 0 || filters?.maxPrice < 1000) && (
              <div className="flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                <span>${filters?.minPrice} - ${filters?.maxPrice}</span>
                <button
                  onClick={() => handlePriceRangeChange(0, 1000)}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterToolbar;
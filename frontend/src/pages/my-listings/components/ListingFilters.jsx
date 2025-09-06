import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ListingFilters = ({ 
  statusFilter, 
  onStatusFilterChange, 
  sortBy, 
  onSortChange, 
  viewMode, 
  onViewModeChange,
  totalListings,
  activeListings 
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Listings' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'sold', label: 'Sold' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'most-viewed', label: 'Most Viewed' },
    { value: 'most-inquiries', label: 'Most Inquiries' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        {/* Left Section - Stats and Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
          {/* Listing Stats */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Icon name="Package" size={16} />
              <span>{totalListings} total</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="CheckCircle" size={16} className="text-success" />
              <span>{activeListings} active</span>
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-card-foreground whitespace-nowrap">Status:</span>
            <div className="min-w-[140px]">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={onStatusFilterChange}
                placeholder="Filter by status"
              />
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-card-foreground whitespace-nowrap">Sort by:</span>
            <div className="min-w-[160px]">
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={onSortChange}
                placeholder="Sort listings"
              />
            </div>
          </div>
        </div>

        {/* Right Section - View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-card-foreground">View:</span>
          <div className="flex bg-muted rounded-md p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="px-3 py-1.5"
            >
              <Icon name="Grid3X3" size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="px-3 py-1.5"
            >
              <Icon name="List" size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingFilters;
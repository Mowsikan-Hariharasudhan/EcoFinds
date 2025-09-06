import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PurchaseFilters = ({ onFiltersChange, totalPurchases }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'last7days', label: 'Last 7 Days' },
    { value: 'last30days', label: 'Last 30 Days' },
    { value: 'last3months', label: 'Last 3 Months' },
    { value: 'last6months', label: 'Last 6 Months' },
    { value: 'lastyear', label: 'Last Year' }
  ];

  const priceRangeOptions = [
    { value: 'all', label: 'Any Price' },
    { value: '0-25', label: 'Under $25' },
    { value: '25-50', label: '$25 - $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: '200+', label: 'Over $200' }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing & Fashion' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'books', label: 'Books & Media' },
    { value: 'sports', label: 'Sports & Outdoors' },
    { value: 'toys', label: 'Toys & Games' },
    { value: 'beauty', label: 'Beauty & Personal Care' },
    { value: 'automotive', label: 'Automotive' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'processing', label: 'Processing' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'name-az', label: 'Name: A to Z' },
    { value: 'name-za', label: 'Name: Z to A' }
  ];

  const handleFilterChange = (filterType, value) => {
    const filters = {
      searchQuery,
      dateRange,
      priceRange,
      category,
      status,
      sortBy,
      [filterType]: value
    };

    // Update local state
    switch (filterType) {
      case 'searchQuery':
        setSearchQuery(value);
        break;
      case 'dateRange':
        setDateRange(value);
        break;
      case 'priceRange':
        setPriceRange(value);
        break;
      case 'category':
        setCategory(value);
        break;
      case 'status':
        setStatus(value);
        break;
      case 'sortBy':
        setSortBy(value);
        break;
    }

    onFiltersChange(filters);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setDateRange('all');
    setPriceRange('all');
    setCategory('all');
    setStatus('all');
    setSortBy('newest');
    
    onFiltersChange({
      searchQuery: '',
      dateRange: 'all',
      priceRange: 'all',
      category: 'all',
      status: 'all',
      sortBy: 'newest'
    });
  };

  const hasActiveFilters = searchQuery || dateRange !== 'all' || priceRange !== 'all' || 
                          category !== 'all' || status !== 'all';

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Filter Purchases</h3>
          <p className="text-sm text-muted-foreground">
            {totalPurchases} purchase{totalPurchases !== 1 ? 's' : ''} found
          </p>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            iconName="X"
            iconPosition="left"
            onClick={clearAllFilters}
          >
            Clear Filters
          </Button>
        )}
      </div>
      {/* Search */}
      <div className="mb-4">
        <Input
          type="search"
          placeholder="Search purchases by product name, seller, or order ID..."
          value={searchQuery}
          onChange={(e) => handleFilterChange('searchQuery', e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Filter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-4">
        <Select
          label="Date Range"
          options={dateRangeOptions}
          value={dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
        />

        <Select
          label="Price Range"
          options={priceRangeOptions}
          value={priceRange}
          onChange={(value) => handleFilterChange('priceRange', value)}
        />

        <Select
          label="Category"
          options={categoryOptions}
          value={category}
          onChange={(value) => handleFilterChange('category', value)}
        />

        <Select
          label="Status"
          options={statusOptions}
          value={status}
          onChange={(value) => handleFilterChange('status', value)}
        />

        <Select
          label="Sort By"
          options={sortOptions}
          value={sortBy}
          onChange={(value) => handleFilterChange('sortBy', value)}
        />
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              Search: "{searchQuery}"
              <button
                onClick={() => handleFilterChange('searchQuery', '')}
                className="hover:text-primary/80"
              >
                <Icon name="X" size={14} />
              </button>
            </span>
          )}
          {dateRange !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {dateRangeOptions?.find(opt => opt?.value === dateRange)?.label}
              <button
                onClick={() => handleFilterChange('dateRange', 'all')}
                className="hover:text-primary/80"
              >
                <Icon name="X" size={14} />
              </button>
            </span>
          )}
          {priceRange !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {priceRangeOptions?.find(opt => opt?.value === priceRange)?.label}
              <button
                onClick={() => handleFilterChange('priceRange', 'all')}
                className="hover:text-primary/80"
              >
                <Icon name="X" size={14} />
              </button>
            </span>
          )}
          {category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {categoryOptions?.find(opt => opt?.value === category)?.label}
              <button
                onClick={() => handleFilterChange('category', 'all')}
                className="hover:text-primary/80"
              >
                <Icon name="X" size={14} />
              </button>
            </span>
          )}
          {status !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
              {statusOptions?.find(opt => opt?.value === status)?.label}
              <button
                onClick={() => handleFilterChange('status', 'all')}
                className="hover:text-primary/80"
              >
                <Icon name="X" size={14} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default PurchaseFilters;
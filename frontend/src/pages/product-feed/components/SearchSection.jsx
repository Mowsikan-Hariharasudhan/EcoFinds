import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';


const SearchSection = ({ 
  searchQuery, 
  onSearchChange, 
  onSearch, 
  recentSearches = [],
  onClearRecentSearches,
  className = '' 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const mockSuggestions = [
    'Vintage furniture',
    'Organic clothing',
    'Eco-friendly electronics',
    'Sustainable home decor',
    'Recycled materials',
    'Second-hand books',
    'Upcycled accessories',
    'Green beauty products',
    'Antique collectibles',
    'Refurbished laptops',
    'Designer handbags',
    'Wooden dining table',
    'Yoga equipment',
    'Kitchen appliances'
  ];

  useEffect(() => {
    if (searchQuery?.length > 0) {
      const filtered = mockSuggestions?.filter(suggestion =>
        suggestion?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
      setSuggestions(filtered?.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      onSearch(searchQuery?.trim());
      setShowSuggestions(false);
      setIsExpanded(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    onSearchChange(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    setIsExpanded(false);
  };

  const handleRecentSearchClick = (search) => {
    onSearchChange(search);
    onSearch(search);
  };

  const handleFocus = () => {
    setIsExpanded(true);
    if (searchQuery?.length === 0 && recentSearches?.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay to allow clicking on suggestions
    setTimeout(() => {
      setShowSuggestions(false);
      setIsExpanded(false);
    }, 200);
  };

  const handleClear = () => {
    onSearchChange('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative transition-all duration-200 ${
          isExpanded ? 'transform scale-105' : ''
        }`}>
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none z-10" 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e?.target?.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder="Search for sustainable products, brands, or categories..."
              className="w-full pl-12 pr-12 py-4 bg-input border border-border rounded-xl text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 shadow-soft focus:shadow-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth p-1 rounded-full hover:bg-muted"
              >
                <Icon name="X" size={18} />
              </button>
            )}
          </div>
        </div>
      </form>
      {/* Search Suggestions & Recent Searches */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-prominent z-[1100] animate-slide-in overflow-hidden">
          {/* Suggestions */}
          {suggestions?.length > 0 && (
            <div className="py-2">
              <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b border-border">
                Suggestions
              </div>
              {suggestions?.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left text-sm text-popover-foreground hover:bg-muted transition-smooth flex items-center space-x-3"
                >
                  <Icon name="Search" size={16} className="text-muted-foreground" />
                  <span>{suggestion}</span>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {searchQuery?.length === 0 && recentSearches?.length > 0 && (
            <div className="py-2">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Recent Searches
                </div>
                <button
                  onClick={onClearRecentSearches}
                  className="text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Clear all
                </button>
              </div>
              {recentSearches?.slice(0, 5)?.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className="w-full px-4 py-3 text-left text-sm text-popover-foreground hover:bg-muted transition-smooth flex items-center space-x-3"
                >
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span>{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {searchQuery?.length > 0 && suggestions?.length === 0 && (
            <div className="py-8 text-center">
              <Icon name="Search" size={32} className="text-muted-foreground mx-auto mb-2" />
              <div className="text-sm text-muted-foreground">
                No suggestions found for "{searchQuery}"
              </div>
            </div>
          )}
        </div>
      )}
      {/* Popular Categories */}
      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {[
          'Furniture',
          'Electronics',
          'Clothing',
          'Books',
          'Home Decor',
          'Sports',
          'Beauty'
        ]?.map((category) => (
          <button
            key={category}
            onClick={() => handleSuggestionClick(category)}
            className="px-4 py-2 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-full text-sm font-medium transition-smooth hover-lift"
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchSection;
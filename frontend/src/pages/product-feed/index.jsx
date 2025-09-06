import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import SearchSection from './components/SearchSection';
import FilterToolbar from './components/FilterToolbar';
import MobileFilterPanel from './components/MobileFilterPanel';
import ProductGrid from './components/ProductGrid';
import { productsAPI, categoriesAPI } from '../../services/api';

import Button from '../../components/ui/Button';

const ProductFeed = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '');
  const [filters, setFilters] = useState({
    category: searchParams?.get('category') || '',
    condition: searchParams?.get('condition') || '',
    minPrice: parseInt(searchParams?.get('minPrice')) || 0,
    maxPrice: parseInt(searchParams?.get('maxPrice')) || 1000,
    searchQuery: searchParams?.get('search') || ''
  });
  const [sortBy, setSortBy] = useState(searchParams?.get('sort') || 'relevance');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [cart, setCart] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  // Load initial data and recent searches
  useEffect(() => {
    const savedRecentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
    setRecentSearches(savedRecentSearches);
    loadCategories();
    loadProducts(true);
  }, []);

  // Load categories from API
  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setCategories([]); // Ensure it's always an array
    }
  };

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params?.set('search', searchQuery);
    if (filters?.category) params?.set('category', filters?.category);
    if (filters?.condition) params?.set('condition', filters?.condition);
    if (filters?.minPrice > 0) params?.set('minPrice', filters?.minPrice?.toString());
    if (filters?.maxPrice < 1000) params?.set('maxPrice', filters?.maxPrice?.toString());
    if (sortBy !== 'relevance') params?.set('sort', sortBy);
    
    setSearchParams(params);
  }, [filters, sortBy, searchQuery, setSearchParams]);

  // Load products with filters applied
  const loadProducts = async (reset = false) => {
    setLoading(true);
    
    try {
      const params = {
        page: reset ? 1 : currentPage,
        limit: 8,
        search: filters.searchQuery || searchQuery,
        category: filters.category,
        condition: filters.condition,
        minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
        maxPrice: filters.maxPrice < 1000 ? filters.maxPrice : undefined,
        sortBy: sortBy === 'relevance' ? undefined : sortBy,
      };

      // Remove undefined values
      Object.keys(params).forEach(key => 
        params[key] === undefined && delete params[key]
      );

      const response = await productsAPI.getAll(params);
      const { products: newProducts, pagination } = response.data;

      if (reset) {
        setProducts(newProducts || []);
        setCurrentPage(1);
      } else {
        setProducts(prev => [...prev, ...(newProducts || [])]);
      }
      
      setTotalProducts(pagination?.total || 0);
      setHasMore(pagination?.hasNext || false);
      
      if (!reset) {
        setCurrentPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      setProducts([]);
      setTotalProducts(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };  // Handle search
  const handleSearch = (query) => {
    const newFilters = { ...filters, searchQuery: query };
    setFilters(newFilters);
    setSearchQuery(query);
    
    // Save to recent searches
    if (query?.trim()) {
      const updatedRecentSearches = [
        query,
        ...recentSearches?.filter(search => search !== query)
      ]?.slice(0, 10);
      setRecentSearches(updatedRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecentSearches));
    }
    
    loadProducts(true);
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    loadProducts(true);
  };

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    loadProducts(true);
  };

  // Handle load more
  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
    loadProducts(false);
  };

  // Handle add to cart
  const handleAddToCart = async (product) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setCart(prev => {
      const existingItem = prev?.find(item => item?.id === product?.id);
      if (existingItem) {
        return prev?.map(item =>
          item?.id === product?.id
            ? { ...item, quantity: item?.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
  };

  // Clear recent searches
  const handleClearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const totalResults = products?.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Search Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16">
          <div className="max-w-4xl mx-auto px-4 lg:px-6">
            <div className="text-center mb-8">
              <h1 className="font-heading font-bold text-4xl lg:text-5xl text-foreground mb-4">
                Discover Sustainable Treasures
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Find unique second-hand products that give new life to pre-loved items while supporting a circular economy.
              </p>
            </div>
            
            <SearchSection
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearch={handleSearch}
              recentSearches={recentSearches}
              onClearRecentSearches={handleClearRecentSearches}
            />
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            {/* Breadcrumb */}
            <BreadcrumbNavigation className="mb-6" />

            {/* Filter Toolbar */}
            <FilterToolbar
              filters={filters}
              onFiltersChange={handleFiltersChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              totalResults={totalProducts}
              categories={categories}
              onToggleMobileFilters={() => setIsMobileFilterOpen(true)}
              className="mb-8"
            />

            {/* Product Grid */}
            <ProductGrid
              products={products}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              onAddToCart={handleAddToCart}
            />

            {/* Mobile Filter Panel */}
            <MobileFilterPanel
              isOpen={isMobileFilterOpen}
              onClose={() => setIsMobileFilterOpen(false)}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              totalResults={totalProducts}
              categories={categories}
            />
          </div>
        </section>

        {/* Call to Action Section */}
        {!loading && products?.length > 0 && (
          <section className="bg-card border-t border-border py-16">
            <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center">
              <h2 className="font-heading font-bold text-3xl text-card-foreground mb-4">
                Have items to sell?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join our sustainable marketplace and give your unused items a new home while earning money and helping the environment.
              </p>
              <Button
                variant="default"
                size="lg"
                onClick={() => window.location.href = '/add-product'}
                iconName="Plus"
                iconPosition="left"
                iconSize={20}
              >
                Start Selling Today
              </Button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProductFeed;
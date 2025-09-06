import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import PurchaseCard from './components/PurchaseCard';
import PurchaseFilters from './components/PurchaseFilters';
import PurchaseAnalytics from './components/PurchaseAnalytics';
import ExportOptions from './components/ExportOptions';
import EmptyPurchases from './components/EmptyPurchases';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const PreviousPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  // Mock purchase data
  const mockPurchases = [
    {
      id: 1,
      orderId: "ORD-2024-001234",
      product: {
        id: 1,
        title: "Vintage Wooden Coffee Table",
        category: "home",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400"
      },
      seller: {
        id: 101,
        name: "Sarah Mitchell",
        rating: 4.8
      },
      quantity: 1,
      totalAmount: 89.99,
      orderDate: "2024-08-15T10:30:00Z",
      deliveryDate: "2024-08-22T14:20:00Z",
      status: "Delivered",
      paymentMethod: "Credit Card",
      trackingNumber: "TRK123456789",
      hasReview: false
    },
    {
      id: 2,
      orderId: "ORD-2024-001235",
      product: {
        id: 2,
        title: "Organic Cotton Sweater",
        category: "clothing",
        price: 34.50,
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400"
      },
      seller: {
        id: 102,
        name: "Green Threads Co.",
        rating: 4.9
      },
      quantity: 2,
      totalAmount: 69.00,
      orderDate: "2024-08-10T15:45:00Z",
      deliveryDate: "2024-08-18T11:30:00Z",
      status: "Delivered",
      paymentMethod: "PayPal",
      trackingNumber: "TRK987654321",
      hasReview: true
    },
    {
      id: 3,
      orderId: "ORD-2024-001236",
      product: {
        id: 3,
        title: "Refurbished iPhone 12",
        category: "electronics",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"
      },
      seller: {
        id: 103,
        name: "TechSecond",
        rating: 4.7
      },
      quantity: 1,
      totalAmount: 299.99,
      orderDate: "2024-08-05T09:15:00Z",
      deliveryDate: null,
      status: "Shipped",
      paymentMethod: "Credit Card",
      trackingNumber: "TRK456789123",
      hasReview: false
    },
    {
      id: 4,
      orderId: "ORD-2024-001237",
      product: {
        id: 4,
        title: "Classic Literature Collection",
        category: "books",
        price: 45.00,
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400"
      },
      seller: {
        id: 104,
        name: "BookWorm Haven",
        rating: 4.6
      },
      quantity: 1,
      totalAmount: 45.00,
      orderDate: "2024-07-28T13:20:00Z",
      deliveryDate: "2024-08-03T16:45:00Z",
      status: "Delivered",
      paymentMethod: "Debit Card",
      trackingNumber: "TRK789123456",
      hasReview: true
    },
    {
      id: 5,
      orderId: "ORD-2024-001238",
      product: {
        id: 5,
        title: "Eco-Friendly Yoga Mat",
        category: "sports",
        price: 28.75,
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400"
      },
      seller: {
        id: 105,
        name: "Mindful Movement",
        rating: 4.8
      },
      quantity: 1,
      totalAmount: 28.75,
      orderDate: "2024-07-20T11:10:00Z",
      deliveryDate: null,
      status: "Processing",
      paymentMethod: "Credit Card",
      trackingNumber: null,
      hasReview: false
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadPurchases = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPurchases(mockPurchases);
      setFilteredPurchases(mockPurchases);
      setLoading(false);
    };

    loadPurchases();
  }, []);

  const handleFiltersChange = (filters) => {
    let filtered = [...purchases];

    // Apply search filter
    if (filters?.searchQuery) {
      const query = filters?.searchQuery?.toLowerCase();
      filtered = filtered?.filter(purchase =>
        purchase?.product?.title?.toLowerCase()?.includes(query) ||
        purchase?.seller?.name?.toLowerCase()?.includes(query) ||
        purchase?.orderId?.toLowerCase()?.includes(query)
      );
    }

    // Apply date range filter
    if (filters?.dateRange !== 'all') {
      const now = new Date();
      const startDate = new Date();
      
      switch (filters?.dateRange) {
        case 'last7days':
          startDate?.setDate(now?.getDate() - 7);
          break;
        case 'last30days':
          startDate?.setDate(now?.getDate() - 30);
          break;
        case 'last3months':
          startDate?.setMonth(now?.getMonth() - 3);
          break;
        case 'last6months':
          startDate?.setMonth(now?.getMonth() - 6);
          break;
        case 'lastyear':
          startDate?.setFullYear(now?.getFullYear() - 1);
          break;
      }
      
      filtered = filtered?.filter(purchase => 
        new Date(purchase.orderDate) >= startDate
      );
    }

    // Apply price range filter
    if (filters?.priceRange !== 'all') {
      const [min, max] = filters?.priceRange?.includes('+') 
        ? [parseInt(filters?.priceRange?.replace('+', '')), Infinity]
        : filters?.priceRange?.split('-')?.map(Number);
      
      filtered = filtered?.filter(purchase => 
        purchase?.totalAmount >= min && purchase?.totalAmount <= (max || Infinity)
      );
    }

    // Apply category filter
    if (filters?.category !== 'all') {
      filtered = filtered?.filter(purchase => 
        purchase?.product?.category === filters?.category
      );
    }

    // Apply status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(purchase => 
        purchase?.status?.toLowerCase() === filters?.status
      );
    }

    // Apply sorting
    switch (filters?.sortBy) {
      case 'newest':
        filtered?.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        break;
      case 'oldest':
        filtered?.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
        break;
      case 'price-high':
        filtered?.sort((a, b) => b?.totalAmount - a?.totalAmount);
        break;
      case 'price-low':
        filtered?.sort((a, b) => a?.totalAmount - b?.totalAmount);
        break;
      case 'name-az':
        filtered?.sort((a, b) => a?.product?.title?.localeCompare(b?.product?.title));
        break;
      case 'name-za':
        filtered?.sort((a, b) => b?.product?.title?.localeCompare(a?.product?.title));
        break;
    }

    setFilteredPurchases(filtered);
  };

  const handleReorder = (purchase) => {
    // In a real app, this would add the item to cart
    console.log('Reordering:', purchase?.product?.title);
    // Show success message or redirect to cart
  };

  const handleReview = (purchase) => {
    // In a real app, this would open a review modal
    console.log('Leaving review for:', purchase?.product?.title);
  };

  const handleReportIssue = (purchase) => {
    // In a real app, this would open a support form
    console.log('Reporting issue for:', purchase?.orderId);
  };

  const handleExport = (format, range, count) => {
    console.log(`Exported ${count} purchases in ${format} format for ${range}`);
    // Show success message
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Helmet>
          <title>Previous Purchases - EcoFinds</title>
          <meta name="description" content="View your purchase history and track orders on EcoFinds sustainable marketplace" />
        </Helmet>
        <Header />
        <main className="pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your purchase history...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Previous Purchases - EcoFinds</title>
        <meta name="description" content="View your purchase history, track orders, and manage your sustainable shopping records on EcoFinds" />
        <meta name="keywords" content="purchase history, order tracking, sustainable shopping, eco-friendly marketplace" />
      </Helmet>
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <BreadcrumbNavigation />
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">Previous Purchases</h1>
                <p className="text-muted-foreground">
                  Track your orders and review your sustainable shopping history
                </p>
              </div>
              
              {purchases?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="BarChart3"
                    iconPosition="left"
                    onClick={() => setShowAnalytics(!showAnalytics)}
                  >
                    {showAnalytics ? 'Hide' : 'Show'} Analytics
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Download"
                    iconPosition="left"
                    onClick={() => setShowExportOptions(!showExportOptions)}
                  >
                    Export Data
                  </Button>
                </div>
              )}
            </div>
          </div>

          {purchases?.length === 0 ? (
            <EmptyPurchases />
          ) : (
            <div className="space-y-6">
              {/* Analytics Section */}
              {showAnalytics && (
                <PurchaseAnalytics purchases={purchases} />
              )}

              {/* Export Options */}
              {showExportOptions && (
                <ExportOptions 
                  purchases={filteredPurchases} 
                  onExport={handleExport}
                />
              )}

              {/* Filters */}
              <PurchaseFilters 
                onFiltersChange={handleFiltersChange}
                totalPurchases={filteredPurchases?.length}
              />

              {/* Purchase List */}
              {filteredPurchases?.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Search" size={32} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Purchases Found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters to see more results
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPurchases?.map((purchase) => (
                    <PurchaseCard
                      key={purchase?.id}
                      purchase={purchase}
                      onReorder={handleReorder}
                      onReview={handleReview}
                      onReportIssue={handleReportIssue}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PreviousPurchases;
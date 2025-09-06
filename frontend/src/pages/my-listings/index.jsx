import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import ListingCard from './components/ListingCard';
import ListingFilters from './components/ListingFilters';
import BulkActions from './components/BulkActions';
import EditListingModal from './components/EditListingModal';
import EmptyState from './components/EmptyState';

const MyListings = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [selectedListings, setSelectedListings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [editingListing, setEditingListing] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock listings data
  const mockListings = [
    {
      id: 1,
      title: "Vintage Wooden Coffee Table",
      description: "Beautiful mid-century modern coffee table in excellent condition. Made from solid oak with original finish. Perfect for any living room setup.",
      price: 150.00,
      category: "furniture",
      condition: "good",
      status: "active",
      image: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg",
      views: 234,
      inquiries: 12,
      createdAt: "2025-01-15T10:30:00Z",
      updatedAt: "2025-01-15T10:30:00Z"
    },
    {
      id: 2,
      title: "Organic Cotton Summer Dress",
      description: "Flowy summer dress made from 100% organic cotton. Size medium, worn only a few times. Perfect for casual outings or beach days.",
      price: 35.00,
      category: "clothing",
      condition: "like-new",
      status: "active",
      image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg",
      views: 89,
      inquiries: 5,
      createdAt: "2025-01-10T14:20:00Z",
      updatedAt: "2025-01-10T14:20:00Z"
    },
    {
      id: 3,
      title: "MacBook Pro 13-inch (2019)",
      description: "Well-maintained MacBook Pro with 8GB RAM and 256GB SSD. Includes original charger and box. Minor wear on corners but fully functional.",
      price: 800.00,
      category: "electronics",
      condition: "good",
      status: "sold",
      image: "https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg",
      views: 456,
      inquiries: 28,
      createdAt: "2024-12-20T09:15:00Z",
      updatedAt: "2025-01-05T16:45:00Z"
    },
    {
      id: 4,
      title: "Set of 6 Ceramic Dinner Plates",
      description: "Handmade ceramic dinner plates in earth tones. Perfect for sustainable dining. One plate has a small chip but still functional.",
      price: 45.00,
      category: "home-garden",
      condition: "fair",
      status: "inactive",
      image: "https://images.pexels.com/photos/6489663/pexels-photo-6489663.jpeg",
      views: 67,
      inquiries: 3,
      createdAt: "2024-12-15T11:00:00Z",
      updatedAt: "2024-12-15T11:00:00Z"
    },
    {
      id: 5,
      title: "Yoga Mat - Eco-Friendly Cork",
      description: "Premium cork yoga mat, non-slip surface, perfect for all types of yoga practice. Lightly used, excellent condition.",
      price: 60.00,
      category: "sports",
      condition: "like-new",
      status: "active",
      image: "https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg",
      views: 123,
      inquiries: 8,
      createdAt: "2025-01-08T13:30:00Z",
      updatedAt: "2025-01-08T13:30:00Z"
    },
    {
      id: 6,
      title: "Collection of Classic Literature Books",
      description: "Set of 15 classic literature books including works by Shakespeare, Dickens, and Austen. Some wear on covers but pages in good condition.",
      price: 75.00,
      category: "books",
      condition: "good",
      status: "active",
      image: "https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg",
      views: 178,
      inquiries: 15,
      createdAt: "2025-01-05T16:45:00Z",
      updatedAt: "2025-01-05T16:45:00Z"
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setListings(mockListings);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...listings];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered?.filter(listing => listing?.status === statusFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        filtered?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-high':
        filtered?.sort((a, b) => b?.price - a?.price);
        break;
      case 'price-low':
        filtered?.sort((a, b) => a?.price - b?.price);
        break;
      case 'most-viewed':
        filtered?.sort((a, b) => b?.views - a?.views);
        break;
      case 'most-inquiries':
        filtered?.sort((a, b) => b?.inquiries - a?.inquiries);
        break;
      default:
        break;
    }

    setFilteredListings(filtered);
  }, [listings, statusFilter, sortBy]);

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedListing) => {
    setListings(prev => prev?.map(listing => 
      listing?.id === updatedListing?.id ? updatedListing : listing
    ));
    setIsEditModalOpen(false);
    setEditingListing(null);
  };

  const handleDelete = (listingId) => {
    setListings(prev => prev?.filter(listing => listing?.id !== listingId));
    setSelectedListings(prev => prev?.filter(id => id !== listingId));
  };

  const handleToggleStatus = (listingId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    setListings(prev => prev?.map(listing => 
      listing?.id === listingId 
        ? { ...listing, status: newStatus, updatedAt: new Date()?.toISOString() }
        : listing
    ));
  };

  const handleSelectListing = (listingId, isSelected) => {
    if (isSelected) {
      setSelectedListings(prev => [...prev, listingId]);
    } else {
      setSelectedListings(prev => prev?.filter(id => id !== listingId));
    }
  };

  const handleSelectAll = () => {
    setSelectedListings(filteredListings?.map(listing => listing?.id));
  };

  const handleDeselectAll = () => {
    setSelectedListings([]);
  };

  const handleBulkDelete = (listingIds) => {
    setListings(prev => prev?.filter(listing => !listingIds?.includes(listing?.id)));
    setSelectedListings([]);
  };

  const handleBulkStatusChange = (listingIds, newStatus) => {
    setListings(prev => prev?.map(listing => 
      listingIds?.includes(listing?.id)
        ? { ...listing, status: newStatus, updatedAt: new Date()?.toISOString() }
        : listing
    ));
    setSelectedListings([]);
  };

  const activeListings = listings?.filter(listing => listing?.status === 'active')?.length;
  const isAllSelected = selectedListings?.length === filteredListings?.length && filteredListings?.length > 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Package" size={24} className="text-primary animate-pulse" />
                </div>
                <p className="text-muted-foreground">Loading your listings...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <BreadcrumbNavigation />
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mt-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">My Listings</h1>
                <p className="text-muted-foreground">
                  Manage your product listings and track their performance
                </p>
              </div>
              <div className="mt-4 lg:mt-0">
                <Button
                  as={Link}
                  to="/add-product"
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={18}
                >
                  Add New Listing
                </Button>
              </div>
            </div>
          </div>

          {listings?.length === 0 ? (
            <EmptyState statusFilter="all" />
          ) : (
            <>
              {/* Filters */}
              <ListingFilters
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalListings={listings?.length}
                activeListings={activeListings}
              />

              {/* Bulk Actions */}
              <BulkActions
                selectedListings={selectedListings}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                onBulkDelete={handleBulkDelete}
                onBulkStatusChange={handleBulkStatusChange}
                totalListings={filteredListings?.length}
                isAllSelected={isAllSelected}
              />

              {/* Listings Grid/List */}
              {filteredListings?.length === 0 ? (
                <EmptyState statusFilter={statusFilter} />
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' ?'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :'grid-cols-1'
                }`}>
                  {filteredListings?.map((listing) => (
                    <div key={listing?.id} className="group relative">
                      {/* Selection Checkbox */}
                      <div className="absolute top-3 left-3 z-10">
                        <Checkbox
                          checked={selectedListings?.includes(listing?.id)}
                          onChange={(e) => handleSelectListing(listing?.id, e?.target?.checked)}
                          className="bg-background/80 backdrop-blur-sm"
                        />
                      </div>
                      
                      <ListingCard
                        listing={listing}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleStatus={handleToggleStatus}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      {/* Edit Modal */}
      <EditListingModal
        listing={editingListing}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingListing(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default MyListings;
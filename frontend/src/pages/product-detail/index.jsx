import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import ProductImageGallery from './components/ProductImageGallery';
import ProductInfo from './components/ProductInfo';
import SellerProfile from './components/SellerProfile';
import RelatedProducts from './components/RelatedProducts';
import ProductReviews from './components/ProductReviews';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ProductDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [showContactModal, setShowContactModal] = useState(false);

  const productId = searchParams?.get('id') || '1';

  // Mock product data
  const mockProduct = {
    id: productId,
    title: "Vintage Mid-Century Modern Wooden Chair",
    price: 189.99,
    originalPrice: 299.99,
    category: "Furniture",
    condition: "Excellent",
    availability: "Available",
    listedDate: "2025-01-15T10:30:00Z",
    description: `This beautiful mid-century modern wooden chair is a perfect addition to any home or office space. Crafted from solid oak wood with a rich walnut finish, this chair combines timeless design with exceptional comfort.\n\nThe chair features clean lines, tapered legs, and a curved backrest that provides excellent lumbar support. The seat cushion has been recently reupholstered with high-quality fabric in a neutral beige color that complements any decor style.\n\nThis piece has been well-maintained and shows minimal signs of wear. It's perfect for a dining room, home office, or as an accent chair in a living room. The sturdy construction ensures it will last for many years to come.`,
    features: [
      "Solid oak wood construction",
      "Recently reupholstered seat cushion",
      "Ergonomic curved backrest",
      "Rich walnut finish",
      "Tapered wooden legs",
      "Excellent structural integrity"
    ],
    images: [
      "https://images.pexels.com/photos/586744/pexels-photo-586744.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pixabay.com/photo/2016/11/18/17/20/living-room-1835923_1280.jpg",
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&w=800&q=80"
    ],
    views: 247,
    likes: 18,
    seller: {
      id: 1,
      username: "VintageFinds_Sarah",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
      rating: 4.8,
      reviewCount: 156,
      joinDate: "2023-03-15T00:00:00Z",
      totalListings: 47,
      completedSales: 134,
      responseRate: 98,
      isVerified: true,
      hasPhoneVerified: true,
      hasEmailVerified: true,
      bio: "Passionate collector and seller of vintage furniture and home decor. I carefully curate each piece to ensure quality and authenticity. All items are thoroughly cleaned and inspected before listing.",
      lastActive: "2 hours ago"
    },
    reviews: [
      {
        id: 1,
        user: {
          name: "Michael Chen",
          avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        rating: 5,
        date: "2025-01-10T14:30:00Z",
        comment: "Absolutely love this chair! The quality is exceptional and it arrived exactly as described. Sarah was very responsive and helpful throughout the process.",
        isVerifiedPurchase: true,
        helpfulCount: 8,
        images: []
      },
      {
        id: 2,
        user: {
          name: "Emma Rodriguez",
          avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        rating: 4,
        date: "2025-01-05T09:15:00Z",
        comment: "Great chair and excellent condition. The only minor issue was that it took a bit longer to arrive than expected, but the quality made up for it.",
        isVerifiedPurchase: true,
        helpfulCount: 3,
        images: []
      }
    ]
  };

  const mockRelatedProducts = [
    {
      id: 2,
      title: "Vintage Wooden Coffee Table",
      price: 145.00,
      condition: "Good",
      image: "https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg?auto=compress&cs=tinysrgb&w=400",
      location: "Brooklyn, NY",
      timeAgo: "3 days ago",
      seller: {
        username: "RetroHome_NYC",
        avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
        isVerified: true
      }
    },
    {
      id: 3,
      title: "Mid-Century Desk Lamp",
      price: 78.50,
      condition: "Excellent",
      image: "https://images.pixabay.com/photo/2017/03/25/23/32/lamp-2174062_1280.jpg",
      location: "Manhattan, NY",
      timeAgo: "1 week ago",
      seller: {
        username: "LightingLover",
        avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
        isVerified: false
      }
    },
    {
      id: 4,
      title: "Retro Bookshelf Unit",
      price: 220.00,
      condition: "Good",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      location: "Queens, NY",
      timeAgo: "2 weeks ago",
      seller: {
        username: "BookwormFinds",
        avatar: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400",
        isVerified: true
      }
    },
    {
      id: 5,
      title: "Vintage Dining Set",
      price: 450.00,
      condition: "Fair",
      image: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=400",
      location: "Staten Island, NY",
      timeAgo: "3 weeks ago",
      seller: {
        username: "DiningDecor",
        avatar: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400",
        isVerified: true
      }
    }
  ];

  useEffect(() => {
    // Simulate loading product data
    const loadProduct = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProduct(mockProduct);
      setLoading(false);
    };

    loadProduct();
  }, [productId]);

  useEffect(() => {
    // Load cart items from localStorage
    const savedCart = localStorage.getItem('ecofinds_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: product?.id,
      title: product?.title,
      price: product?.price,
      image: product?.images?.[0],
      seller: product?.seller?.username,
      quantity: 1,
      addedAt: new Date()?.toISOString()
    };

    const existingItemIndex = cartItems?.findIndex(item => item?.id === product?.id);
    let updatedCart;

    if (existingItemIndex >= 0) {
      updatedCart = [...cartItems];
      updatedCart[existingItemIndex].quantity += 1;
    } else {
      updatedCart = [...cartItems, cartItem];
    }

    setCartItems(updatedCart);
    localStorage.setItem('ecofinds_cart', JSON.stringify(updatedCart));

    // Show success message (in a real app, this would be a toast notification)
    alert('Product added to cart successfully!');
  };

  const handleContactSeller = () => {
    setShowContactModal(true);
  };

  const handleViewSellerProfile = () => {
    // In a real app, this would navigate to seller profile page
    alert('Seller profile feature coming soon!');
  };

  const customBreadcrumbs = [
    { label: 'Home', path: '/product-feed', icon: 'Home' },
    { label: 'Browse Products', path: '/product-feed', icon: 'Grid3X3' },
    { label: product?.title || 'Product Details', path: '/product-detail', icon: 'Eye', isLast: true }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
            <div className="animate-pulse space-y-8">
              <div className="h-4 bg-muted rounded w-1/3"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="aspect-square bg-muted rounded-lg"></div>
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                  <div className="h-6 bg-muted rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
            <div className="text-center space-y-4">
              <Icon name="AlertCircle" size={64} className="text-muted-foreground mx-auto" />
              <h1 className="text-2xl font-heading font-semibold text-foreground">
                Product Not Found
              </h1>
              <p className="text-muted-foreground">
                The product you're looking for doesn't exist or has been removed.
              </p>
              <Button
                variant="default"
                onClick={() => navigate('/product-feed')}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Back to Products
              </Button>
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
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8 space-y-8">
          {/* Breadcrumb Navigation */}
          <BreadcrumbNavigation customBreadcrumbs={customBreadcrumbs} />

          {/* Product Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Images */}
            <div className="lg:col-span-2">
              <ProductImageGallery 
                images={product?.images} 
                productName={product?.title} 
              />
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <ProductInfo
                product={product}
                onAddToCart={handleAddToCart}
                onContactSeller={handleContactSeller}
              />
              
              <SellerProfile
                seller={product?.seller}
                onContactSeller={handleContactSeller}
                onViewProfile={handleViewSellerProfile}
              />
            </div>
          </div>

          {/* Product Reviews */}
          <ProductReviews
            reviews={product?.reviews}
            averageRating={product?.seller?.rating}
            totalReviews={product?.reviews?.length}
          />

          {/* Related Products */}
          <RelatedProducts
            products={mockRelatedProducts}
            title="Similar Items"
          />
        </div>
      </main>
      {/* Contact Seller Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[1200] flex items-center justify-center p-4">
          <div className="bg-card rounded-lg shadow-prominent max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-heading font-semibold text-card-foreground">
                Contact Seller
              </h3>
              <button
                onClick={() => setShowContactModal(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Send a message to {product?.seller?.username} about this product.
              </p>
              
              <textarea
                placeholder="Hi, I'm interested in your product..."
                className="w-full h-32 px-3 py-2 bg-input border border-border rounded-md text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              />
              
              <div className="flex space-x-3">
                <Button
                  variant="default"
                  onClick={() => {
                    alert('Message sent successfully!');
                    setShowContactModal(false);
                  }}
                  iconName="Send"
                  iconPosition="left"
                  className="flex-1"
                >
                  Send Message
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowContactModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
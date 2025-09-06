import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BreadcrumbNavigation from '../../components/ui/BreadcrumbNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState({
    activeListings: 0,
    totalSales: 0,
    totalPurchases: 0,
    savedItems: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [quickActions] = useState([
    { 
      label: 'Add Product', 
      path: '/add-product', 
      icon: 'Plus', 
      description: 'List a new item for sale',
      color: 'bg-primary'
    },
    { 
      label: 'Browse Products', 
      path: '/product-feed', 
      icon: 'Search', 
      description: 'Discover sustainable products',
      color: 'bg-secondary'
    },
    { 
      label: 'My Listings', 
      path: '/my-listings', 
      icon: 'Package', 
      description: 'Manage your active listings',
      color: 'bg-success'
    },
    { 
      label: 'Shopping Cart', 
      path: '/shopping-cart', 
      icon: 'ShoppingCart', 
      description: 'View items in your cart',
      color: 'bg-warning'
    }
  ]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Mock stats and activity data
    const mockStats = {
      activeListings: 12,
      totalSales: 1847,
      totalPurchases: 23,
      savedItems: 8
    };

    const mockActivity = [
      {
        id: 1,
        type: 'sale',
        title: 'Vintage Leather Jacket sold',
        amount: '$85',
        time: '2 hours ago',
        icon: 'DollarSign'
      },
      {
        id: 2,
        type: 'purchase',
        title: 'Eco-friendly Water Bottle purchased',
        amount: '$25',
        time: '1 day ago',
        icon: 'ShoppingBag'
      },
      {
        id: 3,
        type: 'listing',
        title: 'Plant-based Cookbook listed',
        amount: '$15',
        time: '2 days ago',
        icon: 'Plus'
      },
      {
        id: 4,
        type: 'message',
        title: 'New message from John Doe',
        time: '3 days ago',
        icon: 'MessageCircle'
      }
    ];

    setStats(mockStats);
    setRecentActivity(mockActivity);
  }, [isAuthenticated, navigate]);

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/dashboard' }
  ];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'sale': return 'DollarSign';
      case 'purchase': return 'ShoppingBag';
      case 'listing': return 'Plus';
      case 'message': return 'MessageCircle';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'sale': return 'text-success';
      case 'purchase': return 'text-primary';
      case 'listing': return 'text-secondary';
      case 'message': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  if (!user || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20">
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <Icon name="Loader" size={32} className="animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading dashboard...</p>
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
        <div className="w-full px-4 lg:px-6 py-8">
          <BreadcrumbNavigation items={breadcrumbItems} />
          
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h1 className="text-2xl font-bold text-card-foreground">
                        Welcome back, {user.name?.split(' ')[0]}!
                      </h1>
                      {user.verified && (
                        <Icon name="BadgeCheck" size={20} className="text-primary" />
                      )}
                    </div>
                    <p className="text-muted-foreground">{user.location || 'Location not set'}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => navigate('/profile')}
                  iconName="Settings"
                >
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Listings</p>
                    <p className="text-2xl font-bold text-card-foreground">{stats.activeListings}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Package" size={24} className="text-primary" />
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    to="/my-listings"
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Manage listings →
                  </Link>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Sales</p>
                    <p className="text-2xl font-bold text-card-foreground">${stats.totalSales}</p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <Icon name="DollarSign" size={24} className="text-success" />
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    to="/sales-history"
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    View sales →
                  </Link>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Purchases</p>
                    <p className="text-2xl font-bold text-card-foreground">{stats.totalPurchases}</p>
                  </div>
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Icon name="ShoppingBag" size={24} className="text-secondary" />
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    to="/previous-purchases"
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    View purchases →
                  </Link>
                </div>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Saved Items</p>
                    <p className="text-2xl font-bold text-card-foreground">{stats.savedItems}</p>
                  </div>
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <Icon name="Heart" size={24} className="text-warning" />
                  </div>
                </div>
                <div className="mt-4">
                  <Link
                    to="/saved-items"
                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    View saved →
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Actions */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-card-foreground mb-4">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action) => (
                    <Link
                      key={action.path}
                      to={action.path}
                      className="block p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/50 transition-all group"
                    >
                      <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon name={action.icon} size={20} className="text-white" />
                      </div>
                      <h3 className="font-medium text-card-foreground mb-1">
                        {action.label}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-card-foreground">
                    Recent Activity
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/activity')}
                  >
                    View all
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-muted rounded-full flex items-center justify-center`}>
                        <Icon 
                          name={getActivityIcon(activity.type)} 
                          size={16} 
                          className={getActivityColor(activity.type)}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground truncate">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.time}
                        </p>
                      </div>
                      {activity.amount && (
                        <span className="text-sm font-medium text-card-foreground">
                          {activity.amount}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <Link
                    to="/messages"
                    className="flex items-center justify-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <Icon name="MessageCircle" size={16} />
                    <span>View all messages</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-2">
                    Your Environmental Impact
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    By choosing sustainable options, you've made a positive impact on our planet.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">15.2 kg</div>
                      <div className="text-sm text-muted-foreground">CO₂ Saved</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">47</div>
                      <div className="text-sm text-muted-foreground">Items Reused</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">8.7 m³</div>
                      <div className="text-sm text-muted-foreground">Water Saved</div>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                    <Icon name="Leaf" size={40} className="text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

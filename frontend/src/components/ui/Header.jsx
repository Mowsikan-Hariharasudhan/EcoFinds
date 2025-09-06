import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import SearchBar from './SearchBar';
import CartIndicator from './CartIndicator';
import UserMenu from './UserMenu';

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      category: 'Browse',
      items: [
        { label: 'Product Feed', path: '/product-feed', icon: 'Grid3X3' },
        { label: 'Product Detail', path: '/product-detail', icon: 'Eye' }
      ]
    },
    {
      category: 'Sell',
      items: [
        { label: 'Add Product', path: '/add-product', icon: 'Plus' },
        { label: 'My Listings', path: '/my-listings', icon: 'Package' }
      ]
    },
    {
      category: 'Cart',
      items: [
        { label: 'Shopping Cart', path: '/shopping-cart', icon: 'ShoppingCart' },
        { label: 'Previous Purchases', path: '/previous-purchases', icon: 'History' }
      ]
    }
  ];

  const primaryNavItems = [
    { label: 'Browse', path: '/product-feed', icon: 'Grid3X3' },
    { label: 'Sell', path: '/add-product', icon: 'Plus' },
    { label: 'My Listings', path: '/my-listings', icon: 'Package' },
    { label: 'Orders', path: '/previous-purchases', icon: 'History' }
  ];

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-background border-b border-border shadow-soft">
      <div className="w-full px-4 lg:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/product-feed" className="flex items-center space-x-3 hover:opacity-80 transition-smooth">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Leaf" size={24} color="var(--color-primary-foreground)" />
            </div>
            <div className="font-heading font-semibold text-xl text-foreground">
              EcoFinds
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {primaryNavItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium transition-smooth hover-lift ${
                  isActiveRoute(item?.path)
                    ? 'text-primary bg-primary/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Desktop */}
            <div className="hidden md:block">
              <SearchBar onSearch={(query) => {}} />
            </div>

            {/* Cart Indicator */}
            <CartIndicator />

            {/* User Menu */}
            <UserMenu />

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
              aria-label="Toggle mobile menu"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <SearchBar onSearch={(query) => {}} />
        </div>
      </div>
      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-background border-t border-border shadow-medium">
          <div className="px-4 py-4 space-y-1">
            {navigationItems?.map((category) => (
              <div key={category?.category} className="space-y-1">
                <div className="px-3 py-2 text-sm font-medium text-muted-foreground font-heading">
                  {category?.category}
                </div>
                {category?.items?.map((item) => (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-md transition-smooth ${
                      isActiveRoute(item?.path)
                        ? 'text-primary bg-primary/10' :'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={item?.icon} size={20} />
                    <span className="font-medium">{item?.label}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
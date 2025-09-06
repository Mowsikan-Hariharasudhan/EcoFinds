import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Image from '../AppImage';
import { useAuth } from '../../contexts/AuthContext';

const UserMenu = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Remove the mock user effect since we're using auth context
  // useEffect(() => {
  //   const mockUser = {
  //     id: 1,
  //     name: 'Sarah Johnson',
  //     email: 'sarah@example.com',
  //     avatar: '/assets/images/avatar-placeholder.jpg',
  //     isAuthenticated: true
  //   };
  //   setUser(mockUser);
  // }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef?.current && !menuRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/product-feed');
  };

  const handleLogin = () => {
    setIsOpen(false);
    // Navigate to login page
    navigate('/login');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'My Profile', path: '/profile', icon: 'User' },
    { label: 'My Listings', path: '/my-listings', icon: 'Package' },
    { label: 'Previous Purchases', path: '/previous-purchases', icon: 'History' },
    { label: 'Settings', path: '/settings', icon: 'Settings' },
    { label: 'Help & Support', path: '/help', icon: 'HelpCircle' }
  ];

  if (!isAuthenticated) {
    return (
      <button
        onClick={handleLogin}
        className={`flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-smooth hover-lift ${className}`}
      >
        <Icon name="LogIn" size={18} />
        <span>Sign In</span>
      </button>
    );
  }

  return (
    <div ref={menuRef} className={`relative ${className}`}>
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 p-1 rounded-md hover:bg-muted transition-smooth"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-border">
          <Image
            src={user?.avatar}
            alt={user?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-foreground">{user?.name}</div>
          <div className="text-xs text-muted-foreground">{user?.email}</div>
        </div>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`} 
        />
      </button>
      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-popover border border-border rounded-md shadow-prominent z-[1100] animate-slide-in">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-border">
                <Image
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-medium text-popover-foreground">{user?.name}</div>
                <div className="text-sm text-muted-foreground">{user?.email}</div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
              >
                <Icon name={item?.icon} size={16} className="text-muted-foreground" />
                <span>{item?.label}</span>
              </Link>
            ))}
          </div>

          {/* Logout */}
          <div className="border-t border-border py-2">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
            >
              <Icon name="LogOut" size={16} className="text-muted-foreground" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
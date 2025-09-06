import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbNavigation = ({ customBreadcrumbs = null, className = '' }) => {
  const location = useLocation();

  const routeMap = {
    '/product-feed': { label: 'Browse Products', icon: 'Grid3X3' },
    '/add-product': { label: 'Add Product', icon: 'Plus' },
    '/product-detail': { label: 'Product Details', icon: 'Eye' },
    '/shopping-cart': { label: 'Shopping Cart', icon: 'ShoppingCart' },
    '/my-listings': { label: 'My Listings', icon: 'Package' },
    '/previous-purchases': { label: 'Previous Purchases', icon: 'History' },
    '/profile': { label: 'Profile', icon: 'User' },
    '/settings': { label: 'Settings', icon: 'Settings' },
    '/help': { label: 'Help & Support', icon: 'HelpCircle' }
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(segment => segment);
    const breadcrumbs = [{ label: 'Home', path: '/product-feed', icon: 'Home' }];

    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const routeInfo = routeMap?.[currentPath];
      
      if (routeInfo) {
        breadcrumbs?.push({
          label: routeInfo?.label,
          path: currentPath,
          icon: routeInfo?.icon,
          isLast: index === pathSegments?.length - 1
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't render breadcrumbs on home page
  if (location?.pathname === '/product-feed' && !customBreadcrumbs) {
    return null;
  }

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm text-muted-foreground ${className}`}
      aria-label="Breadcrumb navigation"
    >
      {breadcrumbs?.map((crumb, index) => (
        <React.Fragment key={crumb?.path || index}>
          {index > 0 && (
            <Icon 
              name="ChevronRight" 
              size={14} 
              className="text-muted-foreground/60" 
            />
          )}
          
          {crumb?.isLast ? (
            <span className="flex items-center space-x-1 text-foreground font-medium">
              {crumb?.icon && <Icon name={crumb?.icon} size={14} />}
              <span>{crumb?.label}</span>
            </span>
          ) : (
            <Link
              to={crumb?.path}
              className="flex items-center space-x-1 hover:text-foreground transition-smooth"
            >
              {crumb?.icon && <Icon name={crumb?.icon} size={14} />}
              <span>{crumb?.label}</span>
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbNavigation;
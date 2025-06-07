// src/components/layout/shared/layoutUtils.js
import React from 'react';
import { useEffect } from 'react';

/**
 * Shared layout utilities and hooks that can be used by both layouts
 */

// Custom hook for sidebar management
export const useSidebarState = (initialState = true) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(initialState);

  // Handle resize to manage sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        const savedState = localStorage.getItem("sidebarOpen");
        setSidebarOpen(savedState !== null ? JSON.parse(savedState) : true);
      }
    };

    // Save sidebar state for desktop
    if (window.innerWidth >= 1024) {
      localStorage.setItem("sidebarOpen", JSON.stringify(sidebarOpen));
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  return [sidebarOpen, setSidebarOpen];
};

// Custom hook for page change handling
export const usePageChangeHandler = (currentPage, onPageChange) => {
  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      // This would be passed as a callback to close mobile sidebar
      if (onPageChange) {
        // Handle mobile sidebar closure logic
      }
    }
  }, [currentPage, onPageChange]);
};

// Shared navigation utilities
export const navigationUtils = {
  // Get current page from location for different user types
  getCurrentPage: (location, isAdmin = false) => {
    const path = location.pathname;
    
    if (isAdmin) {
      switch (path) {
        case '/admin':
          return 'admin-dashboard';
        case '/admin/vendors':
          return 'admin-vendors';
        case '/admin/profile-verification':
          return 'admin-profile-verification';
        case '/admin/buyers':
          return 'admin-buyers';
        case '/admin/products':
          return 'admin-products';
        case '/admin/subscription':
          return 'admin-subscriptions';
        case '/admin/settings':
          return 'admin-settings';
        default:
          return 'admin-dashboard';
      }
    } else {
      switch (path) {
        case '/':
          return 'dashboard';
        case '/products':
          return 'products';
        case '/add-product':
          return 'add-product';
        case '/settings':
          return 'settings';
        default:
          if (path.startsWith('/edit-product/')) {
            return 'edit-product';
          }
          return 'dashboard';
      }
    }
  },

  // Get routes mapping for different user types
  getRoutesMapping: (isAdmin = false) => {
    if (isAdmin) {
      return {
        'admin-dashboard': '/admin',
        'admin-vendors': '/admin/vendors',
        'admin-profile-verification': '/admin/profile-verification',
        'admin-buyers': '/admin/buyers',
        'admin-products': '/admin/products',
        'admin-subscriptions': '/admin/subscription',
        'admin-settings': '/admin/settings',
      };
    } else {
      return {
        'dashboard': '/',
        'products': '/products',
        'add-product': '/add-product',
        'settings': '/settings',
      };
    }
  }
};

// Shared layout constants
export const layoutConstants = {
  VENDOR_GRADIENTS: {
    header: "bg-white/80",
    sidebar: "bg-white/90",
    background: "bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50"
  },
  
  ADMIN_GRADIENTS: {
    header: "bg-gradient-to-r from-purple-600 to-indigo-600",
    sidebar: "bg-gradient-to-b from-white via-purple-50 to-indigo-50",
    background: "bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50"
  },

  BREAKPOINTS: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    large: 1280
  }
};

// Shared layout validation
export const layoutValidation = {
  validateUserAccess: (user, isAdminLayout = false) => {
    if (!user) return false;
    
    if (isAdminLayout) {
      return user.accountType === 'ADMIN';
    }
    
    // For vendor layout, exclude admins
    return user.accountType !== 'ADMIN';
  },

  shouldRedirect: (user, isAdminLayout = false) => {
    if (!user) return '/auth';
    
    if (isAdminLayout && user.accountType !== 'ADMIN') {
      return '/';
    }
    
    if (!isAdminLayout && user.accountType === 'ADMIN') {
      return '/admin';
    }
    
    return null;
  }
};
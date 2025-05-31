import React from 'react';
import { LayoutDashboard, Package, Settings, X } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = ({ sidebarOpen, setSidebarOpen, currentPage, onPageChange }) => {
  const { user } = useAuth();
  
  const navigationItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard 
    },
    { 
      id: 'products', 
      label: 'Products', 
      icon: Package 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings 
    },
  ];

  const handleNavigation = (page) => {
    onPageChange(page);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Desktop Sidebar - Collapsible with Full Height */}
      <aside className={cn(
        "hidden lg:flex lg:flex-col lg:bg-white lg:border-r lg:border-gray-200 transition-all duration-300",
        "lg:fixed lg:top-16 lg:bottom-0 lg:left-0 lg:h-[calc(100vh-4rem)]", // Fixed positioning with full height
        sidebarOpen ? "lg:w-64" : "lg:w-16"
      )}>
        <div className="flex flex-col h-full">
          {/* Header Section */}
          <div className="flex-shrink-0 p-4">
            {/* Logo/Brand - Show/Hide based on sidebar state */}
            {sidebarOpen && (
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <div>
                  <h1 className="font-bold text-gray-900">MarketPlace</h1>
                  <p className="text-xs text-gray-500">Vendor Portal</p>
                </div>
              </div>
            )}
            
            {/* Collapsed Logo */}
            {!sidebarOpen && (
              <div className="flex justify-center mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Section - Scrollable if needed */}
          <div className="flex-1 px-4 overflow-y-auto">
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    'w-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 h-10 transition-all duration-200',
                    sidebarOpen ? 'justify-start' : 'justify-center px-0',
                    currentPage === item.id && 'bg-gray-900 text-white hover:bg-gray-800'
                  )}
                  onClick={() => handleNavigation(item.id)}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon className={cn('h-5 w-5', sidebarOpen && 'mr-3')} />
                  {sidebarOpen && item.label}
                </Button>
              ))}
            </nav>
          </div>

          {/* User section at bottom - Fixed */}
          <div className="flex-shrink-0 p-4 border-t border-gray-200">
            {sidebarOpen && (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white font-medium text-sm">
                  {user?.fullName?.charAt(0) || 'J'}
                </div>
                <div className="ml-3 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName || 'John Vendor'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email || 'vendor@example.com'}</p>
                </div>
              </div>
            )}
            
            {!sidebarOpen && (
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white font-medium text-sm">
                  {user?.fullName?.charAt(0) || 'J'}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Mobile Sidebar - Full Height */}
      <aside
        id="mobile-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:hidden",
          "h-screen", // Ensure full screen height
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900">MarketPlace</h1>
                <p className="text-xs text-gray-500">Vendor Portal</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation - Scrollable if needed */}
          <div className="flex-1 p-6 overflow-y-auto">
            <nav className="space-y-1">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={cn(
                    'w-full justify-start text-gray-700 hover:bg-gray-100 hover:text-gray-900 h-10',
                    currentPage === item.id && 'bg-gray-900 text-white hover:bg-gray-800'
                  )}
                  onClick={() => handleNavigation(item.id)}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Button>
              ))}
            </nav>
          </div>

          {/* User section at bottom - Fixed */}
          <div className="flex-shrink-0 p-6 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-600 text-white font-medium text-sm">
                {user?.fullName?.charAt(0) || 'J'}
              </div>
              <div className="ml-3 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName || 'John Vendor'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || 'vendor@example.com'}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
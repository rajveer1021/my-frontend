import React from 'react';
import { Menu, Bell, LogOut, Settings, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/DropdownMenu';
import { useAuth } from '../../hooks/useAuth';

export const Header = ({ user, sidebarOpen, setSidebarOpen, currentPage, onPageChange }) => {
  const { logout } = useAuth();

  const getPageTitle = (page) => {
    const titles = {
      dashboard: 'Dashboard',
      products: 'Product Management',
      'add-product': 'Add Product',
      'edit-product': 'Edit Product',
      'product-details': 'Product Details',
      settings: 'Settings'
    };
    return titles[page] || 'Dashboard';
  };

  const getPageSubtitle = (page) => {
    const subtitles = {
      dashboard: 'Overview of your marketplace activity',
      products: 'Manage your product catalog',
      'add-product': 'Create a new product listing',
      'edit-product': 'Update product information',
      'product-details': 'View product details',
      settings: 'Manage your account preferences'
    };
    return subtitles[page] || 'Overview of your marketplace activity';
  };

  const getBreadcrumbs = (page) => {
    const breadcrumbs = {
      dashboard: [{ label: 'Dashboard', href: 'dashboard' }],
      products: [
        { label: 'Dashboard', href: 'dashboard' },
        { label: 'Product Management', href: 'products' }
      ],
      'add-product': [
        { label: 'Dashboard', href: 'dashboard' },
        { label: 'Product Management', href: 'products' },
        { label: 'Add Product', href: 'add-product' }
      ],
      'edit-product': [
        { label: 'Dashboard', href: 'dashboard' },
        { label: 'Product Management', href: 'products' },
        { label: 'Edit Product', href: 'edit-product' }
      ],
      'product-details': [
        { label: 'Dashboard', href: 'dashboard' },
        { label: 'Product Management', href: 'products' },
        { label: 'Product Details', href: 'product-details' }
      ],
      settings: [
        { label: 'Dashboard', href: 'dashboard' },
        { label: 'Settings', href: 'settings' }
      ]
    };
    return breadcrumbs[page] || breadcrumbs.dashboard;
  };

  const breadcrumbs = getBreadcrumbs(currentPage);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          {/* Sidebar Toggle Button - Always visible */}
          <Button
            id="mobile-menu-button"
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex flex-col min-w-0 flex-1">
            {/* Breadcrumbs */}
            <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-1">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  <button
                    onClick={() => onPageChange(crumb.href)}
                    className={`hover:text-gray-700 transition-colors ${
                      index === breadcrumbs.length - 1 
                        ? 'text-gray-900 font-medium' 
                        : 'hover:underline'
                    }`}
                  >
                    {crumb.label}
                  </button>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  )}
                </React.Fragment>
              ))}
            </nav>
            
            {/* Page Title and Subtitle */}
            {/* <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {getPageTitle(currentPage)}
              </h1>
              <p className="text-sm text-gray-500 truncate hidden sm:block">
                {getPageSubtitle(currentPage)}
              </p>
            </div> */}
          </div>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          {/* Welcome message - hidden on small screens */}
          <div className="text-right hidden lg:block">
            <p className="text-sm font-medium text-gray-900">
              Welcome back, {user?.fullName?.split(' ')[0] || 'John'}!
            </p>
          </div>
          
          {/* Notifications */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-gray-500 hover:text-gray-700 hover:bg-gray-100"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                    {user?.fullName?.charAt(0) || 'J'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="right" className="w-56">
              <div className="flex items-center justify-start gap-2 p-3">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium text-sm">{user?.fullName || 'John Vendor'}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'vendor@example.com'}
                  </p>
                  <p className="text-xs text-gray-400">
                    Vendor Account
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onPageChange('settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
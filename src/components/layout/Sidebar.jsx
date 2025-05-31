import React from 'react';
import { LayoutDashboard, Package, Settings, ShoppingBag, Heart, User } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '../../utils/helpers';
import { useAuth } from '../../hooks/useAuth';

export const Sidebar = ({ sidebarOpen, currentPage, onPageChange, userType }) => {
  const { user } = useAuth();
  
  // Different navigation items for vendors and buyers
  const vendorNavigationItems = [
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

  const buyerNavigationItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard 
    },
    { 
      id: 'products', 
      label: 'Browse Products', 
      icon: ShoppingBag 
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings 
    },
  ];

  const navigationItems = userType === 'buyer' ? buyerNavigationItems : vendorNavigationItems;
  const portalTitle = userType === 'buyer' ? 'Buyer Portal' : 'Vendor Portal';
  const bgColor = userType === 'buyer' ? 'bg-green-900' : 'bg-slate-900';

  return (
    <aside className={cn(
      `${bgColor} border-r border-gray-200 transition-all duration-300`,
      sidebarOpen ? 'w-64' : 'w-16',
      'hidden lg:block relative'
    )}>
      <div className="p-4">

        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start text-white hover:bg-opacity-20 hover:bg-white',
                !sidebarOpen && 'px-2 justify-center',
                currentPage === item.id && (userType === 'buyer' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700')
              )}
              onClick={() => onPageChange(item.id)}
            >
              <item.icon className={cn('h-5 w-5', sidebarOpen && 'mr-3')} />
              {sidebarOpen && item.label}
            </Button>
          ))}
        </nav>
      </div>

      {/* User section at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <div className={cn(
          'flex items-center text-white',
          !sidebarOpen && 'justify-center'
        )}>
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            userType === 'buyer' ? 'bg-green-600' : 'bg-blue-600'
          )}>
            <span className="text-white font-medium text-sm">
              {user?.fullName?.charAt(0) || 'U'}
            </span>
          </div>
          {sidebarOpen && (
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.fullName || 'User'}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
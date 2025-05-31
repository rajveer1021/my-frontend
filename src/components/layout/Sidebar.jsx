import React from 'react';
import { LayoutDashboard, Package, Settings } from 'lucide-react';
import Button  from '../ui/Button';
import { cn } from '../../utils/helpers';

export const Sidebar = ({ sidebarOpen, currentPage, onPageChange }) => {
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

  return (
    <aside className={cn(
      'bg-slate-900 border-r border-gray-200 transition-all duration-300',
      sidebarOpen ? 'w-64' : 'w-16',
      'hidden lg:block'
    )}>
      <div className="p-4">
        <div className={cn('flex items-center mb-8', !sidebarOpen && 'justify-center')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          {sidebarOpen && (
            <div className="ml-3">
              <h1 className="font-bold text-white">MarketPlace</h1>
              <p className="text-xs text-gray-400">Vendor Portal</p>
            </div>
          )}
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start text-white hover:bg-slate-800',
                !sidebarOpen && 'px-2 justify-center',
                currentPage === item.id && 'bg-blue-600 hover:bg-blue-700'
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
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">J</span>
          </div>
          {sidebarOpen && (
            <div className="ml-3">
              <p className="text-sm font-medium">John Vendor</p>
              <p className="text-xs text-gray-400">example@gmail.com</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};


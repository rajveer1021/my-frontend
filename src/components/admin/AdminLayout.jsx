// src/components/admin/AdminLayout.jsx - Complete file
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useSafeUser } from '../../hooks/useSafeUser';
import Button from '../ui/Button';
import { 
  LogOut, 
  Settings, 
  Shield, 
  Bell,
  Search,
  Menu,
  Home,
  Users,
  Package,
  BarChart3
} from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/Avatar';

const AdminLayout = ({ children }) => {
  const { logout } = useAuth();
  const { displayName, email, initials } = useSafeUser();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">Admin Portal</h1>
                <p className="text-xs text-gray-500">Multi-Vendor Marketplace</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users, vendors, products..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                />
              </div>
            </div>

            {/* Admin Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Admin Profile */}
              <div className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-semibold text-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium text-gray-900">{displayName}</p>
                  <p className="text-xs text-purple-600 font-medium">Super Admin</p>
                </div>
              </div>

              {/* Logout */}
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-white/20 mt-8">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-500 mb-2 sm:mb-0">
              © 2024 Multi-Vendor Marketplace. All rights reserved.
            </p>
            <div className="flex items-center space-x-4">
              <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Privacy Policy
              </button>
              <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Terms of Service
              </button>
              <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Support
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
import React from 'react';
import { Menu, Bell, LogOut, Settings } from 'lucide-react';
import Button  from '../ui/Button';
import { Avatar, AvatarFallback } from '../ui/Avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/DropdownMenu';
import { useAuth } from '../../contexts/AuthContext';

export const Header = ({ user, sidebarOpen, setSidebarOpen, currentPage, onPageChange }) => {
  const { logout } = useAuth();

  const getPageTitle = (page) => {
    const titles = {
      dashboard: 'Dashboard',
      products: 'Products',
      settings: 'Settings'
    };
    return titles[page] || 'Dashboard';
  };

  const getPageSubtitle = (page) => {
    const subtitles = {
      dashboard: 'Manage your marketplace presence',
      products: 'Manage your marketplace presence',
      settings: 'Manage your marketplace presence'
    };
    return subtitles[page] || 'Manage your marketplace presence';
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-gray-900">{getPageTitle(currentPage)}</h1>
              <p className="text-xs text-gray-500">{getPageSubtitle(currentPage)}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">Welcome back, {user?.fullName?.split(' ')[0] || 'User'}!</p>
          </div>
          
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {user?.fullName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="right">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.fullName}</p>
                  <p className="w-[200px] truncate text-sm text-gray-500">
                    {user?.email}
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
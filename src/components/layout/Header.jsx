// src/components/layout/Header.jsx - Updated with admin support
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  LogOut,
  Settings,
  ChevronRight,
  Search,
  MessageSquare,
  User,
  Shield,
} from "lucide-react";
import Button from "../ui/Button";
import { Avatar, AvatarFallback } from "../ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { useAuth } from "../../contexts/AuthContext";
import { useSafeUser } from "../../hooks/useSafeUser";

export const Header = ({
  sidebarOpen,
  setSidebarOpen,
  currentPage,
  onPageChange,
  isAdmin = false,
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Use the safe user hook instead of direct useAuth
  const {
    displayName,
    email,
    initials,
    isAuthenticated,
    loading,
    accountTypeDisplay,
  } = useSafeUser();

  const handleLogout = () => {
    logout();
    navigate("/auth", { replace: true });
  };

  const getPageTitle = (page) => {
    if (isAdmin) {
      const adminTitles = {
        'admin-dashboard': "Admin Dashboard",
        'admin-users': "User Management",
        'admin-vendors': "Vendor Management",
        'admin-products': "Product Management",
        'admin-settings': "System Settings",
      };
      return adminTitles[page] || "Admin Dashboard";
    }
    
    const titles = {
      dashboard: "Dashboard",
      products: "Product Management",
      "add-product": "Add Product",
      "edit-product": "Edit Product",
      "product-details": "Product Details",
      settings: "Settings",
    };
    return titles[page] || "Dashboard";
  };

  const getPageSubtitle = (page) => {
    if (isAdmin) {
      const adminSubtitles = {
        'admin-dashboard': "System overview and analytics",
        'admin-users': "Manage platform users",
        'admin-vendors': "Vendor verification and management",
        'admin-products': "Product moderation and oversight",
        'admin-settings': "System configuration",
      };
      return adminSubtitles[page] || "System overview and analytics";
    }
    
    const subtitles = {
      dashboard: "Overview of your marketplace activity",
      products: "Manage your product catalog",
      "add-product": "Create a new product listing",
      "edit-product": "Update product information",
      "product-details": "View product details",
      settings: "Manage your account preferences",
    };
    return subtitles[page] || "Overview of your marketplace activity";
  };

  const getBreadcrumbs = (page) => {
    if (isAdmin) {
      const adminBreadcrumbs = {
        'admin-dashboard': [{ label: "Admin Dashboard", href: "admin-dashboard" }],
        'admin-users': [
          { label: "Admin Dashboard", href: "admin-dashboard" },
          { label: "User Management", href: "admin-users" },
        ],
        'admin-vendors': [
          { label: "Admin Dashboard", href: "admin-dashboard" },
          { label: "Vendor Management", href: "admin-vendors" },
        ],
        'admin-products': [
          { label: "Admin Dashboard", href: "admin-dashboard" },
          { label: "Product Management", href: "admin-products" },
        ],
        'admin-settings': [
          { label: "Admin Dashboard", href: "admin-dashboard" },
          { label: "System Settings", href: "admin-settings" },
        ],
      };
      return adminBreadcrumbs[page] || adminBreadcrumbs['admin-dashboard'];
    }
    
    const breadcrumbs = {
      dashboard: [{ label: "Dashboard", href: "dashboard" }],
      products: [
        { label: "Dashboard", href: "dashboard" },
        { label: "Product Management", href: "products" },
      ],
      "add-product": [
        { label: "Dashboard", href: "dashboard" },
        { label: "Product Management", href: "products" },
        { label: "Add Product", href: "add-product" },
      ],
      "edit-product": [
        { label: "Dashboard", href: "dashboard" },
        { label: "Product Management", href: "products" },
        { label: "Edit Product", href: "edit-product" },
      ],
      "product-details": [
        { label: "Dashboard", href: "dashboard" },
        { label: "Product Management", href: "products" },
        { label: "Product Details", href: "product-details" },
      ],
      settings: [
        { label: "Dashboard", href: "dashboard" },
        { label: "Settings", href: "settings" },
      ],
    };
    return breadcrumbs[page] || breadcrumbs.dashboard;
  };

  const breadcrumbs = getBreadcrumbs(currentPage);

  // Don't render if not authenticated
  if (!isAuthenticated || loading) {
    return null;
  }

  const headerGradient = isAdmin 
    ? "bg-gradient-to-r from-purple-600 to-indigo-600" 
    : "bg-white/80";

  const textColor = isAdmin ? "text-white" : "text-gray-600";

  return (
    <header className={`sticky top-0 z-50 ${headerGradient} backdrop-blur-md border-b border-white/20 shadow-lg`}>
      <div className="h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Left Side - Menu and Breadcrumbs */}
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <Button
              id="mobile-menu-button"
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`${textColor} hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-all duration-200 backdrop-blur-sm ${isAdmin ? 'hover:bg-white/20 hover:text-white' : ''}`}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Breadcrumbs */}
            <div className="flex flex-col min-w-0 flex-1">
              <nav className="flex items-center space-x-1 text-sm mb-1">
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    <button
                      onClick={() => onPageChange(crumb.href)}
                      className={`hover:text-blue-600 transition-colors duration-200 rounded-lg px-2 py-1 hover:bg-blue-50 ${
                        index === breadcrumbs.length - 1
                          ? `${textColor} font-medium ${isAdmin ? 'bg-white/20' : 'bg-gray-100'}`
                          : `${isAdmin ? 'text-purple-100' : 'text-gray-500'} hover:underline`
                      } ${isAdmin && index === breadcrumbs.length - 1 ? 'hover:bg-white/30' : ''}`}
                    >
                      {crumb.label}
                    </button>
                    {index < breadcrumbs.length - 1 && (
                      <ChevronRight className={`h-3 w-3 ${isAdmin ? 'text-purple-200' : 'text-gray-400'}`} />
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </div>
          </div>

          {/* Right Side - User Profile Dropdown */}
          <div className="flex items-center space-x-3 lg:space-x-4 flex-shrink-0">
            {/* Admin Badge */}
            {isAdmin && (
              <div className="hidden lg:flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                <Shield className="w-4 h-4 text-purple-200" />
                <span className="text-xs font-medium text-purple-100">ADMIN</span>
              </div>
            )}

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`relative flex items-center space-x-3 p-2 rounded-xl ${isAdmin ? 'hover:bg-white/20' : 'hover:bg-gray-100/80'} transition-all duration-200 group`}>
                  <div className="relative">
                    <Avatar className="h-8 w-8 lg:h-10 lg:w-10 ring-2 ring-white shadow-lg">
                      <AvatarFallback className={`bg-gradient-to-br ${isAdmin ? 'from-purple-500 to-indigo-600' : 'from-blue-500 to-purple-600'} text-white font-semibold text-sm`}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>

                  {/* User Info - Desktop Only */}
                  <div className="text-left hidden lg:block">
                    <p className={`text-sm font-medium ${textColor} group-hover:text-blue-600 transition-colors ${isAdmin ? 'group-hover:text-purple-100' : ''}`}>
                      {displayName}
                    </p>
                    <p className={`text-xs ${isAdmin ? 'text-purple-200' : 'text-gray-500'}`}>
                      {isAdmin ? 'Super Admin' : 'Vendor Account'}
                    </p>
                  </div>

                  <ChevronRight className={`h-4 w-4 ${isAdmin ? 'text-purple-200' : 'text-gray-400'} group-hover:text-gray-600 transition-colors transform group-hover:translate-x-0.5 hidden lg:block ${isAdmin ? 'group-hover:text-purple-100' : ''}`} />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-64 mt-2 bg-white/95 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl"
              >
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={`bg-gradient-to-br ${isAdmin ? 'from-purple-500 to-indigo-600' : 'from-blue-500 to-purple-600'} text-white font-semibold`}>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {displayName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">{email}</p>
                      <p className="text-xs text-purple-600 font-medium">
                        {accountTypeDisplay}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <DropdownMenuItem
                    onClick={() => onPageChange(isAdmin ? "admin-settings" : "settings")}
                    className="flex px-4 py-3 hover:bg-gray-50 transition-colors rounded-lg"
                  >
                    <div className={`p-2 rounded-lg ${isAdmin ? 'bg-purple-100' : 'bg-blue-100'} mr-3`}>
                      <Settings className={`h-4 w-4 ${isAdmin ? 'text-purple-600' : 'text-blue-600'}`} />
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="font-medium text-gray-900">Settings</p>
                      <p className="text-xs text-gray-500">
                        {isAdmin ? 'System settings' : 'Preferences & privacy'}
                      </p>
                    </div>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="mx-2" />

                <div className="py-2">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex px-4 py-3 hover:bg-red-50 transition-colors rounded-lg text-red-600"
                  >
                    <div className="p-2 rounded-lg bg-red-100 mr-3">
                      <LogOut className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex flex-col items-start">
                      <p className="font-medium">Sign Out</p>
                      <p className="text-xs text-red-500">
                        Log out of your account
                      </p>
                    </div>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};
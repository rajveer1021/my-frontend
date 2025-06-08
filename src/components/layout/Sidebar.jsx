// src/components/layout/Sidebar.jsx - Updated with admin support
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Settings,
  X,
  ChevronRight,
  UserPlus,
  Users,
  Building,
  Shield,
  BarChart3,
  Cog,
} from "lucide-react";
import Button from "../ui/Button";
import { cn } from "../../utils/helpers";
import { useSafeUser } from "../../hooks/useSafeUser";

export const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  currentPage,
  onPageChange,
  isAdmin = false,
}) => {
  const { displayName, email, initials, isAuthenticated, loading } =
    useSafeUser();

  const location = useLocation();
  const navigate = useNavigate();

  const adminNavigationItems = [
    {
      id: "admin-dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "System overview",
      badge: null,
      path: "/admin",
    },
    {
      id: "admin-profile-verification",
      label: "Verifications",
      icon: Shield,
      description: "Profile approvals",
      badge: null,
      path: "/admin/profile-verification",
    },
    {
      id: "admin-vendors",
      label: "Vendors",
      icon: Building,
      description: "Manage vendors",
      badge: null,
      path: "/admin/vendors",
    },
    {
      id: "admin-buyers",
      label: "Buyers",
      icon: Users,
      description: "Manage buyers",
      badge: null,
      path: "/admin/buyers",
    },
    {
      id: "admin-subscriptions",
      label: "Subscriptions",
      icon: Cog,
      description: "Subscriptions",
      badge: null,
      path: "/admin/subscription",
    },
  ];

  const vendorNavigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview & analytics",
      badge: null,
      path: "/",
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      description: "Manage catalog",
      badge: null,
      path: "/products",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Account preferences",
      badge: null,
      path: "/settings",
    },
  ];

  const navigationItems = isAdmin
    ? adminNavigationItems
    : vendorNavigationItems;

  const handleNavigation = (item) => {
    if (isAdmin) {
      // For admin, use onPageChange callback
      onPageChange(item.id);
    } else {
      // For vendor, use React Router navigation
      navigate(item.path);
    }

    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const isCurrentPage = (item) => {
    if (isAdmin) {
      return currentPage === item.id;
    }
    return location.pathname === item.path;
  };

  const NavigationItem = ({ item, isCollapsed }) => (
    <button
      onClick={() => handleNavigation(item)}
      className={cn(
        "w-full group relative flex items-center transition-all duration-300 rounded-2xl",
        isCurrentPage(item)
          ? `bg-gradient-to-r ${
              isAdmin
                ? "from-purple-600 to-indigo-600"
                : "from-blue-600 to-purple-600"
            } text-white shadow-lg`
          : "text-gray-700 hover:text-gray-900",
        isCollapsed ? "justify-center p-3" : "justify-start p-4"
      )}
      title={isCollapsed ? item.label : undefined}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex-shrink-0 transition-all duration-300",
          isCurrentPage(item)
            ? "text-white"
            : `text-gray-600 group-hover:${
                isAdmin ? "text-purple-600" : "text-blue-600"
              }`,
          isCollapsed ? "" : "mr-4"
        )}
      >
        <item.icon className="h-6 w-6" />
      </div>

      {/* Label and Description */}
      {!isCollapsed && (
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm truncate">{item.label}</span>
            {item.badge && (
              <span
                className={cn(
                  "ml-2 px-2 py-0.5 text-xs rounded-full font-medium",
                  isCurrentPage(item)
                    ? "bg-white/20 text-white"
                    : `${
                        isAdmin
                          ? "bg-purple-100 text-purple-600 group-hover:bg-purple-200"
                          : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                      }`
                )}
              >
                {item.badge}
              </span>
            )}
          </div>
          <p
            className={cn(
              "text-xs mt-0.5 truncate transition-colors",
              isCurrentPage(item)
                ? "text-white/80"
                : "text-gray-500 group-hover:text-gray-600"
            )}
          >
            {item.description}
          </p>
        </div>
      )}

      {/* Hover arrow */}
      {!isCollapsed && !isCurrentPage(item) && (
        <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
      )}
    </button>
  );

  // Don't render if not authenticated or still loading
  if (!isAuthenticated || loading) {
    return null;
  }

  const sidebarGradient = isAdmin
    ? "bg-gradient-to-b from-white via-purple-50 to-indigo-50"
    : "bg-white/90";

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:backdrop-blur-md lg:border-r lg:border-white/20 transition-all duration-300",
          "lg:fixed lg:top-16 lg:bottom-0 lg:left-0 lg:h-[calc(100vh-4rem)] lg:shadow-xl",
          sidebarGradient,
          sidebarOpen ? "lg:w-72" : "lg:w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex-shrink-0 p-6 border-b border-white/10">
            {sidebarOpen ? (
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                    isAdmin
                      ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                      : "bg-gradient-to-br from-blue-600 to-purple-600"
                  }`}
                >
                  {isAdmin ? (
                    <Shield className="w-6 h-6 text-white" />
                  ) : (
                    <span className="text-white font-bold text-lg">M</span>
                  )}
                </div>
                <div>
                  <h1 className="font-bold text-gray-900 text-lg">
                    {isAdmin ? "Admin Portal" : "Multi-Vendor"}
                  </h1>
                  <div className="flex items-center space-x-1">
                    <p className="text-xs text-gray-500">
                      {isAdmin ? "System Management" : "Vendor Portal"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                    isAdmin
                      ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                      : "bg-gradient-to-br from-blue-600 to-purple-600"
                  }`}
                >
                  {isAdmin ? (
                    <Shield className="w-6 h-6 text-white" />
                  ) : (
                    <span className="text-white font-bold text-lg">M</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Section */}
          <div className="flex-1 p-4 overflow-y-auto">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <NavigationItem
                  key={item.id}
                  item={item}
                  isCollapsed={!sidebarOpen}
                />
              ))}
            </nav>
          </div>

          {/* User Section */}
          <div className="flex-shrink-0 p-4 border-t border-white/10">
            {sidebarOpen ? (
              <div
                className={`flex items-center space-x-3 p-3 rounded-2xl border border-gray-100 ${
                  isAdmin
                    ? "bg-gradient-to-r from-purple-50 to-indigo-50"
                    : "bg-gradient-to-r from-gray-50 to-blue-50"
                }`}
              >
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-semibold text-sm shadow-lg ${
                      isAdmin
                        ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                        : "bg-gradient-to-br from-blue-600 to-purple-600"
                    }`}
                  >
                    {initials}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{email}</p>
                  {isAdmin && (
                    <p className="text-xs text-purple-600 font-medium">
                      Super Admin
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="relative">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-semibold text-sm shadow-lg ${
                      isAdmin
                        ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                        : "bg-gradient-to-br from-blue-600 to-purple-600"
                    }`}
                  >
                    {initials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 backdrop-blur-md border-r border-white/20 shadow-2xl transform transition-transform duration-300 ease-out lg:hidden",
          sidebarGradient,
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div
            className={`flex-shrink-0 flex items-center justify-between p-6 border-b border-white/10 ${
              isAdmin
                ? "bg-gradient-to-r from-purple-50 to-indigo-50"
                : "bg-gradient-to-r from-blue-50 to-purple-50"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                  isAdmin
                    ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                    : "bg-gradient-to-br from-blue-600 to-purple-600"
                }`}
              >
                {isAdmin ? (
                  <Shield className="w-6 h-6 text-white" />
                ) : (
                  <span className="text-white font-bold text-lg">M</span>
                )}
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">
                  {isAdmin ? "Admin Portal" : "MarketPlace"}
                </h1>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-gray-500">
                    {isAdmin ? "System Management" : "Vendor Portal"}
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 p-6 overflow-y-auto">
            <nav className="space-y-3">
              {navigationItems.map((item) => (
                <NavigationItem key={item.id} item={item} isCollapsed={false} />
              ))}
            </nav>
          </div>

          {/* Mobile User Section */}
          <div className="flex-shrink-0 p-6 border-t border-white/10">
            <div
              className={`flex items-center space-x-3 p-4 rounded-2xl border border-gray-100 ${
                isAdmin
                  ? "bg-gradient-to-r from-purple-50 to-indigo-50"
                  : "bg-gradient-to-r from-gray-50 to-blue-50"
              }`}
            >
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-semibold shadow-lg ${
                    isAdmin
                      ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                      : "bg-gradient-to-br from-blue-600 to-purple-600"
                  }`}
                >
                  {initials}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {displayName}
                </p>
                <p className="text-sm text-gray-500 truncate">{email}</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-xs text-green-600 font-medium">
                    {isAdmin ? "Super Admin" : "Online"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

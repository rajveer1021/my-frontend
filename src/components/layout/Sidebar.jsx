import React from "react";
import {
  LayoutDashboard,
  Package,
  Settings,
  X,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import Button from "../ui/Button";
import { cn } from "../../utils/helpers";
import { useAuth } from "../../hooks/useAuth";

export const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  currentPage,
  onPageChange,
}) => {
  const { user } = useAuth();

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview & analytics",
      badge: null,
    },
    {
      id: "products",
      label: "Products",
      icon: Package,
      description: "Manage catalog",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Account preferences",
      badge: null,
    },
  ];

  const handleNavigation = (page) => {
    onPageChange(page);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const NavigationItem = ({ item, isCollapsed }) => (
    <button
      onClick={() => handleNavigation(item.id)}
      className={cn(
        "w-full group relative flex items-center transition-all duration-300 rounded-2xl",
        currentPage === item.id
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
          : "text-gray-700 hover:text-gray-900",
        isCollapsed ? "justify-center p-3" : "justify-start p-4"
      )}
      title={isCollapsed ? item.label : undefined}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex-shrink-0 transition-all duration-300",
          currentPage === item.id
            ? "text-white"
            : "text-gray-600 group-hover:text-blue-600",
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
                  currentPage === item.id
                    ? "bg-white/20 text-white"
                    : "bg-blue-100 text-blue-600 group-hover:bg-blue-200"
                )}
              >
                {item.badge}
              </span>
            )}
          </div>
          <p
            className={cn(
              "text-xs mt-0.5 truncate transition-colors",
              currentPage === item.id
                ? "text-white/80"
                : "text-gray-500 group-hover:text-gray-600"
            )}
          >
            {item.description}
          </p>
        </div>
      )}

      {/* Hover arrow */}
      {!isCollapsed && currentPage !== item.id && (
        <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
      )}
    </button>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex lg:flex-col lg:bg-white/90 lg:backdrop-blur-md lg:border-r lg:border-white/20 transition-all duration-300",
          "lg:fixed lg:top-16 lg:bottom-0 lg:left-0 lg:h-[calc(100vh-4rem)] lg:shadow-xl",
          sidebarOpen ? "lg:w-72" : "lg:w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex-shrink-0 p-6 border-b border-white/10">
            {sidebarOpen ? (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div>
                  <h1 className="font-bold text-gray-900 text-lg">
                    MarketPlace
                  </h1>
                  <div className="flex items-center space-x-1">
                    <p className="text-xs text-gray-500">Vendor Portal</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                  <span className="text-white font-bold text-lg">M</span>
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
              <div className="flex items-center space-x-3 p-3 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-100">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold text-sm shadow-lg">
                    {user?.fullName?.charAt(0) || "J"}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.fullName || "John Vendor"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || "vendor@example.com"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold text-sm shadow-lg">
                    {user?.fullName?.charAt(0) || "J"}
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
          "fixed inset-y-0 left-0 z-50 w-80 bg-white/95 backdrop-blur-md border-r border-white/20 shadow-2xl transform transition-transform duration-300 ease-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">MarketPlace</h1>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-gray-500">Vendor Portal</p>
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
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-100">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-white font-semibold shadow-lg">
                  {user?.fullName?.charAt(0) || "J"}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {user?.fullName || "John Vendor"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {user?.email || "vendor@example.com"}
                </p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  <span className="text-xs text-green-600 font-medium">
                    Online
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

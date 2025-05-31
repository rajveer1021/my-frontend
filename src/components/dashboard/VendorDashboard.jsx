// src/components/dashboard/VendorDashboard.jsx - Fixed with useSafeUser hook  
import React, { useEffect, useState } from "react";
import {
  Package,
  MessageSquare,
  CheckCircle,
  Users,
  TrendingUp,
  ShoppingCart,
} from "lucide-react";
import { StatCard } from "../dashboard/StatCard";
import { StockOverview } from "../dashboard/StockOverview";
import { RecentEnquiries } from "../dashboard/RecentEnquiries";
import { dashboardService } from "../../services/dashboardService";
import { useSafeUser } from "../../hooks/useSafeUser"; // Use safe user hook
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useToast } from "../ui/Toast";

const VendorDashboard = () => {
  const { displayName, firstName, isAuthenticated } = useSafeUser(); // Use safe user hook
  const { addToast } = useToast();

  // State for dashboard data
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalInquiries: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    isProfileVerified: false,
    inventoryValue: 0,
    monthlyVisitors: 1250, // Mock data for now
    profileCompletionPercentage: 0,
  });

  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all dashboard data concurrently
        const [stats, enquiries, products] = await Promise.allSettled([
          dashboardService.getDashboardStats(),
          dashboardService.getRecentInquiries(5),
          dashboardService.getRecentProducts(6),
        ]);

        // Handle dashboard stats
        if (stats.status === "fulfilled") {
          setDashboardStats(stats.value);
        } else {
          console.error("Failed to load dashboard stats:", stats.reason);
          addToast("Failed to load dashboard statistics", "warning");
        }

        // Handle recent enquiries
        if (enquiries.status === "fulfilled") {
          setRecentEnquiries(enquiries.value);
        } else {
          console.error("Failed to load recent enquiries:", enquiries.reason);
          // Don't show error for enquiries as it's not critical
        }

        // Handle recent products
        if (products.status === "fulfilled") {
          setRecentProducts(products.value);
        } else {
          console.error("Failed to load recent products:", products.reason);
          // Don't show error for products as it's not critical
        }
      } catch (error) {
        console.error("Dashboard data loading error:", error);
        setError("Failed to load dashboard data");
        addToast("Failed to load dashboard data", "error");
      } finally {
        setLoading(false);
      }
    };

    // Only load data if user is authenticated
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [addToast, isAuthenticated]);

  // Refresh dashboard data
  const refreshDashboard = async () => {
    try {
      const [stats, enquiries] = await Promise.allSettled([
        dashboardService.getDashboardStats(),
        dashboardService.getRecentInquiries(5),
      ]);

      if (stats.status === "fulfilled") {
        setDashboardStats(stats.value);
      }

      if (enquiries.status === "fulfilled") {
        setRecentEnquiries(enquiries.value);
      }

      addToast("Dashboard refreshed successfully", "success");
    } catch (error) {
      console.error("Dashboard refresh error:", error);
      addToast("Failed to refresh dashboard", "error");
    }
  };

  // Calculate trends (you can enhance this with historical data from API)
  const calculateTrend = (current, type = "percentage") => {
    // For now, we'll use mock trend data since we don't have historical data
    // In a real app, you'd fetch historical data from the API
    const mockTrends = {
      products: "+12%",
      enquiries:
        dashboardStats.totalInquiries > 0
          ? `${dashboardStats.totalInquiries} new`
          : "No new",
      profile: dashboardStats.isProfileVerified
        ? "100% complete"
        : "75% complete",
      visitors: "+22%",
    };

    return mockTrends[type] || "+0%";
  };

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-800">
            <h3 className="font-medium">Error loading dashboard</h3>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  ('VendorDashboard: Rendering with user data:', { displayName, firstName }); // Debug log

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {firstName || displayName || "Vendor"}!
        </h1>
        <p className="text-blue-100">
          Here's what's happening with your marketplace today.
        </p>
      </div>

      {/* Profile Verification Alert */}
      {!dashboardStats.isProfileVerified && (
        <div
          onClick={() => (window.location.href = "/vendor-onboarding")}
          className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 cursor-pointer hover:bg-yellow-100 transition-colors"
        >
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 mb-2">
                Complete Your Profile Verification
              </h3>
              <p className="text-yellow-700 text-sm mb-4">
                Your profile is pending verification. Complete your vendor
                onboarding to unlock all features and start receiving more
                inquiries.
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent redirect if button is clicked
                  window.location.href = "/vendor-onboarding";
                }}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
              >
                Complete Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          className="relative rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer animate-fade-in bg-gradient-to-br from-blue-500 to-indigo-600"
          style={{ animationDelay: "0ms" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-white/20">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Total Products</p>
              <p className="text-3xl font-bold">
                {dashboardStats.totalProducts}
              </p>
            </div>
            <div className="absolute top-4 right-4 opacity-20">
              <Package className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <div
          className="relative rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer animate-fade-in bg-gradient-to-br from-green-500 to-emerald-600"
          style={{ animationDelay: "100ms" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-white/20">
                <Package className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Inventory Check</p>
              <p className="text-3xl font-bold">
                {dashboardStats.inventoryValue?.toLocaleString() || "0"}
              </p>
            </div>
          </div>
        </div>

        <div
          className="relative rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer animate-fade-in bg-gradient-to-br from-purple-500 to-violet-600"
          style={{ animationDelay: "200ms" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-white/20">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center text-sm font-medium text-green-200">
                {dashboardStats.totalInquiries > 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <div className="w-4 h-4 mr-1" />
                )}
                {calculateTrend(dashboardStats.totalInquiries, "enquiries")}
              </div>
            </div>
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">All Enquiries</p>
              <p className="text-3xl font-bold">
                {dashboardStats.totalInquiries}
              </p>
            </div>
            <div className="absolute top-4 right-4 opacity-20">
              <MessageSquare className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <div
          className={`relative rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer animate-fade-in ${
            dashboardStats.isProfileVerified
              ? "bg-gradient-to-br from-emerald-500 to-teal-600"
              : "bg-gradient-to-br from-yellow-500 to-orange-600"
          }`}
          style={{ animationDelay: "300ms" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="p-6 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-white/20">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              {dashboardStats.isProfileVerified && (
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              )}
            </div>
            <div className="text-white">
              <p className="text-sm opacity-90 mb-1">Profile Status</p>
              <p className="text-3xl font-bold">
                {dashboardStats.isProfileVerified ? "Verified" : "Pending"}
              </p>
            </div>
            <div className="absolute top-4 right-4 opacity-20">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stock Overview and Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StockOverview
          stockData={dashboardService.getStockOverview(dashboardStats)}
        />
        <RecentEnquiries
          enquiries={recentEnquiries}
          loading={false}
          onRefresh={refreshDashboard}
        />
      </div>

      {/* Quick Actions */}
      {dashboardStats.totalProducts === 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Package className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to start selling?
            </h3>
            <p className="text-gray-600 mb-6">
              Add your first product to get started on the marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => (window.location.href = "/add-product")}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium"
              >
                <Package className="w-4 h-4 mr-2 inline" />
                Add Your First Product
              </button>
              <button
                onClick={() => (window.location.href = "/products")}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                View Products
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Products */}
      {dashboardStats.totalProducts > 0 && recentProducts.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center">
                <Package className="w-5 h-5 lg:w-6 lg:h-6 mr-3 text-blue-600" />
                Recent Products
              </h2>
              <button
                onClick={() => (window.location.href = "/products")}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
              >
                View All Products
              </button>
            </div>
          </div>

          <div className="p-4 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-medium text-gray-900">
                          ₹{product.price}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${
                            product.status === "In Stock"
                              ? "bg-green-100 text-green-800"
                              : product.status === "Low Stock"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
import React from "react";
import {
  Package,
  MessageSquare,
  CheckCircle,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  ShoppingCart,
  Clock,
  ArrowUpRight,
  Mail,
  Star,
  AlertTriangle,
  Plus,
  BarChart3,
  Calendar,
  DollarSign,
} from "lucide-react";
import {
  mockProducts,
  mockEnquiries,
  getStoredData,
} from "../../services/mockData";
import { StatCard } from "./StatCard";
import { StockOverview } from "./StockOverview";
import { RecentEnquiries } from "./RecentEnquiries";

const VendorDashboard = () => {
  const products = getStoredData("products", mockProducts);
  const enquiries = getStoredData("enquiries", mockEnquiries);

  const totalProducts = products.length;
  const inStockProducts = products.filter(
    (p) => p.stockStatus === "in-stock"
  ).length;
  const outOfStockProducts = products.filter(
    (p) => p.stockStatus === "out-of-stock"
  ).length;
  const lowStockProducts = products.filter(
    (p) => p.stockStatus === "low-stock"
  ).length;
  const newEnquiries = enquiries.filter((e) => e.status === "new").length;

  const dashboardStats = {
    totalProducts,
    activeEnquiries: newEnquiries,
    profileStatus: "Verified",
    monthlyVisitors: 1250,
    revenue: 12580,
    orders: 24,
  };

  const stockOverview = {
    inStock: inStockProducts,
    lowStock: lowStockProducts,
    outOfStock: outOfStockProducts,
  };

  return (
    <div className="w-full max-w-none space-y-6">
      <div className="space-y-6">
        {/* Welcome Header with Enhanced Design */}
        <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-4 sm:p-6 lg:p-8 text-white">
          <div className="relative z-10 grid md:grid-cols-2 gap-6 lg:gap-8 items-center">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-2xl">👋</span>
                </div>
                <div className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                  Vendor Dashboard
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3">
                Welcome back, <span className="text-blue-200">John!</span>
              </h1>
              <p className="text-blue-100 text-base lg:text-lg mb-4 lg:mb-6">
                Here's what's happening with your marketplace today.
              </p>
            </div>
          </div>
        </div>

        {/* Main KPI Cards with Gradients */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <StatCard
            title="Total Products"
            value={dashboardStats.totalProducts}
            change="+12%"
            trend="up"
            icon={Package}
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            delay={0}
          />
          <StatCard
            title="Active Enquiries"
            value={dashboardStats.activeEnquiries}
            change="+8%"
            trend="up"
            icon={MessageSquare}
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
            delay={100}
          />
          <StatCard
            title="Monthly Revenue"
            value={`$${dashboardStats.revenue.toLocaleString()}`}
            change="+22%"
            trend="up"
            icon={DollarSign}
            gradient="bg-gradient-to-br from-green-500 to-green-600"
            delay={200}
          />
          <StatCard
            title="Profile Status"
            value={dashboardStats.profileStatus}
            change="100%"
            trend="up"
            icon={CheckCircle}
            gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
            delay={300}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Stock Overview - Enhanced */}
          <StockOverview stockData={stockOverview} />

          {/* Recent Enquiries - Enhanced */}
          <div className="lg:col-span-2">
            <RecentEnquiries enquiries={enquiries} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
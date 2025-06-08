import React, { useState, useEffect } from "react";
import {
  Users,
  Package,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Shield,
  CheckCircle,
  AlertTriangle,
  Settings,
  BarChart3,
  UserCheck,
  Building,
  Eye,
  Calendar,
  DollarSign,
  Activity,
  Clock,
  Bell,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  Target,
  Zap,
  AlertCircle,
  Info,
  X,
} from "lucide-react";

// Import the admin service
import { adminService } from "../../services/adminService";
import { LoadingSpinner } from "../common/LoadingSpinner";

const AdminDashboard = () => {
  const [coreKPIs, setCoreKPIs] = useState(null);
  const [activityMetrics, setActivityMetrics] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the fixed admin service
      const dashboardData = await adminService.getAllDashboardData();

      // Handle partial success scenarios
      if (dashboardData.coreKPIs) {
        setCoreKPIs(dashboardData.coreKPIs);
      } else if (dashboardData.coreKPIsError) {
        console.warn("⚠️ Core KPIs failed:", dashboardData.coreKPIsError);
      }

      if (dashboardData.activityMetrics) {
        setActivityMetrics(dashboardData.activityMetrics);
      } else if (dashboardData.activityMetricsError) {
        console.warn("⚠️ Activity Metrics failed:", dashboardData.activityMetricsError);
      }

      if (dashboardData.recentActivities) {
        setRecentActivities(dashboardData.recentActivities.activities || []);
      } else if (dashboardData.recentActivitiesError) {
        console.warn("⚠️ Recent Activities failed:", dashboardData.recentActivitiesError);
      }

      // If we have at least some data, consider it a success
      if (dashboardData.coreKPIs || dashboardData.activityMetrics || dashboardData.recentActivities) {
        
        // Set any partial errors
        const errors = [
          dashboardData.coreKPIsError,
          dashboardData.activityMetricsError,
          dashboardData.recentActivitiesError
        ].filter(Boolean);
        
        if (errors.length > 0) {
          setError(`Some data failed to load: ${errors.join(", ")}`);
        }
      } else {
        throw new Error("No dashboard data could be loaded");
      }

    } catch (error) {
      console.error("❌ Failed to load dashboard data:", error);
      setError(error.message || "Failed to load dashboard data");

      // Try to load with fallback mock data for development
      if (process.env.NODE_ENV === "development") {
        await loadMockData();
      }
    } finally {
      setLoading(false);
    }
  };

  // Load mock data as fallback for development
  const loadMockData = async () => {
    const mockCoreKPIs = {
      totalUsers: { value: 1247, growth: 12, thisMonth: 134, lastMonth: 119, verificationRate: 78 },
      totalVendors: { value: 156, growth: 8, thisMonth: 23, lastMonth: 21, verificationRate: 78 },
      totalProducts: { value: 2340, growth: 15, thisMonth: 287, lastMonth: 249, availabilityRate: 92 },
      totalInquiries: { value: 892, growth: 22, thisMonth: 178, lastMonth: 146, responseRate: 85 },
      platformHealth: { status: "Excellent", verificationRate: 78, availabilityRate: 92, responseRate: 85 },
      generatedAt: new Date().toISOString(),
    };

    const mockActivityMetrics = {
      pendingVerifications: { value: 34, priority: "high" },
      rejectedVendors: { value: 8, priority: "medium" },
      openInquiries: { value: 67, priority: "medium" },
      activeProducts: { value: 2156, outOfStock: 184, total: 2340 },
      verificationRate: { value: 78, verified: 122, pending: 34, rejected: 8, total: 156 },
      inquiryMetrics: { responseRate: 85, total: 892, open: 67, responded: 456, closed: 369 },
      generatedAt: new Date().toISOString(),
    };

    const mockActivities = [
      {
        id: "1",
        type: "user_registration",
        title: "New User Registration",
        description: "John Doe (VENDOR) joined the platform",
        timestamp: new Date().toISOString(),
        icon: "user-plus",
        priority: "high",
      },
      {
        id: "2",
        type: "product_listed",
        title: "New Product Listed",
        description: "iPhone 15 Pro by TechCorp",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        icon: "package",
        priority: "medium",
      },
      {
        id: "3",
        type: "vendor_verified",
        title: "Vendor Verified",
        description: "ABC Electronics has been verified",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        icon: "check-circle",
        priority: "high",
      },
    ];

    setCoreKPIs(mockCoreKPIs);
    setActivityMetrics(mockActivityMetrics);
    setRecentActivities(mockActivities);
  };

  const refreshData = async () => {
    setRefreshing(true);
    try {
      await adminService.refreshDashboardData();
      await loadDashboardData();
    } catch (error) {
      console.error("❌ Failed to refresh data:", error);
      setError("Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  };

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    gradient,
    trend,
    onClick,
  }) => (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 text-white cursor-pointer transform transition-all duration-200 hover:scale-105 ${gradient}`}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-white/20">
            <Icon className="w-6 h-6" />
          </div>
          {trend !== undefined && (
            <div className="flex items-center space-x-1">
              {trend > 0 ? (
                <ArrowUp className="w-4 h-4 text-green-300" />
              ) : trend < 0 ? (
                <ArrowDown className="w-4 h-4 text-red-300" />
              ) : (
                <Minus className="w-4 h-4 text-gray-300" />
              )}
              <span className="text-sm font-medium">
                {trend > 0 ? "+" : ""}
                {trend}%
              </span>
            </div>
          )}
        </div>
        <div>
          <p className="text-sm opacity-90 mb-1">{title}</p>
          <p className="text-3xl font-bold mb-1">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          <p className="text-sm opacity-75">{subtitle}</p>
        </div>
      </div>
    </div>
  );

  const MetricCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "blue",
    priority,
  }) => {
    const getColorClasses = (color, priority) => {
      if (priority === "high") {
        return "bg-red-100 text-red-600 border-red-200";
      } else if (priority === "medium") {
        return "bg-yellow-100 text-yellow-600 border-yellow-200";
      }
      return `bg-${color}-100 text-${color}-600 border-${color}-200`;
    };

    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${getColorClasses(color, priority)}`}>
            <Icon className="w-6 h-6" />
          </div>
          {priority && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              priority === "high" ? "bg-red-100 text-red-600" :
              priority === "medium" ? "bg-yellow-100 text-yellow-600" :
              "bg-green-100 text-green-600"
            }`}>
              {priority.toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    );
  };

  const ActivityItem = ({ activity }) => {
    const getActivityIcon = (iconType) => {
      switch (iconType) {
        case "user-plus":
          return Users;
        case "building":
          return Building;
        case "package":
          return Package;
        case "message-square":
          return MessageSquare;
        case "check-circle":
          return CheckCircle;
        case "x-circle":
          return X;
        default:
          return Activity;
      }
    };

    const ActivityIcon = getActivityIcon(activity.icon);
    const timeAgo = new Date(activity.timestamp);
    const now = new Date();
    const diffHours = Math.floor((now - timeAgo) / (1000 * 60 * 60));

    return (
      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
        <div
          className={`p-2 rounded-lg ${
            activity.priority === "high"
              ? "bg-red-100 text-red-600"
              : activity.priority === "medium"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          <ActivityIcon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{activity.title}</p>
          <p className="text-xs text-gray-500">{activity.description}</p>
        </div>
        <span className="text-xs text-gray-400">
          {diffHours === 0 ? "Just now" : `${diffHours}h ago`}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }

  if (error && !coreKPIs) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => loadDashboardData()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
            <p className="text-purple-100">
              Comprehensive marketplace analytics and management
            </p>
            {coreKPIs?.generatedAt && (
              <p className="text-purple-200 text-sm mt-1">
                Last updated: {new Date(coreKPIs.generatedAt).toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="p-3 rounded-xl bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw
                className={`w-6 h-6 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && coreKPIs && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            <p className="text-yellow-800 text-sm">
              Some data may be outdated: {error}
            </p>
            <button
              onClick={refreshData}
              className="ml-auto text-yellow-600 hover:text-yellow-700 text-sm underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Core KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard
          title="Total Users"
          value={coreKPIs?.totalUsers?.value || 0}
          subtitle={`+${coreKPIs?.totalUsers?.thisMonth || 0} this month`}
          icon={Users}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Total Vendors"
          value={coreKPIs?.totalVendors?.value || 0}
          subtitle={`${coreKPIs?.totalVendors?.verificationRate || 0}% verified`}
          icon={Building}
          gradient="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Total Products"
          value={coreKPIs?.totalProducts?.value || 0}
          subtitle={`${coreKPIs?.totalProducts?.availabilityRate || 0}% in stock`}
          icon={Package}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
        <StatCard
          title="Total Inquiries"
          value={coreKPIs?.totalInquiries?.value || 0}
          subtitle={`${coreKPIs?.totalInquiries?.responseRate || 0}% response rate`}
          icon={MessageSquare}
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
        />
        <StatCard
          title="Platform Health"
          value={coreKPIs?.platformHealth?.status || "Good"}
          subtitle="All systems operational"
          icon={Zap}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
      </div>

      {/* Activity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Pending Verifications"
          value={activityMetrics?.pendingVerifications?.value || 0}
          subtitle="Require admin review"
          icon={Clock}
          color="yellow"
        />
        <MetricCard
          title="Open Inquiries"
          value={activityMetrics?.openInquiries?.value || 0}
          subtitle="Awaiting responses"
          icon={MessageSquare}
          color="blue"
        />
        <MetricCard
          title="Active Products"
          value={activityMetrics?.activeProducts?.value || 0}
          subtitle={`${activityMetrics?.activeProducts?.outOfStock || 0} out of stock`}
          icon={Package}
          color="green"
        />
        <MetricCard
          title="Verification Rate"
          value={`${activityMetrics?.verificationRate?.value || 0}%`}
          subtitle={`${activityMetrics?.verificationRate?.verified || 0} verified vendors`}
          icon={CheckCircle}
          color="emerald"
        />
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Recent Activities
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {recentActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No recent activities</p>
              </div>
            ) : (
              recentActivities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
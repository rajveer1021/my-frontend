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
  PieChart,
  Target,
  Zap,
  AlertCircle,
  Info,
  X,
} from "lucide-react";

// Import the admin service
import { adminService } from "../../services/adminService";

const AdminDashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [activities, setActivities] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔄 Loading dashboard data...");

      // Use the real admin service instead of mock data
      const dashboardData = await adminService.getAllDashboardData();

      if (dashboardData.kpis) {
        setKpis(dashboardData.kpis);
      } else {
        console.error("No KPIs data received");
        // Fallback to individual API calls if getAllDashboardData fails
        await loadIndividualData();
        return;
      }

      if (dashboardData.alerts) {
        setAlerts(dashboardData.alerts.alerts || []);
      }

      if (dashboardData.activities) {
        setActivities(dashboardData.activities.activities || []);
      }

      if (dashboardData.dailyStats) {
        setDailyStats(dashboardData.dailyStats.dailyStats || []);
      }

      console.log("✅ Dashboard data loaded successfully");
    } catch (error) {
      console.error("❌ Failed to load dashboard data:", error);
      setError(error.message || "Failed to load dashboard data");

      // Try to load with fallback mock data for development
      if (process.env.NODE_ENV === "development") {
        console.log("🔄 Loading fallback mock data...");
        await loadMockData();
      }
    } finally {
      setLoading(false);
    }
  };

  // Fallback to individual API calls
  const loadIndividualData = async () => {
    try {
      const [kpisRes, alertsRes, activitiesRes, dailyRes] =
        await Promise.allSettled([
          adminService.getDashboardKPIs(),
          adminService.getDashboardAlerts(),
          adminService.getRecentActivities(),
          adminService.getDailyStats(30),
        ]);

      if (kpisRes.status === "fulfilled") {
        setKpis(kpisRes.value);
      }

      if (alertsRes.status === "fulfilled") {
        setAlerts(alertsRes.value.alerts || []);
      }

      if (activitiesRes.status === "fulfilled") {
        setActivities(activitiesRes.value.activities || []);
      }

      if (dailyRes.status === "fulfilled") {
        setDailyStats(dailyRes.value.dailyStats || []);
      }
    } catch (error) {
      console.error("❌ Individual API calls failed:", error);
      throw error;
    }
  };

  // Load mock data as fallback for development
  const loadMockData = async () => {
    const mockKPIs = getMockKPIs();
    const mockAlertsData = getMockAlerts();
    const mockActivitiesData = getMockActivities();
    const mockDailyData = getMockDailyStats();

    setKpis(mockKPIs);
    setAlerts(mockAlertsData.alerts);
    setActivities(mockActivitiesData.activities);
    setDailyStats(mockDailyData.dailyStats);
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

  const dismissAlert = (alertId) => {
    setDismissedAlerts((prev) => new Set([...prev, alertId]));
  };

  // Mock data functions (fallback for development)
  const getMockKPIs = () => ({
    coreStats: {
      totalUsers: { value: 1247, growth: 12, weeklyGrowth: 23 },
      totalVendors: {
        value: 156,
        growth: 8,
        weeklyGrowth: 5,
        verificationRate: 78,
      },
      totalBuyers: { value: 1091, percentage: 87 },
      totalProducts: {
        value: 2340,
        growth: 15,
        weeklyGrowth: 18,
        availabilityRate: 92,
      },
      totalInquiries: {
        value: 892,
        growth: 22,
        weeklyGrowth: 12,
        responseRate: 85,
      },
    },
    verificationMetrics: {
      verified: 122,
      pending: 34,
      gstVerified: 89,
      manuallyVerified: 33,
      verificationRate: 78,
      pendingRate: 22,
    },
    activityMetrics: {
      activeProducts: 2156,
      outOfStockProducts: 184,
      openInquiries: 67,
      respondedInquiries: 456,
      closedInquiries: 369,
    },
    growthTrends: {
      users: { thisMonth: 134, lastMonth: 119, growth: 12 },
      vendors: { thisMonth: 23, lastMonth: 21, growth: 8 },
      products: { thisMonth: 287, lastMonth: 249, growth: 15 },
      inquiries: { thisMonth: 178, lastMonth: 146, growth: 22 },
    },
    distributions: {
      vendorTypes: [
        { type: "MANUFACTURER", count: 89, percentage: 57 },
        { type: "WHOLESALER", count: 45, percentage: 29 },
        { type: "RETAILER", count: 22, percentage: 14 },
      ],
      productCategories: [
        { category: "Electronics", count: 567, percentage: 24 },
        { category: "Fashion", count: 423, percentage: 18 },
        { category: "Home & Garden", count: 389, percentage: 17 },
      ],
    },
    insights: {
      platformHealth: {
        userGrowth: "growing",
        verificationHealth: "good",
        activityLevel: "active",
      },
    },
    generatedAt: new Date().toISOString(),
  });

  const getMockAlerts = () => ({
    alerts: [
      {
        id: "pending_verifications",
        type: "warning",
        title: "Pending Vendor Verifications",
        message: "34 vendors are waiting for verification",
        priority: "high",
      },
      {
        id: "high_open_inquiries",
        type: "info",
        title: "Open Inquiries",
        message: "67 inquiries need attention",
        priority: "medium",
      },
    ],
  });

  const getMockActivities = () => ({
    activities: [
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
    ],
  });

  const getMockDailyStats = () => ({
    dailyStats: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      users: Math.floor(Math.random() * 20) + 5,
      vendors: Math.floor(Math.random() * 5) + 1,
      products: Math.floor(Math.random() * 30) + 10,
      inquiries: Math.floor(Math.random() * 15) + 5,
    })),
  });

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

  const AlertCard = ({ alert }) => {
    if (dismissedAlerts.has(alert.id)) return null;

    const getAlertIcon = (type) => {
      switch (type) {
        case "error":
          return AlertCircle;
        case "warning":
          return AlertTriangle;
        case "info":
          return Info;
        default:
          return Bell;
      }
    };

    const getAlertColor = (type) => {
      switch (type) {
        case "error":
          return "border-red-200 bg-red-50 text-red-800";
        case "warning":
          return "border-yellow-200 bg-yellow-50 text-yellow-800";
        case "info":
          return "border-blue-200 bg-blue-50 text-blue-800";
        default:
          return "border-gray-200 bg-gray-50 text-gray-800";
      }
    };

    const AlertIcon = getAlertIcon(alert.type);

    return (
      <div
        className={`p-4 rounded-lg border ${getAlertColor(
          alert.type
        )} relative`}
      >
        <button
          onClick={() => dismissAlert(alert.id)}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-black/10"
        >
          <X className="w-4 h-4" />
        </button>
        <div className="flex items-start space-x-3">
          <AlertIcon className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-medium text-sm">{alert.title}</h4>
            <p className="text-sm opacity-90 mt-1">{alert.message}</p>
          </div>
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

  const MetricCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "blue",
  }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-${color}-100`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-600 mb-2">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !kpis) {
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
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Super Admin Dashboard</h1>
            <p className="text-purple-100">
              Comprehensive marketplace analytics and management
            </p>
            {kpis?.generatedAt && (
              <p className="text-purple-200 text-sm mt-1">
                Last updated: {new Date(kpis.generatedAt).toLocaleString()}
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
      {error && kpis && (
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

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            System Alerts (
            {alerts.filter((a) => !dismissedAlerts.has(a.id)).length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      )}

      {/* Core KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard
          title="Total Users"
          value={kpis?.coreStats?.totalUsers?.value || 0}
          subtitle={`+${
            kpis?.coreStats?.totalUsers?.weeklyGrowth || 0
          } this week`}
          icon={Users}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          trend={kpis?.coreStats?.totalUsers?.growth}
        />
        <StatCard
          title="Total Vendors"
          value={kpis?.coreStats?.totalVendors?.value || 0}
          subtitle={`${
            kpis?.coreStats?.totalVendors?.verificationRate || 0
          }% verified`}
          icon={Building}
          gradient="bg-gradient-to-br from-green-500 to-green-600"
          trend={kpis?.coreStats?.totalVendors?.growth}
        />
        <StatCard
          title="Total Products"
          value={kpis?.coreStats?.totalProducts?.value || 0}
          subtitle={`${
            kpis?.coreStats?.totalProducts?.availabilityRate || 0
          }% in stock`}
          icon={Package}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          trend={kpis?.coreStats?.totalProducts?.growth}
        />
        <StatCard
          title="Total Inquiries"
          value={kpis?.coreStats?.totalInquiries?.value || 0}
          subtitle={`${
            kpis?.coreStats?.totalInquiries?.responseRate || 0
          }% response rate`}
          icon={MessageSquare}
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
          trend={kpis?.coreStats?.totalInquiries?.growth}
        />
        <StatCard
          title="Platform Health"
          value={
            kpis?.insights?.platformHealth?.userGrowth === "growing"
              ? "Excellent"
              : "Good"
          }
          subtitle="All systems operational"
          icon={Zap}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Pending Verifications"
          value={kpis?.verificationMetrics?.pending || 0}
          subtitle="Require admin review"
          icon={AlertTriangle}
          color="yellow"
        />
        <MetricCard
          title="Open Inquiries"
          value={kpis?.activityMetrics?.openInquiries || 0}
          subtitle="Awaiting responses"
          icon={Clock}
          color="blue"
        />
        <MetricCard
          title="Active Products"
          value={kpis?.activityMetrics?.activeProducts || 0}
          subtitle="Currently available"
          icon={Target}
          color="green"
        />
        <MetricCard
          title="Verification Rate"
          value={`${kpis?.verificationMetrics?.verificationRate || 0}%`}
          subtitle="Vendor approval rate"
          icon={CheckCircle}
          color="emerald"
        />
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Recent Activities
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No recent activities</p>
                </div>
              ) : (
                activities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Distribution Charts */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Vendor Distribution
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {(kpis?.distributions?.vendorTypes || []).map((type) => (
                <div
                  key={type.type}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {type.type}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${type.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-8">
                      {type.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

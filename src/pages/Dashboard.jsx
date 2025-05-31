import React, { useState, useEffect } from 'react';
import { Package, MessageSquare, CheckCircle, Users } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { StockOverview } from '../components/dashboard/StockOverview';
import { RecentEnquiries } from '../components/dashboard/RecentEnquiries';
import { productService, enquiryService } from '../services/EnquiryService';

const Dashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    activeEnquiries: 0,
    profileStatus: 'Verified',
    monthlyVisitors: 1250
  });

  const [stockOverview, setStockOverview] = useState({
    inStock: 0,
    lowStock: 0,
    outOfStock: 0
  });

  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data concurrently
        const [productsData, inquiriesStats, recentInquiriesData] = await Promise.allSettled([
          productService.getProducts({ limit: 100 }), // Get all products for stats
          enquiryService.getInquiryStats(),
          enquiryService.getRecentInquiries()
        ]);

        // Handle products data
        if (productsData.status === 'fulfilled') {
          const products = productsData.value.products || [];
          
          // Calculate stock overview
          const stockStats = products.reduce((acc, product) => {
            const status = productService.getStockStatus(product.stock);
            if (status === 'Out of Stock') acc.outOfStock++;
            else if (status === 'Low Stock') acc.lowStock++;
            else acc.inStock++;
            return acc;
          }, { inStock: 0, lowStock: 0, outOfStock: 0 });

          setStockOverview(stockStats);
          setDashboardStats(prev => ({
            ...prev,
            totalProducts: products.length
          }));
        }

        // Handle inquiries stats
        if (inquiriesStats.status === 'fulfilled') {
          const stats = inquiriesStats.value;
          setDashboardStats(prev => ({
            ...prev,
            activeEnquiries: stats.pending || 0
          }));
        }

        // Handle recent inquiries
        if (recentInquiriesData.status === 'fulfilled') {
          setRecentEnquiries(recentInquiriesData.value || []);
        }

      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate trend values (mock implementation - you can enhance this)
  const calculateTrend = (current, previous = 0) => {
    if (previous === 0) return '+0%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(0)}%`;
  };

  if (error) {
    return (
      <div className="space-y-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-800">
            <h3 className="font-medium">Error loading dashboard</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, John!</h1>
        <p className="text-blue-100">Here's what's happening with your marketplace today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={loading ? '...' : dashboardStats.totalProducts}
          description="Active listings"
          icon={Package}
          trend="up"
          trendValue={calculateTrend(dashboardStats.totalProducts)}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        
        <StatCard
          title="Active Enquiries"
          value={loading ? '...' : dashboardStats.activeEnquiries}
          description="Pending responses"
          icon={MessageSquare}
          trend={dashboardStats.activeEnquiries > 0 ? "up" : "neutral"}
          trendValue={dashboardStats.activeEnquiries > 0 ? `${dashboardStats.activeEnquiries} new` : 'No new'}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        
        <StatCard
          title="Profile Status"
          value={dashboardStats.profileStatus}
          description="Profile complete"
          icon={CheckCircle}
          trend="up"
          trendValue="100%"
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        
        <StatCard
          title="Monthly Visitors"
          value={dashboardStats.monthlyVisitors.toLocaleString()}
          description="Unique visitors"
          icon={Users}
          trend="up"
          trendValue="+22%"
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Stock Overview and Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StockOverview stockData={stockOverview} loading={loading} />
        <RecentEnquiries 
          enquiries={recentEnquiries} 
          loading={loading}
          onRefresh={() => window.location.reload()}
        />
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Loading dashboard...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
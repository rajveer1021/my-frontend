import React from 'react';
import { Package, MessageSquare, CheckCircle, Users } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { StockOverview } from '../components/dashboard/StockOverview';
import { RecentEnquiries } from '../components/dashboard/RecentEnquiries';

const Dashboard = () => {
  // Mock data - replace with actual data from context/API
  const dashboardStats = {
    totalProducts: 3,
    activeEnquiries: 2,
    profileStatus: 'Verified',
    monthlyVisitors: 1250
  };

  const stockOverview = {
    inStock: 1,
    lowStock: 1,
    outOfStock: 1
  };

  const recentEnquiries = [
    {
      id: 1,
      name: 'Alice Johnson',
      message: "Hi, I'm interested in bulk purchasing of your Industrial Laptop Pro. Can you provide pricing for 50+ units?",
      date: '1/20/2024',
      isNew: true
    },
    {
      id: 2,
      name: 'Bob Smith',
      message: 'Does the Smart Sensor Module support LoRaWAN connectivity? We need it for our IoT infrastructure.',
      date: '1/19/2024',
      isNew: true
    }
  ];

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
          value={dashboardStats.totalProducts}
          description="Active listings"
          icon={Package}
          trend="up"
          trendValue="+12%"
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        
        <StatCard
          title="Active Enquiries"
          value={dashboardStats.activeEnquiries}
          description="Pending responses"
          icon={MessageSquare}
          trend="up"
          trendValue="+8%"
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
        <StockOverview stockData={stockOverview} />
        <RecentEnquiries enquiries={recentEnquiries} />
      </div>
    </div>
  );
};

export default Dashboard;
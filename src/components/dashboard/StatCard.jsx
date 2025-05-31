// src/components/dashboard/StatCard.jsx
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../utils/helpers';

export const StatCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  trendValue,
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-600'
}) => {
  const isPositiveTrend = trend === 'up';
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', iconBgColor)}>
            <Icon className={cn('w-6 h-6', iconColor)} />
          </div>
          {trendValue && (
            <div className={cn(
              'flex items-center text-sm font-medium',
              isPositiveTrend ? 'text-green-600' : 'text-red-600'
            )}>
              {isPositiveTrend ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {trendValue}
            </div>
          )}
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

// src/components/dashboard/StockOverview.jsx
import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

export const StockOverview = ({ stockData }) => {
  const stockItems = [
    {
      label: 'In Stock',
      value: stockData.inStock,
      percentage: '33.3% of total products',
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      label: 'Low Stock',
      value: stockData.lowStock,
      percentage: '33.3% of total products',
      icon: AlertTriangle,
      color: 'text-yellow-500'
    },
    {
      label: 'Out of Stock',
      value: stockData.outOfStock,
      percentage: '33.3% of total products',
      icon: XCircle,
      color: 'text-red-500'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className="mr-2">📦</span>
          Stock Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stockItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <item.icon className={`w-5 h-5 ${item.color}`} />
                <span className="font-medium text-gray-900">{item.label}</span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                <div className="text-sm text-gray-500">{item.percentage}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// src/components/dashboard/RecentEnquiries.jsx
import React from 'react';
import { MessageSquare, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { Badge } from '../ui/Badge';

export const RecentEnquiries = ({ enquiries }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Recent Enquiries
          </CardTitle>
          <Badge variant="default">
            {enquiries.filter(e => e.isNew).length} New
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {enquiries.map((enquiry) => (
            <div key={enquiry.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 flex items-center">
                      {enquiry.name}
                      {enquiry.isNew && (
                        <Badge variant="default" className="ml-2 text-xs">
                          new
                        </Badge>
                      )}
                    </h4>
                    <p className="text-sm text-gray-500">{enquiry.date}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Reply
                </Button>
              </div>
              <p className="text-gray-700 text-sm">{enquiry.message}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// src/pages/Dashboard.jsx
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
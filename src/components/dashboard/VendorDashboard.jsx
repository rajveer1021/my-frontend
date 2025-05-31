import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Progress } from '../ui/Progress';
import { Package, CheckCircle, AlertCircle, Mail, TrendingUp, Users, ShieldCheck } from 'lucide-react';
import { mockProducts, mockEnquiries, getStoredData } from '../../services/mockData';

const VendorDashboard = () => {
  const products = getStoredData('products', mockProducts);
  const enquiries = getStoredData('enquiries', mockEnquiries);

  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.stockStatus === 'in-stock').length;
  const outOfStockProducts = products.filter(p => p.stockStatus === 'out-of-stock').length;
  const lowStockProducts = products.filter(p => p.stockStatus === 'low-stock').length;

  const newEnquiries = enquiries.filter(e => e.status === 'new').length;

  const kpiCards = [
    {
      title: 'Total Products',
      value: totalProducts,
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Active listings'
    },
    {
      title: 'Active Enquiries',
      value: newEnquiries,
      change: '+8%',
      trend: 'up',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      description: 'Pending responses'
    },
    {
      title: 'Profile Status',
      value: 'Verified',
      change: '100%',
      trend: 'up',
      icon: ShieldCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Profile complete'
    }
  ];

  const stockCards = [
    {
      title: 'In Stock',
      value: inStockProducts,
      percentage: totalProducts > 0 ? (inStockProducts / totalProducts) * 100 : 0,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Low Stock',
      value: lowStockProducts,
      percentage: totalProducts > 0 ? (lowStockProducts / totalProducts) * 100 : 0,
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Out of Stock',
      value: outOfStockProducts,
      percentage: totalProducts > 0 ? (outOfStockProducts / totalProducts) * 100 : 0,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6 rounded-lg">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Welcome back, John!</h1>
        <p className="text-blue-100 text-sm sm:text-base">Here's what's happening with your marketplace today.</p>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 sm:p-3 rounded-full ${kpi.bgColor}`}>
                  <kpi.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${kpi.color}`} />
                </div>
                <div className={`flex items-center text-xs sm:text-sm ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {kpi.change}
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">
                  {kpi.title}
                </p>
                <p className="text-2xl sm:text-3xl font-bold mb-1">{kpi.value}</p>
                <p className="text-xs text-gray-500">{kpi.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stock Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Stock Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {stockCards.map((stock, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-full ${stock.bgColor}`}>
                      <stock.icon className={`h-4 w-4 ${stock.color}`} />
                    </div>
                    <span className="font-medium text-sm sm:text-base">{stock.title}</span>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold">{stock.value}</span>
                </div>
                <Progress value={stock.percentage} className="h-2" />
                <p className="text-xs text-gray-500">
                  {stock.percentage.toFixed(1)}% of total products
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Enquiries */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <CardTitle className="text-lg sm:text-xl">Recent Enquiries</CardTitle>
            <Badge variant="secondary" className="w-fit">{newEnquiries} New</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {enquiries.slice(0, 5).map((enquiry) => (
              <div 
                key={enquiry.id}
                className="flex flex-col sm:flex-row sm:items-start sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors space-y-3 sm:space-y-0"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mb-1">
                    <h4 className="font-semibold text-sm sm:text-base">{enquiry.buyerName}</h4>
                    {enquiry.status === 'new' && (
                      <Badge variant="default" className="text-xs bg-green-100 text-green-800 w-fit">
                        new
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2 sm:line-clamp-none">
                    {enquiry.message}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(enquiry.date).toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open(`mailto:${enquiry.buyerEmail}?subject=Re: Product Enquiry`)}
                  className="w-full sm:w-auto"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Reply
                </Button>
              </div>
            ))}
            
            {enquiries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Mail className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm sm:text-base">No enquiries yet</p>
                <p className="text-xs sm:text-sm">Enquiries from buyers will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDashboard;
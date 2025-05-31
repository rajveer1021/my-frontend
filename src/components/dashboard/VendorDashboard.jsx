// src/components/dashboard/VendorDashboard.jsx - Updated with real API data
import React, { useEffect, useState } from 'react';
import { Package, MessageSquare, CheckCircle, Users, TrendingUp, ShoppingCart } from 'lucide-react';
import { StatCard } from '../dashboard/StatCard';
import { StockOverview } from '../dashboard/StockOverview';
import { RecentEnquiries } from '../dashboard/RecentEnquiries';
import { useProducts } from '../../contexts/ProductContext';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

const VendorDashboard = () => {
  const { products, fetchProducts, loading } = useProducts();
  const { user } = useAuth();
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Load products on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setDashboardLoading(true);
        await fetchProducts({ limit: 100 }); // Get all products for dashboard stats
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setDashboardLoading(false);
      }
    };

    loadDashboardData();
  }, [fetchProducts]);

  // Calculate dashboard statistics from products
  const calculateStats = () => {
    if (!products || products.length === 0) {
      return {
        totalProducts: 0,
        inStock: 0,
        lowStock: 0,
        outOfStock: 0,
        totalValue: 0,
        activeProducts: 0
      };
    }

    const stats = products.reduce((acc, product) => {
      acc.totalProducts += 1;
      
      // Calculate stock status
      if (product.stock === 0) {
        acc.outOfStock += 1;
      } else if (product.stock <= 10) {
        acc.lowStock += 1;
      } else {
        acc.inStock += 1;
      }

      // Calculate total inventory value
      acc.totalValue += (product.price * product.stock);

      // Count active products
      if (product.isActive) {
        acc.activeProducts += 1;
      }

      return acc;
    }, {
      totalProducts: 0,
      inStock: 0,
      lowStock: 0,
      outOfStock: 0,
      totalValue: 0,
      activeProducts: 0
    });

    return stats;
  };

  const stats = calculateStats();

  // Mock enquiries data (you can replace this with real API data later)
  const recentEnquiries = [
    {
      id: 1,
      buyerName: 'Alice Johnson',
      buyerEmail: 'alice.johnson@techcorp.com',
      message: "Hi, I'm interested in bulk purchasing. Can you provide pricing for 50+ units?",
      date: new Date().toLocaleDateString(),
      status: 'new'
    },
    {
      id: 2,
      buyerName: 'Bob Smith', 
      buyerEmail: 'bob.smith@automation.com',
      message: 'Do you have technical specifications available for your products?',
      date: new Date(Date.now() - 86400000).toLocaleDateString(), // Yesterday
      status: 'new'
    }
  ];

  if (dashboardLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName || user?.fullName?.split(' ')[0] || 'Vendor'}!
        </h1>
        <p className="text-blue-100">Here's what's happening with your marketplace today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          description="Listed products"
          icon={Package}
          trend="up"
          trendValue={stats.activeProducts > 0 ? `${stats.activeProducts} active` : "No products"}
          gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
          delay={0}
        />
        
        <StatCard
          title="Inventory Value"
          value={`₹${stats.totalValue.toLocaleString()}`}
          description="Total stock value"
          icon={TrendingUp}
          trend="up"
          trendValue={stats.totalValue > 0 ? "Growing" : "Start selling"}
          gradient="bg-gradient-to-br from-green-500 to-emerald-600"
          delay={100}
        />
        
        <StatCard
          title="Active Enquiries"
          value={recentEnquiries.length}
          description="Pending responses"
          icon={MessageSquare}
          trend="up"
          trendValue={`${recentEnquiries.filter(e => e.status === 'new').length} new`}
          gradient="bg-gradient-to-br from-purple-500 to-violet-600"
          delay={200}
        />
        
        <StatCard
          title="Profile Status"
          value="Verified"
          description="Account verified"
          icon={CheckCircle}
          trend="up"
          trendValue="100% complete"
          gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
          delay={300}
        />
      </div>

      {/* Stock Overview and Recent Enquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StockOverview stockData={{
          inStock: stats.inStock,
          lowStock: stats.lowStock,
          outOfStock: stats.outOfStock
        }} />
        <RecentEnquiries enquiries={recentEnquiries} />
      </div>

      {/* Quick Actions */}
      {stats.totalProducts === 0 && (
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
                onClick={() => window.location.href = '/add-product'}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium"
              >
                <Package className="w-4 h-4 mr-2 inline" />
                Add Your First Product
              </button>
              <button
                onClick={() => window.location.href = '/products'}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium"
              >
                View Products
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Products */}
      {stats.totalProducts > 0 && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center">
                <Package className="w-5 h-5 lg:w-6 lg:h-6 mr-3 text-blue-600" />
                Recent Products
              </h2>
              <button
                onClick={() => window.location.href = '/products'}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
              >
                View All Products
              </button>
            </div>
          </div>
          
          <div className="p-4 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 6).map((product, index) => (
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
                        e.target.src = 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{product.name}</h4>
                      <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-medium text-gray-900">₹{product.price}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          product.status === 'In Stock' ? 'bg-green-100 text-green-800' :
                          product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
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
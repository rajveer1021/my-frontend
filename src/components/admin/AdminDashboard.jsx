// src/components/admin/AdminDashboard.jsx - Complete file
import React, { useState, useEffect } from 'react';
import {
  Users,
  Package,
  MessageSquare,
  TrendingUp,
  Shield,
  CheckCircle,
  AlertTriangle,
  Settings,
  BarChart3,
  UserCheck,
  Building,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Activity,
  Clock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useToast } from '../ui/Toast';
import { apiService } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVendors: 0,
    totalProducts: 0,
    totalInquiries: 0,
    verifiedVendors: 0,
    pendingVendors: 0
  });
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { addToast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, vendorsRes, productsRes] = await Promise.all([
        apiService.get('/admin/dashboard/stats'),
        apiService.get('/admin/users?limit=10'),
        apiService.get('/admin/vendors/submissions?limit=10'),
        apiService.get('/admin/products?limit=10')
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setVendors(vendorsRes.data.vendors);
      setProducts(productsRes.data.products);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      addToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyVendor = async (vendorId, verified) => {
    try {
      await apiService.put(`/admin/vendors/${vendorId}/verify`, { verified });
      addToast(`Vendor ${verified ? 'verified' : 'unverified'} successfully`, 'success');
      loadDashboardData();
    } catch (error) {
      addToast('Failed to update vendor verification', 'error');
    }
  };

  const StatCard = ({ title, value, description, icon: Icon, gradient, trend }) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 text-white ${gradient}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-white/20">
            <Icon className="w-6 h-6" />
          </div>
          {trend && (
            <Badge className="bg-white/20 text-white border-white/30">
              {trend}
            </Badge>
          )}
        </div>
        <div>
          <p className="text-sm opacity-90 mb-1">{title}</p>
          <p className="text-3xl font-bold mb-1">{value}</p>
          <p className="text-sm opacity-75">{description}</p>
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Loading admin dashboard..." />
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
            <p className="text-purple-100">Manage your multi-vendor marketplace</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          description="All registered users"
          icon={Users}
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          trend="+12%"
        />
        <StatCard
          title="Total Vendors"
          value={stats.totalVendors}
          description="Vendor accounts"
          icon={Building}
          gradient="bg-gradient-to-br from-green-500 to-green-600"
          trend="+8%"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          description="Listed products"
          icon={Package}
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          trend="+15%"
        />
        <StatCard
          title="Verified Vendors"
          value={stats.verifiedVendors}
          description="Approved vendors"
          icon={CheckCircle}
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingVendors}
          description="Awaiting verification"
          icon={AlertTriangle}
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
        />
        <StatCard
          title="Total Inquiries"
          value={stats.totalInquiries}
          description="All inquiries"
          icon={MessageSquare}
          gradient="bg-gradient-to-br from-cyan-500 to-cyan-600"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex space-x-1">
            <TabButton
              id="overview"
              label="Overview"
              icon={BarChart3}
              isActive={activeTab === 'overview'}
              onClick={setActiveTab}
            />
            <TabButton
              id="users"
              label="Users"
              icon={Users}
              isActive={activeTab === 'users'}
              onClick={setActiveTab}
            />
            <TabButton
              id="vendors"
              label="Vendors"
              icon={Building}
              isActive={activeTab === 'vendors'}
              onClick={setActiveTab}
            />
            <TabButton
              id="products"
              label="Products"
              icon={Package}
              isActive={activeTab === 'products'}
              onClick={setActiveTab}
            />
          </div>
        </div>

        <div className="p-6">
          {/* Search and Filter */}
          {activeTab !== 'overview' && (
            <div className="mb-6 flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All</option>
                {activeTab === 'users' && (
                  <>
                    <option value="BUYER">Buyers</option>
                    <option value="VENDOR">Vendors</option>
                    <option value="ADMIN">Admins</option>
                  </>
                )}
                {activeTab === 'vendors' && (
                  <>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                  </>
                )}
              </select>
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Activity className="w-5 h-5 mr-2" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm">5 new vendor registrations</span>
                        <Badge variant="secondary" className="ml-auto text-xs">Today</Badge>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="text-sm">12 new products listed</span>
                        <Badge variant="secondary" className="ml-auto text-xs">Today</Badge>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-sm">8 vendor verifications pending</span>
                        <Badge variant="warning" className="ml-auto text-xs">Action Required</Badge>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span className="text-sm">23 new inquiries received</span>
                        <Badge variant="secondary" className="ml-auto text-xs">This Week</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button 
                        className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                        onClick={() => setActiveTab('vendors')}
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Review Pending Vendors ({stats.pendingVendors})
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab('products')}
                      >
                        <Package className="w-4 h-4 mr-2" />
                        Moderate Products ({stats.totalProducts})
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab('users')}
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Manage Users ({stats.totalUsers})
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        System Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Statistics Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Platform Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
                      <div className="text-sm text-gray-500">Total Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.verifiedVendors}</div>
                      <div className="text-sm text-gray-500">Verified Vendors</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{stats.totalProducts}</div>
                      <div className="text-sm text-gray-500">Active Products</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{stats.totalInquiries}</div>
                      <div className="text-sm text-gray-500">Total Inquiries</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No users found</p>
                </div>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{user.firstName} {user.lastName}</h4>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={
                          user.accountType === 'ADMIN' ? 'destructive' : 
                          user.accountType === 'VENDOR' ? 'default' : 'secondary'
                        }
                      >
                        {user.accountType}
                      </Badge>
                      {user.vendor && (
                        <Badge variant={user.vendor.verified ? 'success' : 'warning'}>
                          {user.vendor.verified ? 'Verified' : 'Pending'}
                        </Badge>
                      )}
                      <span className="text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Vendors Tab */}
          {activeTab === 'vendors' && (
            <div className="space-y-4">
              {vendors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Building className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No vendors found</p>
                </div>
              ) : (
                vendors.map((vendor) => (
                  <div key={vendor.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                        {vendor.user.firstName.charAt(0)}{vendor.user.lastName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{vendor.businessName || `${vendor.user.firstName} ${vendor.user.lastName}`}</h4>
                        <p className="text-sm text-gray-500">{vendor.user.email}</p>
                        {vendor.vendorType && (
                          <p className="text-xs text-blue-600">{vendor.vendorType}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={vendor.verified ? 'success' : 'warning'}>
                        {vendor.verified ? 'Verified' : 'Pending'}
                      </Badge>
                      {!vendor.verified && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleVerifyVendor(vendor.id, true)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verify
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerifyVendor(vendor.id, false)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              {products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No products found</p>
                </div>
              ) : (
                products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <img
                        src={product.images[0] || 'https://via.placeholder.com/40'}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                      />
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-500">
                          by {product.vendor.user.firstName} {product.vendor.user.lastName}
                        </p>
                        <p className="text-xs text-blue-600">{product.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">₹{product.price}</span>
                      <Badge variant={product.isActive ? 'success' : 'secondary'}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
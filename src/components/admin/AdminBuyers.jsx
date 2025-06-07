// src/components/admin/AdminBuyers.jsx
import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Users,
  Ban,
  UserCheck,
  MoreVertical,
  Eye,
  Mail,
  Calendar,
  Activity,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useToast } from '../ui/Toast';
import { apiService } from '../../services/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu';
import { AdminSearchAndFilter } from '../common/AdminSearchAndFilter';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/Dialog';

const AdminBuyers = () => {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    registrationDate: 'all',
    activity: 'all'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { addToast } = useToast();

  const availableFilters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'blocked', label: 'Blocked' },
        { value: 'suspended', label: 'Suspended' }
      ]
    },
    {
      key: 'registrationDate',
      label: 'Registration',
      options: [
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'quarter', label: 'This Quarter' }
      ]
    },
    {
      key: 'activity',
      label: 'Activity Level',
      options: [
        { value: 'high', label: 'High Activity' },
        { value: 'medium', label: 'Medium Activity' },
        { value: 'low', label: 'Low Activity' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ];

  useEffect(() => {
    loadBuyers();
  }, [pagination.page, searchTerm, filters]);

  const loadBuyers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        accountType: 'BUYER',
        ...(searchTerm && { search: searchTerm }),
        ...Object.entries(filters).reduce((acc, [key, value]) => {
          if (value && value !== 'all') {
            acc[key] = value;
          }
          return acc;
        }, {})
      };

      const response = await apiService.get('/admin/users', params);
      
      if (response.success && response.data) {
        setBuyers(response.data.users);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to load buyers:', error);
      addToast('Failed to load buyers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockBuyer = async (buyerId, block = true) => {
    try {
      setActionLoading(prev => ({ ...prev, [buyerId]: true }));
      
      const response = await apiService.put(`/admin/users/${buyerId}/status`, {
        status: block ? 'blocked' : 'active'
      });

      if (response.success) {
        setBuyers(prev => 
          prev.map(buyer => 
            buyer.id === buyerId 
              ? { ...buyer, status: block ? 'blocked' : 'active' }
              : buyer
          )
        );
        addToast(
          `Buyer ${block ? 'blocked' : 'unblocked'} successfully`, 
          'success'
        );
      }
    } catch (error) {
      addToast(`Failed to ${block ? 'block' : 'unblock'} buyer`, 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [buyerId]: false }));
    }
  };

  const handleDeleteBuyer = async (buyerId) => {
    if (!confirm('Are you sure you want to permanently delete this buyer account? This action cannot be undone.')) {
      return;
    }

    try {
      setActionLoading(prev => ({ ...prev, [buyerId]: true }));
      
      const response = await apiService.delete(`/admin/users/${buyerId}`);

      if (response.success) {
        setBuyers(prev => prev.filter(buyer => buyer.id !== buyerId));
        addToast('Buyer account deleted successfully', 'success');
        setPagination(prev => ({ ...prev, total: prev.total - 1 }));
      }
    } catch (error) {
      addToast('Failed to delete buyer account', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [buyerId]: false }));
    }
  };

  const handleViewDetails = (buyer) => {
    setSelectedBuyer(buyer);
    setIsDetailModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'blocked':
        return <Badge className="bg-red-100 text-red-800">Blocked</Badge>;
      case 'suspended':
        return <Badge className="bg-yellow-100 text-yellow-800">Suspended</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status || 'Active'}</Badge>;
    }
  };

  const getActivityLevel = (lastLogin) => {
    if (!lastLogin) return 'Never logged in';
    
    const daysSinceLogin = Math.floor(
      (new Date() - new Date(lastLogin)) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceLogin <= 1) return 'Very Active';
    if (daysSinceLogin <= 7) return 'Active';
    if (daysSinceLogin <= 30) return 'Moderate';
    if (daysSinceLogin <= 90) return 'Low';
    return 'Inactive';
  };

  const getActivityBadge = (lastLogin) => {
    const activity = getActivityLevel(lastLogin);
    const daysSinceLogin = lastLogin ? 
      Math.floor((new Date() - new Date(lastLogin)) / (1000 * 60 * 60 * 24)) : null;
    
    if (daysSinceLogin === null) {
      return <Badge className="bg-gray-100 text-gray-800">Never Active</Badge>;
    } else if (daysSinceLogin <= 1) {
      return <Badge className="bg-green-100 text-green-800">Very Active</Badge>;
    } else if (daysSinceLogin <= 7) {
      return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
    } else if (daysSinceLogin <= 30) {
      return <Badge className="bg-yellow-100 text-yellow-800">Moderate</Badge>;
    } else if (daysSinceLogin <= 90) {
      return <Badge className="bg-orange-100 text-orange-800">Low</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
    }
  };

  const BuyerRow = ({ buyer }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-semibold">
            {(buyer.firstName?.charAt(0) || 'B').toUpperCase()}
            {(buyer.lastName?.charAt(0) || '').toUpperCase()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-gray-900 truncate">
                {buyer.firstName} {buyer.lastName}
              </h4>
              {getStatusBadge(buyer.status)}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-1">
              <span className="flex items-center">
                <Mail className="w-3 h-3 mr-1" />
                {buyer.email}
              </span>
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                Joined: {new Date(buyer.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span className="flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                Last login: {buyer.lastLogin ? 
                  new Date(buyer.lastLogin).toLocaleDateString() : 
                  'Never'
                }
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {getActivityBadge(buyer.lastLogin)}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                disabled={actionLoading[buyer.id]}
              >
                {actionLoading[buyer.id] ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <MoreVertical className="w-4 h-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetails(buyer)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              
              {buyer.status !== 'blocked' ? (
                <DropdownMenuItem 
                  onClick={() => handleBlockBuyer(buyer.id, true)}
                  className="text-red-600"
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Block Buyer
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onClick={() => handleBlockBuyer(buyer.id, false)}
                  className="text-green-600"
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Unblock Buyer
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem 
                onClick={() => handleDeleteBuyer(buyer.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-pink-600 to-red-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Buyer Management</h1>
            <p className="text-orange-100">Manage all buyer accounts and their activity</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{pagination.total}</div>
            <div className="text-orange-100 text-sm">Total Buyers</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">
              {buyers.filter(b => b.status === 'active' || !b.status).length}
            </div>
            <div className="text-orange-100 text-sm">Active</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">
              {buyers.filter(b => b.status === 'blocked').length}
            </div>
            <div className="text-orange-100 text-sm">Blocked</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">
              {buyers.filter(b => b.lastLogin && 
                Math.floor((new Date() - new Date(b.lastLogin)) / (1000 * 60 * 60 * 24)) <= 7
              ).length}
            </div>
            <div className="text-orange-100 text-sm">Active This Week</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <AdminSearchAndFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        availableFilters={availableFilters}
        onClearFilters={() => {
          setSearchTerm('');
          setFilters({ status: 'all', registrationDate: 'all', activity: 'all' });
        }}
        loading={loading}
        placeholder="Search buyers by name, email..."
        showRefresh={true}
        onRefresh={loadBuyers}
      />

      {/* Buyers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Buyers ({pagination.total})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" text="Loading buyers..." />
            </div>
          ) : buyers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No buyers found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {buyers.map((buyer) => (
                <BuyerRow key={buyer.id} buyer={buyer} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex items-center text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} buyers
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1 || loading}
                  className="text-sm"
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const page = i + 1;
                    const isActive = page === pagination.page;

                    return (
                      <button
                        key={page}
                        onClick={() => setPagination(prev => ({ ...prev, page }))}
                        disabled={loading}
                        className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                          isActive
                            ? "bg-orange-600 text-white"
                            : "text-gray-500 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages || loading}
                  className="text-sm"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Buyer Details Modal */}
      {selectedBuyer && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Buyer Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">First Name</label>
                  <p className="text-gray-900">{selectedBuyer.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Name</label>
                  <p className="text-gray-900">{selectedBuyer.lastName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{selectedBuyer.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Account Type</label>
                  <p className="text-gray-900">{selectedBuyer.accountType}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedBuyer.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Activity Level</label>
                  <div className="mt-1">{getActivityBadge(selectedBuyer.lastLogin)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Registration Date</label>
                  <p className="text-gray-900">
                    {new Date(selectedBuyer.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Login</label>
                  <p className="text-gray-900">
                    {selectedBuyer.lastLogin ? 
                      new Date(selectedBuyer.lastLogin).toLocaleDateString() : 
                      'Never logged in'
                    }
                  </p>
                </div>
              </div>

              {selectedBuyer.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900">{selectedBuyer.phone}</p>
                </div>
              )}

              {selectedBuyer.address && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-900">{selectedBuyer.address}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email Verified</label>
                  <p className="text-gray-900">
                    {selectedBuyer.emailVerified ? 
                      <span className="text-green-600">Yes</span> : 
                      <span className="text-red-600">No</span>
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Google Account</label>
                  <p className="text-gray-900">
                    {selectedBuyer.googleId ? 
                      <span className="text-blue-600">Yes</span> : 
                      <span className="text-gray-600">No</span>
                    }
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                {selectedBuyer.status !== 'blocked' ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleBlockBuyer(selectedBuyer.id, true);
                      setIsDetailModalOpen(false);
                    }}
                    disabled={actionLoading[selectedBuyer.id]}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    Block Buyer
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleBlockBuyer(selectedBuyer.id, false);
                      setIsDetailModalOpen(false);
                    }}
                    disabled={actionLoading[selectedBuyer.id]}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Unblock Buyer
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={() => {
                    handleDeleteBuyer(selectedBuyer.id);
                    setIsDetailModalOpen(false);
                  }}
                  disabled={actionLoading[selectedBuyer.id]}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminBuyers;
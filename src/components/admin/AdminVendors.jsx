// src/components/admin/AdminVendors.jsx
import React, { useState, useEffect } from 'react';
import {
  Building,
  Shield,
  CheckCircle,
  XCircle,
  MoreVertical,
  Eye,
  Ban,
  UserCheck,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
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

const AdminVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    verified: 'all',
    type: 'all'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { addToast } = useToast();

  const availableFilters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'blocked', label: 'Blocked' },
        { value: 'pending', label: 'Pending' }
      ]
    },
    {
      key: 'verified',
      label: 'Verification',
      options: [
        { value: 'verified', label: 'Verified' },
        { value: 'unverified', label: 'Unverified' }
      ]
    },
    {
      key: 'type',
      label: 'Vendor Type',
      options: [
        { value: 'MANUFACTURER', label: 'Manufacturer' },
        { value: 'WHOLESALER', label: 'Wholesaler' },
        { value: 'RETAILER', label: 'Retailer' }
      ]
    }
  ];

  useEffect(() => {
    loadVendors();
  }, [pagination.page, searchTerm, filters]);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(searchTerm && { search: searchTerm }),
        ...Object.entries(filters).reduce((acc, [key, value]) => {
          if (value && value !== 'all') {
            acc[key] = value;
          }
          return acc;
        }, {})
      };

      const response = await apiService.get('/admin/vendors', params);
      
      if (response.success && response.data) {
        setVendors(response.data.vendors);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to load vendors:', error);
      addToast('Failed to load vendors', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockVendor = async (vendorId, block = true) => {
    try {
      setActionLoading(prev => ({ ...prev, [vendorId]: true }));
      
      const response = await apiService.put(`/admin/vendors/${vendorId}/status`, {
        status: block ? 'blocked' : 'active'
      });

      if (response.success) {
        setVendors(prev => 
          prev.map(vendor => 
            vendor.id === vendorId 
              ? { ...vendor, status: block ? 'blocked' : 'active' }
              : vendor
          )
        );
        addToast(
          `Vendor ${block ? 'blocked' : 'unblocked'} successfully`, 
          'success'
        );
      }
    } catch (error) {
      addToast(`Failed to ${block ? 'block' : 'unblock'} vendor`, 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [vendorId]: false }));
    }
  };

  const handleVerifyVendor = async (vendorId, verify = true) => {
    try {
      setActionLoading(prev => ({ ...prev, [vendorId]: true }));
      
      const response = await apiService.put(`/admin/vendors/${vendorId}/verify`, {
        verified: verify
      });

      if (response.success) {
        setVendors(prev => 
          prev.map(vendor => 
            vendor.id === vendorId 
              ? { ...vendor, verified: verify }
              : vendor
          )
        );
        addToast(
          `Vendor ${verify ? 'verified' : 'unverified'} successfully`, 
          'success'
        );
      }
    } catch (error) {
      addToast(`Failed to ${verify ? 'verify' : 'unverify'} vendor`, 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [vendorId]: false }));
    }
  };

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
    setIsDetailModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'blocked':
        return <Badge className="bg-red-100 text-red-800">Blocked</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getVerificationBadge = (verified) => {
    return verified ? (
      <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Verified
      </Badge>
    ) : (
      <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Unverified
      </Badge>
    );
  };

  const VendorRow = ({ vendor }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {(vendor.user?.firstName?.charAt(0) || 'V').toUpperCase()}
            {(vendor.user?.lastName?.charAt(0) || '').toUpperCase()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-gray-900 truncate">
                {vendor.businessName || `${vendor.user?.firstName} ${vendor.user?.lastName}`}
              </h4>
              {getVerificationBadge(vendor.verified)}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center">
                <Mail className="w-3 h-3 mr-1" />
                {vendor.user?.email}
              </span>
              {vendor.vendorType && (
                <span className="flex items-center">
                  <Building className="w-3 h-3 mr-1" />
                  {vendor.vendorType}
                </span>
              )}
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(vendor.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            {vendor.city && vendor.state && (
              <div className="flex items-center text-xs text-gray-400 mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                {vendor.city}, {vendor.state}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {getStatusBadge(vendor.status || 'active')}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                disabled={actionLoading[vendor.id]}
              >
                {actionLoading[vendor.id] ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <MoreVertical className="w-4 h-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetails(vendor)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              
              {!vendor.verified && (
                <DropdownMenuItem 
                  onClick={() => handleVerifyVendor(vendor.id, true)}
                  className="text-blue-600"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Verify Vendor
                </DropdownMenuItem>
              )}
              
              {vendor.verified && (
                <DropdownMenuItem 
                  onClick={() => handleVerifyVendor(vendor.id, false)}
                  className="text-orange-600"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Remove Verification
                </DropdownMenuItem>
              )}
              
              {vendor.status !== 'blocked' ? (
                <DropdownMenuItem 
                  onClick={() => handleBlockVendor(vendor.id, true)}
                  className="text-red-600"
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Block Vendor
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  onClick={() => handleBlockVendor(vendor.id, false)}
                  className="text-green-600"
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Unblock Vendor
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Vendor Management</h1>
            <p className="text-blue-100">Manage all vendors and their accounts</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Building className="w-6 h-6" />
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{pagination.total}</div>
            <div className="text-blue-100 text-sm">Total Vendors</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">
              {vendors.filter(v => v.verified).length}
            </div>
            <div className="text-blue-100 text-sm">Verified</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">
              {vendors.filter(v => v.status === 'active').length}
            </div>
            <div className="text-blue-100 text-sm">Active</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">
              {vendors.filter(v => v.status === 'blocked').length}
            </div>
            <div className="text-blue-100 text-sm">Blocked</div>
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
          setFilters({ status: 'all', verified: 'all', type: 'all' });
        }}
        loading={loading}
        placeholder="Search vendors by name, email, or business..."
        showRefresh={true}
        onRefresh={loadVendors}
      />

      {/* Vendors List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Vendors ({pagination.total})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" text="Loading vendors..." />
            </div>
          ) : vendors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Building className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No vendors found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {vendors.map((vendor) => (
                <VendorRow key={vendor.id} vendor={vendor} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex items-center text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} vendors
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
                            ? "bg-blue-600 text-white"
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

      {/* Vendor Details Modal */}
      {selectedVendor && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Vendor Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Business Name</label>
                  <p className="text-gray-900">{selectedVendor.businessName || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Vendor Type</label>
                  <p className="text-gray-900">{selectedVendor.vendorType || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Owner Name</label>
                  <p className="text-gray-900">
                    {selectedVendor.user?.firstName} {selectedVendor.user?.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900">{selectedVendor.user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedVendor.status || 'active')}</div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Verification</label>
                  <div className="mt-1">{getVerificationBadge(selectedVendor.verified)}</div>
                </div>
              </div>
              
              {selectedVendor.businessAddress1 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Address</label>
                  <p className="text-gray-900">
                    {selectedVendor.businessAddress1}
                    {selectedVendor.businessAddress2 && `, ${selectedVendor.businessAddress2}`}
                    {selectedVendor.city && `, ${selectedVendor.city}`}
                    {selectedVendor.state && `, ${selectedVendor.state}`}
                    {selectedVendor.postalCode && ` - ${selectedVendor.postalCode}`}
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Registration Date</label>
                  <p className="text-gray-900">
                    {new Date(selectedVendor.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-gray-900">
                    {new Date(selectedVendor.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminVendors;
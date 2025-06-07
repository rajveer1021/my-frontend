// src/components/admin/AdminProfileVerification.jsx
import React, { useState, useEffect } from 'react';
import {
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  User,
  Building,
  MapPin,
  Calendar,
  AlertTriangle,
  Download,
  Clock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { Badge } from '../ui/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useToast } from '../ui/Toast';
import { apiService } from '../../services/api';
import { AdminSearchAndFilter } from '../common/AdminSearchAndFilter';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/Dialog';

const AdminProfileVerification = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    verificationType: 'all',
    vendorType: 'all'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const { addToast } = useToast();

  const availableFilters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'pending', label: 'Pending Review' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' }
      ]
    },
    {
      key: 'verificationType',
      label: 'Verification Type',
      options: [
        { value: 'gst', label: 'GST Verification' },
        { value: 'manual', label: 'Manual Verification' }
      ]
    },
    {
      key: 'vendorType',
      label: 'Vendor Type',
      options: [
        { value: 'MANUFACTURER', label: 'Manufacturer' },
        { value: 'WHOLESALER', label: 'Wholesaler' },
        { value: 'RETAILER', label: 'Retailer' }
      ]
    }
  ];

  useEffect(() => {
    loadSubmissions();
  }, [pagination.page, searchTerm, filters]);

  const loadSubmissions = async () => {
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

      const response = await apiService.get('/admin/vendor-submissions', params);
      
      if (response.success && response.data) {
        setSubmissions(response.data.submissions);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Failed to load submissions:', error);
      addToast('Failed to load verification submissions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSubmission = async (submissionId) => {
    try {
      setActionLoading(prev => ({ ...prev, [submissionId]: true }));
      
      const response = await apiService.put(`/admin/vendor-submissions/${submissionId}/approve`);

      if (response.success) {
        setSubmissions(prev => 
          prev.map(submission => 
            submission.id === submissionId 
              ? { ...submission, status: 'approved', reviewedAt: new Date().toISOString() }
              : submission
          )
        );
        addToast('Vendor profile approved successfully', 'success');
      }
    } catch (error) {
      addToast('Failed to approve vendor profile', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [submissionId]: false }));
    }
  };

  const handleRejectSubmission = async (submissionId, reason = '') => {
    try {
      setActionLoading(prev => ({ ...prev, [submissionId]: true }));
      
      const response = await apiService.put(`/admin/vendor-submissions/${submissionId}/reject`, {
        reason
      });

      if (response.success) {
        setSubmissions(prev => 
          prev.map(submission => 
            submission.id === submissionId 
              ? { 
                  ...submission, 
                  status: 'rejected', 
                  rejectionReason: reason,
                  reviewedAt: new Date().toISOString() 
                }
              : submission
          )
        );
        addToast('Vendor profile rejected', 'success');
      }
    } catch (error) {
      addToast('Failed to reject vendor profile', 'error');
    } finally {
      setActionLoading(prev => ({ ...prev, [submissionId]: false }));
    }
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
    setIsDetailModalOpen(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Pending Review
          </Badge>
        );
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getVerificationTypeBadge = (type) => {
    switch (type) {
      case 'gst':
        return <Badge variant="outline" className="text-blue-600">GST Verification</Badge>;
      case 'manual':
        return <Badge variant="outline" className="text-purple-600">Manual Verification</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const SubmissionRow = ({ submission }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-semibold">
            {(submission.vendor?.user?.firstName?.charAt(0) || 'V').toUpperCase()}
            {(submission.vendor?.user?.lastName?.charAt(0) || '').toUpperCase()}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-gray-900 truncate">
                {submission.vendor?.businessName || 
                 `${submission.vendor?.user?.firstName} ${submission.vendor?.user?.lastName}`}
              </h4>
              {getStatusBadge(submission.status)}
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-1">
              <span className="flex items-center">
                <User className="w-3 h-3 mr-1" />
                {submission.vendor?.user?.email}
              </span>
              <span className="flex items-center">
                <Building className="w-3 h-3 mr-1" />
                {submission.vendor?.vendorType || 'N/A'}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                Submitted: {new Date(submission.createdAt).toLocaleDateString()}
              </span>
              {submission.reviewedAt && (
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Reviewed: {new Date(submission.reviewedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {getVerificationTypeBadge(submission.verificationType)}
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleViewDetails(submission)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
            
            {submission.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleApproveSubmission(submission.id)}
                  disabled={actionLoading[submission.id]}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {actionLoading[submission.id] ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Approve
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRejectSubmission(submission.id, 'Profile does not meet verification requirements')}
                  disabled={actionLoading[submission.id]}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Profile Verification</h1>
            <p className="text-purple-100">Review and approve vendor profile submissions</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
        </div>
        
        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{pagination.total}</div>
            <div className="text-purple-100 text-sm">Total Submissions</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">
              {submissions.filter(s => s.status === 'pending').length}
            </div>
            <div className="text-purple-100 text-sm">Pending Review</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">
              {submissions.filter(s => s.status === 'approved').length}
            </div>
            <div className="text-purple-100 text-sm">Approved</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">
              {submissions.filter(s => s.status === 'rejected').length}
            </div>
            <div className="text-purple-100 text-sm">Rejected</div>
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
          setFilters({ status: 'all', verificationType: 'all', vendorType: 'all' });
        }}
        loading={loading}
        placeholder="Search submissions by business name, email..."
        showRefresh={true}
        onRefresh={loadSubmissions}
      />

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Verification Submissions ({pagination.total})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner size="lg" text="Loading submissions..." />
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No verification submissions found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <SubmissionRow key={submission.id} submission={submission} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex items-center text-sm text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} submissions
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
                            ? "bg-purple-600 text-white"
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

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Verification Submission Details
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Status and Type */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusBadge(selectedSubmission.status)}
                  {getVerificationTypeBadge(selectedSubmission.verificationType)}
                </div>
                <div className="text-sm text-gray-500">
                  Submitted: {new Date(selectedSubmission.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Business Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Business Information
                  </h3>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business Name</label>
                    <p className="text-gray-900">{selectedSubmission.vendor?.businessName || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Vendor Type</label>
                    <p className="text-gray-900">{selectedSubmission.vendor?.vendorType || 'N/A'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Owner Name</label>
                    <p className="text-gray-900">
                      {selectedSubmission.vendor?.user?.firstName} {selectedSubmission.vendor?.user?.lastName}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{selectedSubmission.vendor?.user?.email}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Address Information
                  </h3>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Business Address</label>
                    <p className="text-gray-900">
                      {selectedSubmission.vendor?.businessAddress1 || 'N/A'}
                      {selectedSubmission.vendor?.businessAddress2 && 
                        <><br />{selectedSubmission.vendor.businessAddress2}</>
                      }
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">City</label>
                      <p className="text-gray-900">{selectedSubmission.vendor?.city || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">State</label>
                      <p className="text-gray-900">{selectedSubmission.vendor?.state || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Postal Code</label>
                    <p className="text-gray-900">{selectedSubmission.vendor?.postalCode || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Verification Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  Verification Details
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Verification Type</label>
                    <p className="text-gray-900 capitalize">{selectedSubmission.verificationType}</p>
                  </div>
                  
                  {selectedSubmission.verificationType === 'gst' && selectedSubmission.vendor?.gstNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">GST Number</label>
                      <p className="text-gray-900 font-mono">{selectedSubmission.vendor.gstNumber}</p>
                    </div>
                  )}
                  
                  {selectedSubmission.verificationType === 'manual' && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-gray-500">ID Type</label>
                        <p className="text-gray-900 capitalize">{selectedSubmission.vendor?.idType || 'N/A'}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">ID Number</label>
                        <p className="text-gray-900 font-mono">{selectedSubmission.vendor?.idNumber || 'N/A'}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              {selectedSubmission.status === 'pending' && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => handleRejectSubmission(selectedSubmission.id, 'Profile does not meet verification requirements')}
                    disabled={actionLoading[selectedSubmission.id]}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  
                  <Button
                    onClick={() => handleApproveSubmission(selectedSubmission.id)}
                    disabled={actionLoading[selectedSubmission.id]}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {actionLoading[selectedSubmission.id] ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Rejection Reason */}
              {selectedSubmission.status === 'rejected' && selectedSubmission.rejectionReason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">Rejection Reason</h4>
                      <p className="text-red-700 text-sm mt-1">{selectedSubmission.rejectionReason}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminProfileVerification;
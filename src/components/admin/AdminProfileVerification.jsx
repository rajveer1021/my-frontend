import React, { useState, useEffect } from "react";
import {
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  User,
  Building,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  Ban,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import { Badge } from "../ui/Badge";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useToast } from "../ui/Toast";
import { apiService } from "../../services/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";

const AdminProfileVerification = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionVendorId, setRejectionVendorId] = useState(null);
  const [rejectionType, setRejectionType] = useState("reject");
  const { addToast } = useToast();

  useEffect(() => {
    loadSubmissions();
  }, [pagination.page]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      const response = await apiService.get(
        "/admin/vendors/submissions",
        params
      );

      if (response.success && response.data) {
        setSubmissions(response.data.vendors || []);
        setPagination(
          response.data.pagination || {
            page: pagination.page,
            limit: pagination.limit,
            total: 0,
            pages: 1,
          }
        );
      }
    } catch (error) {
      console.error("Failed to load submissions:", error);
      addToast("Failed to load verification submissions", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyVendor = async (vendorId, verified, rejectionReason = null) => {
    try {
      setActionLoading((prev) => ({ ...prev, [vendorId]: true }));

      const payload = { verified };
      
      // FIXED: When unverifying (setting to false), always require a reason
      if (!verified) {
        if (!rejectionReason || rejectionReason.trim() === '') {
          // If no rejection reason provided for unverify, use a default message
          payload.rejectionReason = rejectionReason || "Verification revoked by administrator";
        } else {
          payload.rejectionReason = rejectionReason.trim();
        }
      }

      console.log('🔄 Sending verification request:', { vendorId, payload });

      const response = await apiService.put(
        `/admin/vendors/${vendorId}/verify`,
        payload
      );

      if (response.success) {
        console.log('✅ Verification update successful:', response);
        
        setSubmissions((prev) =>
          prev.map((submission) =>
            submission.id === vendorId
              ? { 
                  ...submission, 
                  verified,
                  verificationStatus: verified ? "verified" : "rejected",
                  rejectionReason: !verified ? (rejectionReason || "Verification revoked by administrator") : null,
                  updatedAt: new Date().toISOString() 
                }
              : submission
          )
        );

        // Update selected submission if it's the one being modified
        if (selectedSubmission && selectedSubmission.id === vendorId) {
          setSelectedSubmission(prev => ({
            ...prev,
            verified,
            verificationStatus: verified ? "verified" : "rejected",
            rejectionReason: !verified ? (rejectionReason || "Verification revoked by administrator") : null,
            updatedAt: new Date().toISOString()
          }));
        }

        const action = verified ? "verified" : "unverified";
        addToast(`Vendor ${action} successfully`, "success");

        // Reset rejection modal state
        setShowRejectionModal(false);
        setRejectionReason("");
        setRejectionVendorId(null);
        setRejectionType("reject");
      }
    } catch (error) {
      console.error("Failed to update vendor verification:", error);
      const action = verified ? "verify" : (rejectionType === "unverify" ? "unverify" : "reject");
      addToast(`Failed to ${action} vendor: ${error.message}`, "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [vendorId]: false }));
    }
  };

  // FIXED: Handle reject with proper modal
  const handleRejectVendor = (vendorId) => {
    setRejectionVendorId(vendorId);
    setRejectionType("reject");
    setShowRejectionModal(true);
    setRejectionReason("");
  };

  // FIXED: Handle unverify with proper modal
  const handleUnverifyVendor = (vendorId) => {
    setRejectionVendorId(vendorId);
    setRejectionType("unverify");
    setShowRejectionModal(true);
    setRejectionReason("Verification revoked by administrator");
  };

  const confirmAction = () => {
    if (rejectionType === "reject" && !rejectionReason.trim()) {
      addToast("Please provide a reason for rejection", "error");
      return;
    }
    
    if (rejectionType === "unverify" && !rejectionReason.trim()) {
      setRejectionReason("Verification revoked by administrator");
    }

    handleVerifyVendor(rejectionVendorId, false, rejectionReason.trim());
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
    setIsDetailModalOpen(true);
  };

  const getVerificationStatusBadge = (submission) => {
    if (submission.verified) {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Verified
        </Badge>
      );
    } else if (submission.verificationStatus === "rejected" || submission.rejectionReason) {
      return (
        <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
          <Ban className="w-3 h-3" />
          Rejected
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Pending Review
        </Badge>
      );
    }
  };

  const getVerificationTypeBadge = (type) => {
    switch (type) {
      case "gst":
        return (
          <Badge variant="outline" className="text-blue-600">
            GST Verification
          </Badge>
        );
      case "manual":
        return (
          <Badge variant="outline" className="text-purple-600">
            Manual Verification
          </Badge>
        );
      default:
        return <Badge variant="outline">{type || "Not Specified"}</Badge>;
    }
  };

  const SubmissionRow = ({ submission }) => {
    const isRejected = submission.verificationStatus === "rejected" || submission.rejectionReason;
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-semibold">
              {(submission.user?.firstName?.charAt(0) || "V").toUpperCase()}
              {(submission.user?.lastName?.charAt(0) || "").toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-medium text-gray-900 truncate">
                  {submission.businessName ||
                    `${submission.user?.firstName} ${submission.user?.lastName}`}
                </h4>
                {getVerificationStatusBadge(submission)}
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-1">
                <span className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  {submission.user?.email}
                </span>
                <span className="flex items-center">
                  <Building className="w-3 h-3 mr-1" />
                  {submission.vendorType || "N/A"}
                </span>
              </div>

              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  Submitted: {new Date(submission.createdAt).toLocaleDateString()}
                </span>
                {submission.updatedAt && (
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Updated: {new Date(submission.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>

              {/* Show rejection reason if rejected */}
              {isRejected && submission.rejectionReason && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
                  <span className="font-medium text-red-800">Rejection Reason: </span>
                  <span className="text-red-700">{submission.rejectionReason}</span>
                </div>
              )}
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

              {!submission.verified && !isRejected ? (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleVerifyVendor(submission.id, true)}
                    disabled={actionLoading[submission.id]}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {actionLoading[submission.id] ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Verify
                      </>
                    )}
                  </Button>
                  
                  <Button
                    size="sm"
                    onClick={() => handleRejectVendor(submission.id)}
                    disabled={actionLoading[submission.id]}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {actionLoading[submission.id] ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Ban className="w-3 h-3 mr-1" />
                        Reject
                      </>
                    )}
                  </Button>
                </>
              ) : submission.verified ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnverifyVendor(submission.id)}
                  disabled={actionLoading[submission.id]}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  {actionLoading[submission.id] ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 mr-1" />
                      Unverify
                    </>
                  )}
                </Button>
              ) : (
                // For rejected vendors, allow re-evaluation
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVerifyVendor(submission.id, true)}
                  disabled={actionLoading[submission.id]}
                  className="text-green-600 border-green-200 hover:bg-green-50"
                >
                  {actionLoading[submission.id] ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Re-evaluate
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Calculate stats from current submissions
  const stats = {
    total: pagination.total,
    pending: submissions.filter((s) => !s.verified && !(s.verificationStatus === "rejected" || s.rejectionReason)).length,
    verified: submissions.filter((s) => s.verified).length,
    rejected: submissions.filter((s) => s.verificationStatus === "rejected" || s.rejectionReason).length,
    gstVerifications: submissions.filter((s) => s.verificationType === "gst").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Profile Verification</h1>
            <p className="text-purple-100">
              Review and approve vendor profile submissions
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
        </div>

        {/* Updated Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-purple-100 text-sm">Total Submissions</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{stats.pending}</div>
            <div className="text-purple-100 text-sm">Pending Review</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{stats.verified}</div>
            <div className="text-purple-100 text-sm">Verified</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <div className="text-purple-100 text-sm">Rejected</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{stats.gstVerifications}</div>
            <div className="text-purple-100 text-sm">GST Verifications</div>
          </div>
        </div>
      </div>

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
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  disabled={pagination.page === 1 || loading}
                  className="text-sm"
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from(
                    { length: Math.min(5, pagination.pages) },
                    (_, i) => {
                      const page = i + 1;
                      const isActive = page === pagination.page;

                      return (
                        <button
                          key={page}
                          onClick={() =>
                            setPagination((prev) => ({ ...prev, page }))
                          }
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
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
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

      {/* FIXED: Rejection/Unverify Modal */}
      {showRejectionModal && (
        <Dialog open={showRejectionModal} onOpenChange={setShowRejectionModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {rejectionType === "reject" ? "Reject Vendor Application" : "Unverify Vendor"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                {rejectionType === "reject" 
                  ? "Please provide a reason for rejecting this vendor application. This will help the vendor understand what needs to be improved."
                  : "Please provide a reason for removing verification from this vendor. This action will change their status back to unverified."
                }
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder={rejectionType === "reject" ? "Enter rejection reason..." : "Enter reason for unverifying..."}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24"
                maxLength={500}
              />
              <div className="text-xs text-gray-500 text-right">
                {rejectionReason.length}/500 characters
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectionModal(false);
                    setRejectionReason("");
                    setRejectionVendorId(null);
                    setRejectionType("reject");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmAction}
                  disabled={
                    (rejectionType === "reject" && !rejectionReason.trim()) || 
                    actionLoading[rejectionVendorId]
                  }
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {actionLoading[rejectionVendorId] ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    rejectionType === "reject" ? "Reject Application" : "Unverify Vendor"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Submission Details Modal */}
      {selectedSubmission && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-8">
            <DialogHeader className="border-b border-gray-200 pb-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl">
                    {(
                      selectedSubmission.user?.firstName?.charAt(0) || "V"
                    ).toUpperCase()}
                    {(
                      selectedSubmission.user?.lastName?.charAt(0) || ""
                    ).toUpperCase()}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      Verification Submission Details
                    </DialogTitle>
                    <div className="flex items-center space-x-3 mt-2">
                      {getVerificationStatusBadge(selectedSubmission)}
                      {getVerificationTypeBadge(
                        selectedSubmission.verificationType
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-10">
              {/* Status Overview Section */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8 border border-purple-200">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                    <Shield className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Verification Status Overview
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center whitespace-nowrap">
                    <div className="mb-2">
                      {getVerificationStatusBadge(selectedSubmission)}
                    </div>
                  </div>
                  <div className="text-center whitespace-nowrap">
                    <div className="mb-2">
                      {getVerificationTypeBadge(
                        selectedSubmission.verificationType
                      )}
                    </div>
                  </div>
                </div>

                {/* Show rejection reason in status section */}
                {(selectedSubmission.verificationStatus === "rejected" || selectedSubmission.rejectionReason) && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">Rejection Reason</h4>
                    <p className="text-red-700">{selectedSubmission.rejectionReason || "No reason provided"}</p>
                  </div>
                )}
              </div>

              {/* Business Information Section */}
              <div className="bg-blue-50 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                    <Building className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Business Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Business Name
                      </label>
                      <p className="text-gray-900 font-medium text-lg">
                        {selectedSubmission.businessName || "Not provided"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Vendor Type
                      </label>
                      <p className="text-gray-900 font-medium">
                        {selectedSubmission.vendorType || "Not specified"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Business License
                      </label>
                      <p className="text-gray-900 font-medium">
                        {selectedSubmission.businessLicense || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Owner Name
                      </label>
                      <p className="text-gray-900 font-medium text-lg">
                        {selectedSubmission.user?.firstName}{" "}
                        {selectedSubmission.user?.lastName}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Email Address
                      </label>
                      <p className="text-gray-900 font-medium break-all">
                        {selectedSubmission.user?.email}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Phone Number
                      </label>
                      <p className="text-gray-900 font-medium">
                        {selectedSubmission.user?.phoneNumber || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="bg-green-50 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Address Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Business Address
                      </label>
                      <div className="p-4 bg-white rounded-lg border border-green-200">
                        <p className="text-gray-900 leading-relaxed">
                          {selectedSubmission.businessAddress1 ||
                            "Not provided"}
                          {selectedSubmission.businessAddress2 && (
                            <>
                              <br />
                              {selectedSubmission.businessAddress2}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          City
                        </label>
                        <p className="text-gray-900 font-medium">
                          {selectedSubmission.city || "N/A"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          State
                        </label>
                        <p className="text-gray-900 font-medium">
                          {selectedSubmission.state || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Postal Code
                      </label>
                      <p className="text-gray-900 font-medium">
                        {selectedSubmission.postalCode || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Details Section */}
              <div className="bg-orange-50 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
                    <FileText className="w-4 h-4 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Verification Details & Documents
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Verification Type
                      </label>
                      <p className="text-gray-900 font-medium capitalize">
                        {selectedSubmission.verificationType || "Not Specified"}
                      </p>
                    </div>

                    {selectedSubmission.verificationType === "gst" &&
                      selectedSubmission.gstNumber && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            GST Number
                          </label>
                          <p className="text-gray-900 font-mono text-lg bg-white p-3 rounded-lg border border-orange-200">
                            {selectedSubmission.gstNumber}
                          </p>
                        </div>
                      )}

                    {selectedSubmission.verificationType === "manual" && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            ID Type
                          </label>
                          <p className="text-gray-900 font-medium capitalize">
                            {selectedSubmission.idType || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            ID Number
                          </label>
                          <p className="text-gray-900 font-mono bg-white p-3 rounded-lg border border-orange-200">
                            {selectedSubmission.idNumber || "N/A"}
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="space-y-4">
                    {/* Documents Section */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">
                        Submitted Documents
                      </h4>

                      {selectedSubmission.gstDocument && (
                        <div className="p-4 bg-white rounded-lg border border-orange-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <FileText className="w-5 h-5 text-orange-600" />
                              <div>
                                <p className="font-medium text-gray-900">
                                  GST Document
                                </p>
                                <p className="text-sm text-gray-500">
                                  Business registration proof
                                </p>
                              </div>
                            </div>
                            <a
                              href={selectedSubmission.gstDocument}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              View Document
                            </a>
                          </div>
                        </div>
                      )}

                      {selectedSubmission.otherDocuments &&
                        selectedSubmission.otherDocuments.length > 0 && (
                          <div className="space-y-2">
                            <p className="font-medium text-gray-900">
                              Other Documents
                            </p>
                            {selectedSubmission.otherDocuments.map(
                              (doc, index) => (
                                <div
                                  key={index}
                                  className="p-4 bg-white rounded-lg border border-orange-200"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <FileText className="w-5 h-5 text-orange-600" />
                                      <div>
                                        <p className="font-medium text-gray-900">
                                          Document {index + 1}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                          Additional verification document
                                        </p>
                                      </div>
                                    </div>
                                    <a
                                      href={doc}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                      View Document
                                    </a>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        )}

                      {!selectedSubmission.gstDocument &&
                        (!selectedSubmission.otherDocuments ||
                          selectedSubmission.otherDocuments.length === 0) && (
                          <div className="p-6 bg-white rounded-lg border border-orange-200 text-center">
                            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">
                              No documents submitted
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Alert Section for Unverified/Rejected */}
              {!selectedSubmission.verified && (
                <div className={`border rounded-xl p-6 ${
                  selectedSubmission.verificationStatus === "rejected" || selectedSubmission.rejectionReason
                    ? "bg-red-50 border-red-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}>
                  <div className="flex items-center">
                    {selectedSubmission.verificationStatus === "rejected" || selectedSubmission.rejectionReason ? (
                      <>
                        <Ban className="w-6 h-6 text-red-600 mr-3" />
                        <div>
                          <h4 className="font-semibold text-red-800">
                            Application Rejected
                          </h4>
                          <p className="text-red-700 mt-1">
                            This vendor application has been rejected. You can re-evaluate and approve if the issues have been resolved.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
                        <div>
                          <h4 className="font-semibold text-yellow-800">
                            Action Required
                          </h4>
                          <p className="text-yellow-700 mt-1">
                            This vendor submission is waiting for verification.
                            Review all documents and information before approving or rejecting.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* FIXED: Action Buttons */}
            <div className="border-t border-gray-200 pt-8 mt-8">
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-6"
                  >
                    Close
                  </Button>
                </div>
                <div className="flex space-x-4">
                  {!selectedSubmission.verified && !(selectedSubmission.verificationStatus === "rejected" || selectedSubmission.rejectionReason) ? (
                    <>
                      <Button
                        onClick={() =>
                          handleVerifyVendor(selectedSubmission.id, true)
                        }
                        disabled={actionLoading[selectedSubmission.id]}
                        className="bg-green-600 hover:bg-green-700 text-white px-8"
                      >
                        {actionLoading[selectedSubmission.id] ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Verify Vendor
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleRejectVendor(selectedSubmission.id)}
                        disabled={actionLoading[selectedSubmission.id]}
                        className="bg-red-600 hover:bg-red-700 text-white px-8"
                      >
                        {actionLoading[selectedSubmission.id] ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <Ban className="w-4 h-4 mr-2" />
                            Reject Application
                          </>
                        )}
                      </Button>
                    </>
                  ) : selectedSubmission.verified ? (
                    <Button
                      onClick={() => handleUnverifyVendor(selectedSubmission.id)}
                      disabled={actionLoading[selectedSubmission.id]}
                      className="bg-red-600 hover:bg-red-700 text-white px-8"
                    >
                      {actionLoading[selectedSubmission.id] ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Revoke Verification
                        </>
                      )}
                    </Button>
                  ) : (
                    // For rejected vendors, allow re-evaluation
                    <Button
                      onClick={() =>
                        handleVerifyVendor(selectedSubmission.id, true)
                      }
                      disabled={actionLoading[selectedSubmission.id]}
                      className="bg-green-600 hover:bg-green-700 text-white px-8"
                    >
                      {actionLoading[selectedSubmission.id] ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Re-evaluate & Approve
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminProfileVerification;
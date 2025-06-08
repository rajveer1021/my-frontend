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
  MapPin, // NEW - for address sections
  AlertTriangle, // NEW - for warning alerts
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

  const handleVerifyVendor = async (vendorId, verified) => {
    try {
      setActionLoading((prev) => ({ ...prev, [vendorId]: true }));

      const response = await apiService.put(
        `/admin/vendors/${vendorId}/verify`,
        {
          verified,
        }
      );

      if (response.success) {
        setSubmissions((prev) =>
          prev.map((submission) =>
            submission.id === vendorId
              ? { ...submission, verified, updatedAt: new Date().toISOString() }
              : submission
          )
        );

        addToast(
          `Vendor ${verified ? "verified" : "unverified"} successfully`,
          "success"
        );

        if (selectedSubmission && selectedSubmission.id === vendorId) {
          setIsDetailModalOpen(false);
        }
      }
    } catch (error) {
      console.error("Failed to update vendor verification:", error);
      addToast(`Failed to ${verified ? "verify" : "unverify"} vendor`, "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [vendorId]: false }));
    }
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
    setIsDetailModalOpen(true);
  };

  const getVerificationStatusBadge = (verified) => {
    if (verified) {
      return (
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Verified
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

  const SubmissionRow = ({ submission }) => (
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
              {getVerificationStatusBadge(submission.verified)}
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

            {!submission.verified ? (
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
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVerifyVendor(submission.id, false)}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Calculate stats from current submissions
  const stats = {
    total: pagination.total,
    pending: submissions.filter((s) => !s.verified).length,
    verified: submissions.filter((s) => s.verified).length,
    gstVerifications: submissions.filter((s) => s.verificationType === "gst")
      .length,
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

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
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
                      {getVerificationStatusBadge(selectedSubmission.verified)}
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
                      {getVerificationStatusBadge(selectedSubmission.verified)}
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

              {/* Alert Section for Unverified */}
              {!selectedSubmission.verified && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">
                        Action Required
                      </h4>
                      <p className="text-yellow-700 mt-1">
                        This vendor submission is waiting for verification.
                        Review all documents and information before approving.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
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
                  {!selectedSubmission.verified ? (
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
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleVerifyVendor(selectedSubmission.id, false)
                      }
                      disabled={actionLoading[selectedSubmission.id]}
                      className="text-red-600 border-red-300 hover:bg-red-50 px-8"
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

import React, { useState, useEffect, useCallback } from "react";
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
  AlertTriangle,
  Trash2,
  Power,
  PowerOff,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import { Badge } from "../ui/Badge";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useToast } from "../ui/Toast";
import { adminService } from "../../services/adminService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";

// Confirmation Dialog Component
const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  variant = "danger",
  loading = false,
  reasonRequired = false,
}) => {
  const [reason, setReason] = useState("");
  
  const handleConfirm = () => {
    if (reasonRequired && !reason.trim()) {
      return;
    }
    onConfirm(reason.trim() || null);
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {variant === "danger" && <AlertTriangle className="w-5 h-5 text-red-600" />}
            {variant === "warning" && <AlertTriangle className="w-5 h-5 text-yellow-600" />}
            {variant === "info" && <CheckCircle className="w-5 h-5 text-blue-600" />}
            <span>{title}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-600 mb-4">{message}</p>
          
          {reasonRequired && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Reason for deactivation <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Please provide a reason for deactivating this vendor..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={3}
                required
              />
              {reasonRequired && !reason.trim() && (
                <p className="text-sm text-red-600">Reason is required</p>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={loading || (reasonRequired && !reason.trim())}
            className={
              variant === "danger" 
                ? "bg-red-600 hover:bg-red-700" 
                : variant === "warning"
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-blue-600 hover:bg-blue-700"
            }
          >
            {loading ? <LoadingSpinner size="sm" /> : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Debounce hook for search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const AdminVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    verificationStatus: "all",
    vendorType: "all",
    isActive: "all",
    city: "",
    state: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    pages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null,
    vendor: null,
    loading: false,
  });
  const [stats, setStats] = useState({});
  const { addToast } = useToast();

  // Debounce search term to avoid API calls on every keystroke
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Get filter options from admin service
  const filterOptions = adminService.getVendorFilterOptions();

  // Define default filter values
  const defaultFilters = {
    status: "all",
    verificationStatus: "all",
    vendorType: "all",
    isActive: "all",
    city: "",
    state: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  // Check if any filters are active (not default values)
  const hasActiveFilters = useCallback(() => {
    return (
      debouncedSearchTerm.trim() !== "" ||
      filters.status !== defaultFilters.status ||
      filters.verificationStatus !== defaultFilters.verificationStatus ||
      filters.vendorType !== defaultFilters.vendorType ||
      filters.isActive !== defaultFilters.isActive ||
      filters.city !== defaultFilters.city ||
      filters.state !== defaultFilters.state ||
      filters.sortBy !== defaultFilters.sortBy ||
      filters.sortOrder !== defaultFilters.sortOrder
    );
  }, [debouncedSearchTerm, filters]);

  // Count active filters for display
  const getActiveFilterCount = useCallback(() => {
    let count = 0;
    if (debouncedSearchTerm.trim() !== "") count++;
    if (filters.status !== defaultFilters.status) count++;
    if (filters.verificationStatus !== defaultFilters.verificationStatus)
      count++;
    if (filters.vendorType !== defaultFilters.vendorType) count++;
    if (filters.isActive !== defaultFilters.isActive) count++;
    if (filters.city !== defaultFilters.city) count++;
    if (filters.state !== defaultFilters.state) count++;
    if (
      filters.sortBy !== defaultFilters.sortBy ||
      filters.sortOrder !== defaultFilters.sortOrder
    )
      count++;
    return count;
  }, [debouncedSearchTerm, filters]);

  useEffect(() => {
    // Reset to first page when search or filters change
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearchTerm, filters]);

  useEffect(() => {
    loadVendors();
  }, [pagination.page, debouncedSearchTerm, filters]);

  const loadVendors = async () => {
    try {
      setLoading(true);

      // Prepare search and filter parameters for the real API
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      // Add search parameter if provided
      if (debouncedSearchTerm && debouncedSearchTerm.trim()) {
        params.search = debouncedSearchTerm.trim();
      }

      // Add filter parameters only if they have valid values
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== "all" && value !== "") {
          params[key] = value;
        }
      });

      console.log("Loading vendors with params:", params);
      const response = await adminService.getVendors(params);

      if (response.success) {
        console.log("Vendors loaded successfully:", response.data);
        setVendors(response.data.vendors || []);
        setPagination({
          ...response.data.pagination,
          limit: 5, // Ensure limit stays 5
        });
        setStats(response.data.stats || {});
      }
    } catch (error) {
      console.error("Failed to load vendors:", error);
      addToast(error.message || "Failed to load vendors", "error");

      // Set empty state on error
      setVendors([]);
      setPagination((prev) => ({ ...prev, total: 0, pages: 1 }));
    } finally {
      setLoading(false);
    }
  };

  // Handle user activation toggle
  const handleToggleActivation = async (vendor, isActive, reason = null) => {
    try {
      setActionLoading((prev) => ({ ...prev, [vendor.id]: true }));
      setConfirmDialog((prev) => ({ ...prev, loading: true }));

      const response = await adminService.toggleUserStatus(vendor.userId, isActive, reason);

      if (response.success) {
        setVendors((prev) =>
          prev.map((v) =>
            v.id === vendor.id
              ? { ...v, user: { ...v.user, isActive } }
              : v
          )
        );
        
        const action = isActive ? 'activated' : 'deactivated';
        addToast(`Vendor ${action} successfully`, "success");
        
        // Close confirmation dialog
        setConfirmDialog({
          isOpen: false,
          type: null,
          vendor: null,
          loading: false,
        });
      }
    } catch (error) {
      addToast(error.message || `Failed to toggle vendor activation`, "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [vendor.id]: false }));
      setConfirmDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  // Show confirmation dialog for activation toggle
  const showToggleConfirmation = (vendor, isActive) => {
    setConfirmDialog({
      isOpen: true,
      type: isActive ? 'activate' : 'deactivate',
      vendor,
      loading: false,
    });
  };

  const handleUpdateVendorStatus = async (vendorId, status) => {
    try {
      setActionLoading((prev) => ({ ...prev, [vendorId]: true }));

      const response = await adminService.updateVendorStatus(vendorId, status);

      if (response.success) {
        setVendors((prev) =>
          prev.map((vendor) =>
            vendor.id === vendorId
              ? { ...vendor, status: status.toUpperCase() }
              : vendor
          )
        );
        addToast(response.message, "success");
      }
    } catch (error) {
      addToast(error.message || `Failed to update vendor status`, "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [vendorId]: false }));
    }
  };

  const handleUpdateVendorVerification = async (
    vendorId,
    verified,
    rejectionReason = null
  ) => {
    try {
      setActionLoading((prev) => ({ ...prev, [vendorId]: true }));

      const response = await adminService.updateVendorVerification(
        vendorId,
        verified,
        rejectionReason
      );

      if (response.success) {
        setVendors((prev) =>
          prev.map((vendor) =>
            vendor.id === vendorId ? { ...vendor, verified } : vendor
          )
        );
        addToast(response.message, "success");
      }
    } catch (error) {
      addToast(
        error.message || `Failed to update vendor verification`,
        "error"
      );
    } finally {
      setActionLoading((prev) => ({ ...prev, [vendorId]: false }));
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this vendor account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setActionLoading((prev) => ({ ...prev, [vendorId]: true }));

      const response = await adminService.deleteVendor(vendorId);

      if (response.success) {
        setVendors((prev) => prev.filter((vendor) => vendor.id !== vendorId));
        addToast(response.message, "success");
        setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      }
    } catch (error) {
      addToast(error.message || "Failed to delete vendor", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [vendorId]: false }));
    }
  };

  const handleViewDetails = async (vendor) => {
    try {
      setSelectedVendor(vendor);
      setIsDetailModalOpen(true);

      // Optionally, fetch more detailed vendor information
      const response = await adminService.getVendor(vendor.id);
      if (response.success) {
        setSelectedVendor(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch vendor details:", error);
      // Still show the modal with basic vendor data
      setSelectedVendor(vendor);
      setIsDetailModalOpen(true);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilters(defaultFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const getStatusBadge = (status) => {
    const statusLower = (status || "active").toLowerCase();
    switch (statusLower) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "blocked":
        return <Badge className="bg-red-100 text-red-800">Blocked</Badge>;
      case "suspended":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Suspended</Badge>
        );
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

  // Get activation status badge
  const getActivationBadge = (isActive) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
        <CheckCircle className="w-3 h-3" />
        Activated
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
        <XCircle className="w-3 h-3" />
        Deactivated
      </Badge>
    );
  };

  const VendorRow = ({ vendor }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {(
              vendor.user?.firstName?.charAt(0) ||
              vendor.businessName?.charAt(0) ||
              "V"
            ).toUpperCase()}
            {(vendor.user?.lastName?.charAt(0) || "").toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-gray-900 truncate">
                {vendor.businessName ||
                  `${vendor.user?.firstName} ${vendor.user?.lastName}`}
              </h4>
              {getVerificationBadge(vendor.verified)}
              {getActivationBadge(vendor.user?.isActive !== false)}
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
          {getStatusBadge(vendor.status)}

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

              {/* Activation Toggle Options */}
              {vendor.user?.isActive !== false ? (
                <DropdownMenuItem
                  onClick={() => showToggleConfirmation(vendor, false)}
                  className="text-orange-600"
                >
                  <PowerOff className="mr-2 h-4 w-4" />
                  Deactivate User
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => showToggleConfirmation(vendor, true)}
                  className="text-green-600"
                >
                  <Power className="mr-2 h-4 w-4" />
                  Activate User
                </DropdownMenuItem>
              )}

              {vendor.status !== "blocked" && vendor.status !== "BLOCKED" ? (
                <DropdownMenuItem
                  onClick={() => handleUpdateVendorStatus(vendor.id, "blocked")}
                  className="text-red-600"
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Block Vendor
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleUpdateVendorStatus(vendor.id, "active")}
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

  // Calculate stats from current vendor data if not provided by API
  const calculateStats = () => {
    const totalVendors = pagination.total || vendors.length;
    const verifiedCount = vendors.filter((v) => v.verified).length;
    const activeCount = vendors.filter(
      (v) => (v.status || "active").toLowerCase() === "active"
    ).length;
    const blockedCount = vendors.filter(
      (v) => (v.status || "").toLowerCase() === "blocked"
    ).length;
    const activatedCount = vendors.filter((v) => v.user?.isActive !== false).length;
    const deactivatedCount = vendors.filter((v) => v.user?.isActive === false).length;

    return {
      total: totalVendors,
      verified: verifiedCount,
      active: activeCount,
      blocked: blockedCount,
      activated: activatedCount,
      deactivated: deactivatedCount,
      ...stats,
    };
  };

  const currentStats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Vendor Management</h1>
            <p className="text-blue-100">
              Manage all vendors and their accounts
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Building className="w-6 h-6" />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{currentStats.total}</div>
            <div className="text-blue-100 text-sm">Total Vendors</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{currentStats.active}</div>
            <div className="text-blue-100 text-sm">Active</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{currentStats.blocked}</div>
            <div className="text-blue-100 text-sm">Blocked</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{currentStats.activated}</div>
            <div className="text-blue-100 text-sm">Activated</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{currentStats.deactivated}</div>
            <div className="text-blue-100 text-sm">Deactivated</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Search & Filter
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={loadVendors}
              disabled={loading}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </Button>
            {hasActiveFilters() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear ({getActiveFilterCount()})
              </Button>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search vendors by name, email, or business..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {debouncedSearchTerm !== searchTerm && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              {filterOptions.statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activation
            </label>
            <select
              value={filters.isActive}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, isActive: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Users</option>
              {filterOptions.activationStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Verification
            </label>
            <select
              value={filters.verificationStatus}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  verificationStatus: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Verification</option>
              {filterOptions.verificationStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor Type
            </label>
            <select
              value={filters.vendorType}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, vendorType: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Vendor Type</option>
              {filterOptions.vendorTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

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
              {(debouncedSearchTerm ||
                Object.values(filters).some(
                  (f) => f && f !== "all" && f !== ""
                )) && (
                <p className="text-sm mt-2">
                  Try adjusting your search or filters
                </p>
              )}
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
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  disabled={!pagination.hasPrev || loading}
                  className="text-sm"
                >
                  Previous
                </Button>

                <div className="flex items-center space-x-1">
                  {Array.from(
                    { length: Math.min(5, pagination.pages) },
                    (_, i) => {
                      const startPage = Math.max(1, pagination.page - 2);
                      const page = startPage + i;

                      if (page > pagination.pages) return null;

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
                              ? "bg-blue-600 text-white"
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
                  disabled={!pagination.hasNext || loading}
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-8">
            <DialogHeader className="border-b border-gray-200 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                    {(
                      selectedVendor.user?.firstName?.charAt(0) ||
                      selectedVendor.businessName?.charAt(0) ||
                      "V"
                    ).toUpperCase()}
                    {(
                      selectedVendor.user?.lastName?.charAt(0) || ""
                    ).toUpperCase()}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      {selectedVendor.businessName ||
                        `${selectedVendor.user?.firstName} ${selectedVendor.user?.lastName}`}
                    </DialogTitle>
                    <div className="flex items-center space-x-3 mt-2">
                      {getStatusBadge(selectedVendor.status)}
                      {getVerificationBadge(selectedVendor.verified)}
                      {getActivationBadge(selectedVendor.user?.isActive !== false)}
                    </div>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="py-6 space-y-8">
              {/* Basic Information Section */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                    <Building className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Business Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Business Name
                    </label>
                    <p className="text-gray-900 font-medium">
                      {selectedVendor.businessName || "Not provided"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Vendor Type
                    </label>
                    <p className="text-gray-900 font-medium">
                      {selectedVendor.vendorType || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="bg-green-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center mr-3">
                    <Mail className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Contact Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Owner Name
                    </label>
                    <p className="text-gray-900 font-medium">
                      {selectedVendor.user?.firstName}{" "}
                      {selectedVendor.user?.lastName}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Email Address
                    </label>
                    <p className="text-gray-900 font-medium break-all">
                      {selectedVendor.user?.email}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Phone Number
                    </label>
                    <p className="text-gray-900 font-medium">
                      {selectedVendor.user?.phoneNumber || "Not provided"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Account Status
                    </label>
                    <div className="flex items-center space-x-2 mt-1">
                      {getStatusBadge(selectedVendor.status)}
                      {getActivationBadge(selectedVendor.user?.isActive !== false)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              {(selectedVendor.businessAddress1 ||
                selectedVendor.city ||
                selectedVendor.state) && (
                <div className="bg-purple-50 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                      <MapPin className="w-4 h-4 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Address Information
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Business Address
                      </label>
                      <div className="mt-1 p-4 bg-white rounded-lg border border-purple-200">
                        <p className="text-gray-900 leading-relaxed">
                          {selectedVendor.businessAddress1}
                          {selectedVendor.businessAddress2 && (
                            <>
                              <br />
                              {selectedVendor.businessAddress2}
                            </>
                          )}
                          {selectedVendor.city && (
                            <>
                              <br />
                              {selectedVendor.city}
                              {selectedVendor.state &&
                                `, ${selectedVendor.state}`}
                              {selectedVendor.postalCode &&
                                ` - ${selectedVendor.postalCode}`}
                            </>
                          )}
                          {selectedVendor.country && (
                            <>
                              <br />
                              {selectedVendor.country}
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Alert Section for Deactivated Users */}
              {selectedVendor.user?.isActive === false && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-center">
                    <PowerOff className="w-6 h-6 text-orange-600 mr-3" />
                    <div>
                      <h4 className="font-semibold text-orange-800">
                        Account Deactivated
                      </h4>
                      <p className="text-orange-700 mt-1">
                        This vendor account has been deactivated by an administrator.
                        The vendor cannot access the platform until reactivated.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center">
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-6"
                  >
                    Close
                  </Button>
                </div>
                <div className="flex space-x-3">
                  {/* Activation Toggle Button */}
                  {selectedVendor.user?.isActive !== false ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        showToggleConfirmation(selectedVendor, false);
                      }}
                      disabled={actionLoading[selectedVendor.id]}
                      className="text-orange-600 border-orange-300 hover:bg-orange-50 px-6"
                    >
                      <PowerOff className="w-4 h-4 mr-2" />
                      {actionLoading[selectedVendor.id]
                        ? "Deactivating..."
                        : "Deactivate User"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        showToggleConfirmation(selectedVendor, true);
                      }}
                      disabled={actionLoading[selectedVendor.id]}
                      className="bg-green-600 hover:bg-green-700 text-white px-6"
                    >
                      <Power className="w-4 h-4 mr-2" />
                      {actionLoading[selectedVendor.id]
                        ? "Activating..."
                        : "Activate User"}
                    </Button>
                  )}

                  {selectedVendor.status !== "blocked" &&
                  selectedVendor.status !== "BLOCKED" ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleUpdateVendorStatus(selectedVendor.id, "blocked");
                        setIsDetailModalOpen(false);
                      }}
                      disabled={actionLoading[selectedVendor.id]}
                      className="text-red-600 border-red-300 hover:bg-red-50 px-6"
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      {actionLoading[selectedVendor.id]
                        ? "Blocking..."
                        : "Block Vendor"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        handleUpdateVendorStatus(selectedVendor.id, "active");
                        setIsDetailModalOpen(false);
                      }}
                      disabled={actionLoading[selectedVendor.id]}
                      className="bg-green-600 hover:bg-green-700 text-white px-6"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      {actionLoading[selectedVendor.id]
                        ? "Unblocking..."
                        : "Unblock Vendor"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Confirmation Dialog for Activation Toggle */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({
          isOpen: false,
          type: null,
          vendor: null,
          loading: false,
        })}
        onConfirm={(reason) => 
          handleToggleActivation(
            confirmDialog.vendor, 
            confirmDialog.type === 'activate',
            reason
          )
        }
        title={
          confirmDialog.type === 'activate' 
            ? "Activate Vendor Account" 
            : "Deactivate Vendor Account"
        }
        message={
          confirmDialog.type === 'activate'
            ? `Are you sure you want to activate ${confirmDialog.vendor?.user?.firstName} ${confirmDialog.vendor?.user?.lastName}'s vendor account? They will be able to access the platform again.`
            : `Are you sure you want to deactivate ${confirmDialog.vendor?.user?.firstName} ${confirmDialog.vendor?.user?.lastName}'s vendor account? They will not be able to access the platform until reactivated.`
        }
        confirmText={
          confirmDialog.type === 'activate' 
            ? "Activate Vendor" 
            : "Deactivate Vendor"
        }
        variant={confirmDialog.type === 'activate' ? "info" : "warning"}
        loading={confirmDialog.loading}
        reasonRequired={confirmDialog.type === 'deactivate'}
      />
    </div>
  );
};

export default AdminVendors;
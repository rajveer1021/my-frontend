import React, { useState, useEffect, useCallback } from "react";
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
  AlertTriangle,
  User,
  Shield,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
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

  if (!isOpen) return null;

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
                placeholder="Please provide a reason for deactivating this user..."
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
            onClick={handleConfirm}
            disabled={loading || (reasonRequired && !reason.trim())}
            className={
              variant === "danger" 
                ? "bg-red-600 hover:bg-red-700 text-white" 
                : variant === "warning"
                ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
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

const AdminBuyers = () => {
  // State management
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    isActive: "all",
    registrationDate: "all",
    activity: "all",
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
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null,
    buyer: null,
    loading: false,
  });
  const [stats, setStats] = useState({});
  const { addToast } = useToast();

  // Debounce search term to avoid API calls on every keystroke
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Get filter options from admin service
  const filterOptions = adminService.getBuyerFilterOptions();

  // Define default filter values
  const defaultFilters = {
    status: "all",
    isActive: "all",
    registrationDate: "all",
    activity: "all",
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
      filters.isActive !== defaultFilters.isActive ||
      filters.registrationDate !== defaultFilters.registrationDate ||
      filters.activity !== defaultFilters.activity ||
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
    if (filters.isActive !== defaultFilters.isActive) count++;
    if (filters.registrationDate !== defaultFilters.registrationDate) count++;
    if (filters.activity !== defaultFilters.activity) count++;
    if (filters.city !== defaultFilters.city) count++;
    if (filters.state !== defaultFilters.state) count++;
    if (
      filters.sortBy !== defaultFilters.sortBy ||
      filters.sortOrder !== defaultFilters.sortOrder
    )
      count++;
    return count;
  }, [debouncedSearchTerm, filters]);

  // Effects
  useEffect(() => {
    // Reset to first page when search or filters change
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [debouncedSearchTerm, filters]);

  useEffect(() => {
    loadBuyers();
  }, [pagination.page, debouncedSearchTerm, filters]);

  // Load buyers function
  const loadBuyers = async () => {
    try {
      setLoading(true);

      // Prepare search and filter parameters
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

      console.log("Loading buyers with params:", params);
      const response = await adminService.getBuyers(params);

      if (response.success) {
        console.log("Buyers loaded successfully:", response.data);
        setBuyers(response.data.buyers || []);
        setPagination({
          ...response.data.pagination,
          limit: 5, // Ensure limit stays 5
        });
        setStats(response.data.stats || {});
      }
    } catch (error) {
      console.error("Failed to load buyers:", error);
      addToast(error.message || "Failed to load buyers", "error");

      // Set empty state on error
      setBuyers([]);
      setPagination((prev) => ({ ...prev, total: 0, pages: 1 }));
    } finally {
      setLoading(false);
    }
  };

  // Handle user activation toggle
  const handleToggleActivation = async (buyer, isActive, reason = null) => {
    try {
      setActionLoading((prev) => ({ ...prev, [buyer.id]: true }));
      setConfirmDialog((prev) => ({ ...prev, loading: true }));

      const response = await adminService.toggleUserStatus(buyer.id, isActive, reason);

      if (response.success) {
        setBuyers((prev) =>
          prev.map((b) =>
            b.id === buyer.id
              ? { ...b, isActive }
              : b
          )
        );
        
        const action = isActive ? 'activated' : 'deactivated';
        addToast(`Buyer ${action} successfully`, "success");
        
        // Close confirmation dialog
        setConfirmDialog({
          isOpen: false,
          type: null,
          buyer: null,
          loading: false,
        });
      }
    } catch (error) {
      addToast(error.message || `Failed to toggle buyer activation`, "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [buyer.id]: false }));
      setConfirmDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  // Show confirmation dialog for activation toggle
  const showToggleConfirmation = (buyer, isActive) => {
    setConfirmDialog({
      isOpen: true,
      type: isActive ? 'activate' : 'deactivate',
      buyer,
      loading: false,
    });
  };

  // Handle buyer status update (block/unblock)
  const handleUpdateBuyerStatus = async (buyerId, status) => {
    try {
      setActionLoading((prev) => ({ ...prev, [buyerId]: true }));

      const response = await adminService.updateBuyerStatus(buyerId, status);

      if (response.success) {
        setBuyers((prev) =>
          prev.map((buyer) =>
            buyer.id === buyerId
              ? { ...buyer, status: status.toUpperCase() }
              : buyer
          )
        );
        addToast(response.message, "success");
      }
    } catch (error) {
      addToast(error.message || `Failed to update buyer status`, "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [buyerId]: false }));
    }
  };

  // Handle buyer deletion
  const handleDeleteBuyer = async (buyerId) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this buyer account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setActionLoading((prev) => ({ ...prev, [buyerId]: true }));

      const response = await adminService.deleteBuyer(buyerId);

      if (response.success) {
        setBuyers((prev) => prev.filter((buyer) => buyer.id !== buyerId));
        addToast(response.message, "success");
        setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      }
    } catch (error) {
      addToast(error.message || "Failed to delete buyer account", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [buyerId]: false }));
    }
  };

  // Handle view buyer details
  const handleViewDetails = async (buyer) => {
    try {
      setSelectedBuyer(buyer);
      setIsDetailModalOpen(true);

      // Optionally, fetch more detailed buyer information
      try {
        const response = await adminService.getBuyer(buyer.id);
        if (response.success) {
          setSelectedBuyer(response.data);
        }
      } catch (detailError) {
        console.log("Could not fetch additional buyer details:", detailError);
        // Continue with basic buyer data
      }
    } catch (error) {
      console.error("Failed to fetch buyer details:", error);
      // Still show the modal with basic buyer data
      setSelectedBuyer(buyer);
      setIsDetailModalOpen(true);
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilters(defaultFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Badge helper functions
  const getStatusBadge = (status) => {
    const statusLower = (status || "active").toLowerCase();
    switch (statusLower) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "blocked":
        return <Badge className="bg-red-100 text-red-800">Blocked</Badge>;
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            {status || "Active"}
          </Badge>
        );
    }
  };

  // Get activation status badge
  const getActivationBadge = (isActive) => {
    return isActive !== false ? (
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

  const getActivityLevel = (lastLogin) => {
    if (!lastLogin) return "Never logged in";

    const daysSinceLogin = Math.floor(
      (new Date() - new Date(lastLogin)) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLogin <= 1) return "Very Active";
    if (daysSinceLogin <= 7) return "Active";
    if (daysSinceLogin <= 30) return "Moderate";
    if (daysSinceLogin <= 90) return "Low";
    return "Inactive";
  };

  const getActivityBadge = (lastLogin) => {
    const daysSinceLogin = lastLogin
      ? Math.floor((new Date() - new Date(lastLogin)) / (1000 * 60 * 60 * 24))
      : null;

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

  // Buyer Row Component
  const BuyerRow = ({ buyer }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-semibold">
            {(buyer.firstName?.charAt(0) || "B").toUpperCase()}
            {(buyer.lastName?.charAt(0) || "").toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="font-medium text-gray-900 truncate">
                {buyer.firstName} {buyer.lastName}
              </h4>
              {getStatusBadge(buyer.status)}
              {getActivationBadge(buyer.isActive)}
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
                Last login:{" "}
                {buyer.lastLogin
                  ? new Date(buyer.lastLogin).toLocaleDateString()
                  : "Never"}
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

              {/* Activation Toggle Options */}
              {buyer.isActive !== false ? (
                <DropdownMenuItem
                  onClick={() => showToggleConfirmation(buyer, false)}
                  className="text-orange-600"
                >
                  <PowerOff className="mr-2 h-4 w-4" />
                  Deactivate User
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => showToggleConfirmation(buyer, true)}
                  className="text-green-600"
                >
                  <Power className="mr-2 h-4 w-4" />
                  Activate User
                </DropdownMenuItem>
              )}

              {buyer.status !== "blocked" && buyer.status !== "BLOCKED" ? (
                <DropdownMenuItem
                  onClick={() => handleUpdateBuyerStatus(buyer.id, "blocked")}
                  className="text-red-600"
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Block Buyer
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => handleUpdateBuyerStatus(buyer.id, "active")}
                  className="text-green-600"
                >
                  <UserCheck className="mr-2 h-4 w-4" />
                  Unblock Buyer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );

  // Calculate stats from current buyer data if not provided by API
  const calculateStats = () => {
    const totalBuyers = pagination.total || buyers.length;
    const activeCount = buyers.filter(
      (b) => (b.status || "active").toLowerCase() === "active"
    ).length;
    const blockedCount = buyers.filter(
      (b) => (b.status || "").toLowerCase() === "blocked"
    ).length;
    const activatedCount = buyers.filter((b) => b.isActive !== false).length;
    const deactivatedCount = buyers.filter((b) => b.isActive === false).length;
    const activeThisWeekCount = buyers.filter(
      (b) =>
        b.lastLogin &&
        Math.floor(
          (new Date() - new Date(b.lastLogin)) / (1000 * 60 * 60 * 24)
        ) <= 7
    ).length;

    return {
      total: totalBuyers,
      active: activeCount,
      blocked: blockedCount,
      activated: activatedCount,
      deactivated: deactivatedCount,
      activeThisWeek: activeThisWeekCount,
      ...stats,
    };
  };

  const currentStats = calculateStats();

  // Main component render
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-orange-600 via-pink-600 to-red-700 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Buyer Management</h1>
            <p className="text-orange-100">
              Manage all buyer accounts and their activity
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{currentStats.total}</div>
            <div className="text-orange-100 text-sm">Total Buyers</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{currentStats.active}</div>
            <div className="text-orange-100 text-sm">Active</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{currentStats.blocked}</div>
            <div className="text-orange-100 text-sm">Blocked</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{currentStats.activated}</div>
            <div className="text-orange-100 text-sm">Activated</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="text-2xl font-bold">{currentStats.deactivated}</div>
            <div className="text-orange-100 text-sm">Deactivated</div>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
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
              onClick={loadBuyers}
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
              placeholder="Search buyers by name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            {debouncedSearchTerm !== searchTerm && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
              Registration
            </label>
            <select
              value={filters.registrationDate}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  registrationDate: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Registration</option>
              {filterOptions.registrationPeriods.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity
            </label>
            <select
              value={filters.activity}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, activity: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Activity</option>
              {filterOptions.activityLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Buyers List Section */}
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
                              ? "bg-orange-600 text-white"
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

      {/* Buyer Details Modal */}
      {selectedBuyer && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-8">
            <DialogHeader className="border-b border-gray-200 pb-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl">
                    {(selectedBuyer.firstName?.charAt(0) || "B").toUpperCase()}
                    {(selectedBuyer.lastName?.charAt(0) || "").toUpperCase()}
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-gray-900">
                      {selectedBuyer.firstName} {selectedBuyer.lastName}
                    </DialogTitle>
                    <div className="flex items-center space-x-3 mt-2">
                      {getStatusBadge(selectedBuyer.status)}
                      {getActivationBadge(selectedBuyer.isActive)}
                      {getActivityBadge(selectedBuyer.lastLogin)}
                    </div>
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-10">
              {/* Account Overview Section */}
              <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-xl p-8 border border-orange-200">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-orange-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Account Overview
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Full Name
                      </label>
                      <p className="text-gray-900 font-medium">
                        {selectedBuyer.firstName} {selectedBuyer.lastName}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Email Address
                      </label>
                      <p className="text-gray-900 font-medium break-all">
                        {selectedBuyer.email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Account Status
                      </label>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(selectedBuyer.status)}
                        {getActivationBadge(selectedBuyer.isActive)}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Account Type
                      </label>
                      <p className="text-gray-900 font-medium">
                        {selectedBuyer.accountType || "BUYER"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Timeline Section */}
              <div className="bg-gray-50 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                    <Activity className="w-4 h-4 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Activity Timeline
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-lg font-semibold text-gray-900 whitespace-nowrap">
                      {new Date(selectedBuyer.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </div>
                    <p className="text-sm text-gray-600 whitespace-nowrap">
                      Account Created
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                      <Activity className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedBuyer.lastLogin
                        ? new Date(selectedBuyer.lastLogin).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )
                        : "Never"}
                    </div>
                    <p className="text-sm text-gray-600">Last Login</p>
                  </div>
                  <div className="text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      selectedBuyer.isActive !== false ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {selectedBuyer.isActive !== false ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {selectedBuyer.isActive !== false ? "Active" : "Inactive"}
                    </div>
                    <p className="text-sm text-gray-600">Account Status</p>
                  </div>
                </div>
              </div>

              {/* Alert Section for Blocked Users */}
              {(selectedBuyer.status === "blocked" ||
                selectedBuyer.status === "BLOCKED") && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <div className="flex items-center">
                    <Ban className="w-6 h-6 text-red-600 mr-3" />
                    <div>
                      <h4 className="font-semibold text-red-800">
                        Account Blocked
                      </h4>
                      <p className="text-red-700 mt-1">
                        This buyer account has been blocked and cannot access
                        the platform.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Alert Section for Deactivated Users */}
              {selectedBuyer.isActive === false && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <div className="flex items-center">
                    <PowerOff className="w-6 h-6 text-orange-600 mr-3" />
                    <div>
                      <h4 className="font-semibold text-orange-800">
                        Account Deactivated
                      </h4>
                      <p className="text-orange-700 mt-1">
                        This buyer account has been deactivated by an administrator.
                        The user cannot access the platform until reactivated.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Warning for Inactive Users */}
              {selectedBuyer.lastLogin &&
                Math.floor(
                  (new Date() - new Date(selectedBuyer.lastLogin)) /
                    (1000 * 60 * 60 * 24)
                ) > 90 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-center">
                      <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
                      <div>
                        <h4 className="font-semibold text-yellow-800">
                          Inactive Account
                        </h4>
                        <p className="text-yellow-700 mt-1">
                          This buyer hasn't logged in for over 90 days. Consider
                          reaching out for re-engagement.
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
                  {/* Activation Toggle Button */}
                  {selectedBuyer.isActive !== false ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        showToggleConfirmation(selectedBuyer, false);
                      }}
                      disabled={actionLoading[selectedBuyer.id]}
                      className="text-orange-600 border-orange-300 hover:bg-orange-50 px-6"
                    >
                      <PowerOff className="w-4 h-4 mr-2" />
                      {actionLoading[selectedBuyer.id]
                        ? "Deactivating..."
                        : "Deactivate User"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        showToggleConfirmation(selectedBuyer, true);
                      }}
                      disabled={actionLoading[selectedBuyer.id]}
                      className="bg-green-600 hover:bg-green-700 text-white px-6"
                    >
                      <Power className="w-4 h-4 mr-2" />
                      {actionLoading[selectedBuyer.id]
                        ? "Activating..."
                        : "Activate User"}
                    </Button>
                  )}

                  {selectedBuyer.status !== "blocked" &&
                  selectedBuyer.status !== "BLOCKED" ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleUpdateBuyerStatus(selectedBuyer.id, "blocked");
                        setIsDetailModalOpen(false);
                      }}
                      disabled={actionLoading[selectedBuyer.id]}
                      className="text-red-600 border-red-300 hover:bg-red-50 px-6"
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      {actionLoading[selectedBuyer.id]
                        ? "Blocking..."
                        : "Block Buyer"}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        handleUpdateBuyerStatus(selectedBuyer.id, "active");
                        setIsDetailModalOpen(false);
                      }}
                      disabled={actionLoading[selectedBuyer.id]}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      {actionLoading[selectedBuyer.id]
                        ? "Unblocking..."
                        : "Unblock Buyer"}
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
          buyer: null,
          loading: false,
        })}
        onConfirm={(reason) => 
          handleToggleActivation(
            confirmDialog.buyer, 
            confirmDialog.type === 'activate',
            reason
          )
        }
        title={
          confirmDialog.type === 'activate' 
            ? "Activate User Account" 
            : "Deactivate User Account"
        }
        message={
          confirmDialog.type === 'activate'
            ? `Are you sure you want to activate ${confirmDialog.buyer?.firstName} ${confirmDialog.buyer?.lastName}'s account? They will be able to access the platform again.`
            : `Are you sure you want to deactivate ${confirmDialog.buyer?.firstName} ${confirmDialog.buyer?.lastName}'s account? They will not be able to access the platform until reactivated.`
        }
        confirmText={
          confirmDialog.type === 'activate' 
            ? "Activate User" 
            : "Deactivate User"
        }
        variant={confirmDialog.type === 'activate' ? "info" : "warning"}
        loading={confirmDialog.loading}
        reasonRequired={confirmDialog.type === 'deactivate'}
      />
    </div>
  );
};

export default AdminBuyers;
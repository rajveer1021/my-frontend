// src/services/adminService.js - Fixed implementation with getAllDashboardData method
import { apiService } from "./api";

export const adminService = {
  // ===== COMBINED DASHBOARD DATA METHOD =====

  /**
   * Get all dashboard data in one call
   * @returns {Promise} Combined dashboard data
   */
  async getAllDashboardData() {
    try {
      // Make all three API calls in parallel
      const [coreKPIsResult, activityMetricsResult, recentActivitiesResult] =
        await Promise.allSettled([
          this.getCoreKPIs(),
          this.getActivityMetrics(),
          this.getRecentActivities(10),
        ]);

      const dashboardData = {};

      // Process Core KPIs
      if (coreKPIsResult.status === "fulfilled") {
        dashboardData.coreKPIs = coreKPIsResult.value;
      } else {
        console.error("❌ Failed to load Core KPIs:", coreKPIsResult.reason);
        dashboardData.coreKPIsError =
          coreKPIsResult.reason?.message || "Failed to load Core KPIs";
      }

      // Process Activity Metrics
      if (activityMetricsResult.status === "fulfilled") {
        dashboardData.activityMetrics = activityMetricsResult.value;
      } else {
        console.error(
          "❌ Failed to load Activity Metrics:",
          activityMetricsResult.reason
        );
        dashboardData.activityMetricsError =
          activityMetricsResult.reason?.message ||
          "Failed to load Activity Metrics";
      }

      // Process Recent Activities
      if (recentActivitiesResult.status === "fulfilled") {
        dashboardData.recentActivities = recentActivitiesResult.value;
      } else {
        console.error(
          "❌ Failed to load Recent Activities:",
          recentActivitiesResult.reason
        );
        dashboardData.recentActivitiesError =
          recentActivitiesResult.reason?.message ||
          "Failed to load Recent Activities";
      }

      // If all failed, throw an error
      if (
        !dashboardData.coreKPIs &&
        !dashboardData.activityMetrics &&
        !dashboardData.recentActivities
      ) {
        throw new Error("Failed to load any dashboard data");
      }

      return dashboardData;
    } catch (error) {
      console.error("❌ Failed to fetch all dashboard data:", error);
      throw new Error(error.message || "Failed to load dashboard data");
    }
  },

  /**
   * Refresh dashboard data (alias for getAllDashboardData)
   * @returns {Promise} Refreshed dashboard data
   */
  async refreshDashboardData() {
    return this.getAllDashboardData();
  },

  // ===== SIMPLIFIED DASHBOARD APIS =====

  /**
   * API 1: Get Core KPIs (Total Users, Vendors, Products, Inquiries, Platform Health)
   * @returns {Promise} Core KPIs data
   */
  async getCoreKPIs() {
    try {
      const response = await apiService.get("/admin/dashboard/core-kpis");

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("❌ Failed to fetch core KPIs:", error);

      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin privileges required.");
      } else if (error.response?.status === 404) {
        throw new Error("Core KPIs endpoint not found.");
      } else if (error.response?.status >= 500) {
        throw new Error("Server error. Please try again later.");
      }

      throw new Error(error.message || "Failed to fetch core KPIs");
    }
  },

  /**
   * API 2: Get Activity Metrics (Pending Verifications, Open Inquiries, Active Products, Verification Rate)
   * @returns {Promise} Activity metrics data
   */
  async getActivityMetrics() {
    try {
      const response = await apiService.get(
        "/admin/dashboard/activity-metrics"
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("❌ Failed to fetch activity metrics:", error);

      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin privileges required.");
      } else if (error.response?.status >= 500) {
        throw new Error("Server error. Please try again later.");
      }

      throw new Error(error.message || "Failed to fetch activity metrics");
    }
  },

  /**
   * API 3: Get Recent Activities
   * @param {number} limit - Number of activities to fetch (default: 10)
   * @returns {Promise} Recent activities data
   */
  async getRecentActivities(limit = 10) {
    try {
      const response = await apiService.get(
        `/admin/dashboard/recent-activities?limit=${limit}`
      );

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("❌ Failed to fetch recent activities:", error);

      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin privileges required.");
      } else if (error.response?.status >= 500) {
        throw new Error("Server error. Please try again later.");
      }

      throw new Error(error.message || "Failed to fetch recent activities");
    }
  },

  // Legacy method for backward compatibility
  async getDashboardStats() {
    try {
      const response = await apiService.get("/admin/dashboard/stats");

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("❌ Failed to fetch dashboard stats:", error);
      throw new Error(error.message || "Failed to fetch dashboard stats");
    }
  },

  // ===== USER ACTIVATION MANAGEMENT APIS =====

  /**
   * Toggle user activation status (activate/deactivate)
   * @param {string} userId - User ID to toggle
   * @param {boolean} isActive - New activation status
   * @param {string} reason - Reason for deactivation (optional)
   * @returns {Promise} Updated user data
   */
  async toggleUserStatus(userId, isActive, reason = null) {
    try {
      const payload = { isActive };

      // If deactivating, reason should be provided
      if (!isActive && reason && reason.trim()) {
        payload.reason = reason.trim();
      }

      const response = await apiService.put(
        `/admin/users/${userId}/toggle-status`,
        payload
      );

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message:
            response.message ||
            `User ${isActive ? "activated" : "deactivated"} successfully`,
        };
      }

      throw new Error("Failed to toggle user status");
    } catch (error) {
      console.error("Toggle user status error:", error);

      if (error.response?.status === 404) {
        throw new Error("User not found");
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || "Invalid request data");
      } else if (error.response?.status === 403) {
        throw new Error("Cannot deactivate admin users");
      }

      throw new Error(error.message || "Failed to toggle user status");
    }
  },

  /**
   * Get user activation statistics
   * @returns {Promise} User activation statistics
   */
  async getUserActivationStats() {
    try {
      const response = await apiService.get("/admin/users/activation-stats");

      if (response.success) {
        return {
          success: true,
          data: response.data,
        };
      }

      throw new Error("Failed to fetch user activation statistics");
    } catch (error) {
      console.error("Get user activation stats error:", error);

      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin privileges required.");
      }

      throw new Error(
        error.message || "Failed to fetch user activation statistics"
      );
    }
  },

  // ===== VENDOR MANAGEMENT APIS =====

  async getVendors(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.search && params.search.trim()) {
        queryParams.append("search", params.search.trim());
      }
      if (params.vendorType && params.vendorType !== "all") {
        queryParams.append("vendorType", params.vendorType);
      }
      if (params.verificationStatus && params.verificationStatus !== "all") {
        queryParams.append("verificationStatus", params.verificationStatus);
      }
      if (params.status && params.status !== "all") {
        queryParams.append("status", params.status);
      }
      if (params.isActive && params.isActive !== "all") {
        queryParams.append(
          "isActive",
          params.isActive === "active" ? "true" : "false"
        );
      }
      if (params.city && params.city.trim()) {
        queryParams.append("city", params.city.trim());
      }
      if (params.state && params.state.trim()) {
        queryParams.append("state", params.state.trim());
      }
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const url = `/admin/vendors${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await apiService.get(url);

      if (response.success) {
        return {
          success: true,
          data: {
            vendors: response.data.vendors || response.data || [],
            pagination: response.data.pagination || {
              page: parseInt(params.page) || 1,
              limit: parseInt(params.limit) || 10,
              total: response.data.total || 0,
              pages: Math.ceil(
                (response.data.total || 0) / (parseInt(params.limit) || 10)
              ),
              hasNext: false,
              hasPrev: false,
            },
            filters: response.data.filters || {},
            stats: response.data.stats || {},
          },
        };
      }

      throw new Error("Invalid response format from server");
    } catch (error) {
      console.error("Get vendors error:", error);

      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin privileges required.");
      } else if (error.response?.status >= 500) {
        throw new Error("Server error. Please try again later.");
      }

      throw new Error(error.message || "Failed to fetch vendors");
    }
  },

  async getVendor(vendorId) {
    try {
      const response = await apiService.get(`/admin/vendors/${vendorId}`);

      if (response.success) {
        return {
          success: true,
          data: response.data.vendor || response.data,
        };
      }

      throw new Error("Vendor not found");
    } catch (error) {
      console.error("Get vendor error:", error);

      if (error.response?.status === 404) {
        throw new Error("Vendor not found");
      }

      throw new Error(error.message || "Failed to fetch vendor details");
    }
  },

  async updateVendorStatus(vendorId, status) {
    try {
      const response = await apiService.put(
        `/admin/vendors/${vendorId}/status`,
        {
          status: status.toUpperCase(),
        }
      );

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message || "Vendor status updated successfully",
        };
      }

      throw new Error("Failed to update vendor status");
    } catch (error) {
      console.error("Update vendor status error:", error);

      if (error.response?.status === 404) {
        throw new Error("Vendor not found");
      }

      throw new Error(error.message || "Failed to update vendor status");
    }
  },

  async updateVendorVerification(vendorId, verified, rejectionReason = null) {
    try {
      const payload = { verified };

      if (!verified) {
        if (!rejectionReason || rejectionReason.trim() === "") {
          throw new Error(
            "Rejection reason is required when rejecting a vendor"
          );
        }
        payload.rejectionReason = rejectionReason.trim();
      }

      const response = await apiService.put(
        `/admin/vendors/${vendorId}/verify`,
        payload
      );

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message:
            response.message ||
            `Vendor ${verified ? "verified" : "rejected"} successfully`,
        };
      }

      throw new Error("Failed to update vendor verification");
    } catch (error) {
      console.error("Update vendor verification error:", error);

      if (error.response?.status === 404) {
        throw new Error("Vendor not found");
      } else if (error.response?.status === 400) {
        throw new Error(
          error.response.data?.message || "Invalid verification data"
        );
      }

      throw new Error(error.message || "Failed to update vendor verification");
    }
  },

  async deleteVendor(vendorId) {
    try {
      const response = await apiService.delete(`/admin/vendors/${vendorId}`);

      if (response.success) {
        return {
          success: true,
          message: response.message || "Vendor deleted successfully",
        };
      }

      throw new Error("Failed to delete vendor");
    } catch (error) {
      console.error("Delete vendor error:", error);

      if (error.response?.status === 404) {
        throw new Error("Vendor not found");
      }

      throw new Error(error.message || "Failed to delete vendor");
    }
  },

  // ===== BUYER MANAGEMENT APIS =====

  async getBuyers(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.search && params.search.trim()) {
        queryParams.append("search", params.search.trim());
      }
      if (params.status && params.status !== "all") {
        queryParams.append("status", params.status);
      }
      if (params.isActive && params.isActive !== "all") {
        queryParams.append(
          "isActive",
          params.isActive === "active" ? "true" : "false"
        );
      }
      if (params.registrationDate && params.registrationDate !== "all") {
        queryParams.append("registrationDate", params.registrationDate);
      }
      if (params.activity && params.activity !== "all") {
        queryParams.append("activity", params.activity);
      }
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const url = `/admin/buyers${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await apiService.get(url);

      if (response.success) {
        return {
          success: true,
          data: {
            buyers: response.data.buyers || response.data || [],
            pagination: response.data.pagination || {
              page: parseInt(params.page) || 1,
              limit: parseInt(params.limit) || 25,
              total: response.data.total || 0,
              pages: Math.ceil(
                (response.data.total || 0) / (parseInt(params.limit) || 25)
              ),
              hasNext: false,
              hasPrev: false,
            },
            filters: response.data.filters || {},
            stats: response.data.stats || {},
          },
        };
      }

      throw new Error("Invalid response format from server");
    } catch (error) {
      console.error("Get buyers error:", error);

      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin privileges required.");
      } else if (error.response?.status >= 500) {
        throw new Error("Server error. Please try again later.");
      }

      throw new Error(error.message || "Failed to fetch buyers");
    }
  },

  async getBuyer(buyerId) {
    try {
      const response = await apiService.get(`/admin/buyers/${buyerId}`);

      if (response.success) {
        return {
          success: true,
          data: response.data.buyer || response.data,
        };
      }

      throw new Error("Buyer not found");
    } catch (error) {
      console.error("Get buyer error:", error);

      if (error.response?.status === 404) {
        throw new Error("Buyer not found");
      }

      throw new Error(error.message || "Failed to fetch buyer details");
    }
  },

  async updateBuyerStatus(buyerId, status) {
    try {
      const response = await apiService.put(`/admin/buyers/${buyerId}/status`, {
        status: status.toUpperCase(),
      });

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message || "Buyer status updated successfully",
        };
      }

      throw new Error("Failed to update buyer status");
    } catch (error) {
      console.error("Update buyer status error:", error);

      if (error.response?.status === 404) {
        throw new Error("Buyer not found");
      }

      throw new Error(error.message || "Failed to update buyer status");
    }
  },

  async deleteBuyer(buyerId) {
    try {
      const response = await apiService.delete(`/admin/buyers/${buyerId}`);

      if (response.success) {
        return {
          success: true,
          message: response.message || "Buyer deleted successfully",
        };
      }

      throw new Error("Failed to delete buyer");
    } catch (error) {
      console.error("Delete buyer error:", error);

      if (error.response?.status === 404) {
        throw new Error("Buyer not found");
      }

      throw new Error(error.message || "Failed to delete buyer");
    }
  },

  // ===== HELPER METHODS =====

  getVendorFilterOptions() {
    return {
      vendorTypes: [
        { value: "MANUFACTURER", label: "Manufacturer" },
        { value: "WHOLESALER", label: "Wholesaler" },
        { value: "RETAILER", label: "Retailer" },
      ],
      verificationStatuses: [
        { value: "verified", label: "Verified" },
        { value: "pending", label: "Pending" },
        { value: "rejected", label: "Rejected" },
      ],
      statuses: [
        { value: "active", label: "Active" },
        { value: "blocked", label: "Blocked" },
      ],
      activationStatuses: [
        { value: "active", label: "Activated" },
        { value: "inactive", label: "Deactivated" },
      ],
      sortOptions: [
        { value: "businessName", label: "Business Name" },
        { value: "createdAt", label: "Registration Date" },
        { value: "updatedAt", label: "Last Updated" },
        { value: "city", label: "City" },
        { value: "state", label: "State" },
        { value: "isActive", label: "Activation Status" },
      ],
    };
  },

  getBuyerFilterOptions() {
    return {
      statuses: [
        { value: "active", label: "Active" },
        { value: "blocked", label: "Blocked" },
      ],
      activationStatuses: [
        { value: "active", label: "Activated" },
        { value: "inactive", label: "Deactivated" },
      ],
      registrationPeriods: [
        { value: "today", label: "Today" },
        { value: "week", label: "This Week" },
        { value: "month", label: "This Month" },
        { value: "quarter", label: "This Quarter" },
        { value: "year", label: "This Year" },
      ],
      activityLevels: [
        { value: "high", label: "High Activity" },
        { value: "medium", label: "Medium Activity" },
        { value: "low", label: "Low Activity" },
        { value: "inactive", label: "Inactive" },
      ],
      sortOptions: [
        { value: "name", label: "Name" },
        { value: "createdAt", label: "Registration Date" },
        { value: "lastLogin", label: "Last Login" },
        { value: "email", label: "Email" },
        { value: "isActive", label: "Activation Status" },
      ],
    };
  },
};

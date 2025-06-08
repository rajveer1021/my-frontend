// src/services/adminService.js - Simplified with only 3 dashboard APIs
import { apiService } from "./api";

export const adminService = {
  // ===== SIMPLIFIED DASHBOARD APIS =====

  /**
   * API 1: Get Core KPIs (Total Users, Vendors, Products, Inquiries, Platform Health)
   * @returns {Promise} Core KPIs data
   */
  async getCoreKPIs() {
    try {
      console.log("📊 Fetching core KPIs...");
      const response = await apiService.get("/admin/dashboard/core-kpis");
      
      if (response.success && response.data) {
        console.log("✅ Core KPIs fetched successfully");
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
      console.log("📈 Fetching activity metrics...");
      const response = await apiService.get("/admin/dashboard/activity-metrics");
      
      if (response.success && response.data) {
        console.log("✅ Activity metrics fetched successfully");
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
      console.log(`🔄 Fetching recent activities (limit: ${limit})...`);
      const response = await apiService.get(`/admin/dashboard/recent-activities?limit=${limit}`);
      
      if (response.success && response.data) {
        console.log("✅ Recent activities fetched successfully");
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

  /**
   * Get all dashboard data in one call for initial load
   * @returns {Promise} Complete dashboard data
   */
  async getAllDashboardData() {
    try {
      console.log("🔄 Fetching all dashboard data...");
      
      const [coreKPIs, activityMetrics, recentActivities] = await Promise.allSettled([
        this.getCoreKPIs(),
        this.getActivityMetrics(),
        this.getRecentActivities(10),
      ]);

      const result = {
        coreKPIs: coreKPIs.status === "fulfilled" ? coreKPIs.value : null,
        activityMetrics: activityMetrics.status === "fulfilled" ? activityMetrics.value : null,
        recentActivities: recentActivities.status === "fulfilled" ? recentActivities.value : { activities: [] },
        errors: {
          coreKPIs: coreKPIs.status === "rejected" ? coreKPIs.reason : null,
          activityMetrics: activityMetrics.status === "rejected" ? activityMetrics.reason : null,
          recentActivities: recentActivities.status === "rejected" ? recentActivities.reason : null,
        },
      };

      console.log("✅ Dashboard data fetch completed", result);
      return result;
    } catch (error) {
      console.error("❌ Failed to fetch dashboard data:", error);
      throw error;
    }
  },

  /**
   * Refresh dashboard data with cache busting
   * @returns {Promise} Fresh dashboard data
   */
  async refreshDashboardData() {
    try {
      console.log("🔄 Refreshing dashboard data...");
      const timestamp = Date.now();
      const [coreKPIs, activityMetrics, recentActivities] = await Promise.allSettled([
        apiService.get(`/admin/dashboard/core-kpis?_t=${timestamp}`),
        apiService.get(`/admin/dashboard/activity-metrics?_t=${timestamp}`),
        apiService.get(`/admin/dashboard/recent-activities?_t=${timestamp}&limit=10`),
      ]);

      return {
        coreKPIs: coreKPIs.status === "fulfilled" && coreKPIs.value.success ? coreKPIs.value.data : null,
        activityMetrics: activityMetrics.status === "fulfilled" && activityMetrics.value.success ? activityMetrics.value.data : null,
        recentActivities: recentActivities.status === "fulfilled" && recentActivities.value.success ? recentActivities.value.data : { activities: [] },
      };
    } catch (error) {
      console.error("❌ Failed to refresh dashboard data:", error);
      throw error;
    }
  },

  // Legacy method for backward compatibility
  async getDashboardStats() {
    try {
      console.log("📊 Fetching legacy dashboard stats...");
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
      if (params.city && params.city.trim()) {
        queryParams.append("city", params.city.trim());
      }
      if (params.state && params.state.trim()) {
        queryParams.append("state", params.state.trim());
      }
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
      if (params.dateFrom) queryParams.append("dateFrom", params.dateFrom);
      if (params.dateTo) queryParams.append("dateTo", params.dateTo);

      const url = `/admin/vendors${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      console.log("Fetching vendors from:", url);

      const response = await apiService.get(url);

      if (response.success) {
        if (response.data && response.data.vendors) {
          return {
            success: true,
            data: {
              vendors: response.data.vendors || [],
              pagination: response.data.pagination || {
                page: parseInt(params.page) || 1,
                limit: parseInt(params.limit) || 10,
                total: response.data.total || 0,
                pages: Math.ceil((response.data.total || 0) / (parseInt(params.limit) || 10)),
                hasNext: false,
                hasPrev: false,
              },
              filters: response.data.filters || {},
              stats: response.data.stats || {},
            },
          };
        }

        if (Array.isArray(response.data)) {
          return {
            success: true,
            data: {
              vendors: response.data,
              pagination: {
                page: parseInt(params.page) || 1,
                limit: parseInt(params.limit) || 10,
                total: response.data.length,
                pages: 1,
                hasNext: false,
                hasPrev: false,
              },
              filters: {},
              stats: {},
            },
          };
        }

        if (response.vendors) {
          return {
            success: true,
            data: {
              vendors: response.vendors,
              pagination: response.pagination || {
                page: parseInt(params.page) || 1,
                limit: parseInt(params.limit) || 10,
                total: response.total || response.vendors.length,
                pages: response.pages || 1,
                hasNext: response.hasNext || false,
                hasPrev: response.hasPrev || false,
              },
              filters: response.filters || {},
              stats: response.stats || {},
            },
          };
        }
      }

      throw new Error("Invalid response format from server");
    } catch (error) {
      console.error("Get vendors error:", error);

      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin privileges required.");
      } else if (error.response?.status === 404) {
        throw new Error("Vendors endpoint not found.");
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
      const response = await apiService.put(`/admin/vendors/${vendorId}/status`, {
        status: status.toUpperCase(),
      });

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
      if (!verified && rejectionReason) {
        payload.rejectionReason = rejectionReason;
      }

      const response = await apiService.put(`/admin/vendors/${vendorId}/verify`, payload);

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message || `Vendor ${verified ? "verified" : "unverified"} successfully`,
        };
      }

      throw new Error("Failed to update vendor verification");
    } catch (error) {
      console.error("Update vendor verification error:", error);

      if (error.response?.status === 404) {
        throw new Error("Vendor not found");
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
      if (params.registrationDate && params.registrationDate !== "all") {
        queryParams.append("registrationDate", params.registrationDate);
      }
      if (params.activity && params.activity !== "all") {
        queryParams.append("activity", params.activity);
      }
      if (params.city && params.city.trim()) {
        queryParams.append("city", params.city.trim());
      }
      if (params.state && params.state.trim()) {
        queryParams.append("state", params.state.trim());
      }
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
      if (params.dateFrom) queryParams.append("dateFrom", params.dateFrom);
      if (params.dateTo) queryParams.append("dateTo", params.dateTo);

      const url = `/admin/buyers${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      console.log("Fetching buyers from:", url);

      const response = await apiService.get(url);

      if (response.success) {
        if (response.data && response.data.buyers) {
          return {
            success: true,
            data: {
              buyers: response.data.buyers || [],
              pagination: response.data.pagination || {
                page: parseInt(params.page) || 1,
                limit: parseInt(params.limit) || 25,
                total: response.data.total || 0,
                pages: Math.ceil((response.data.total || 0) / (parseInt(params.limit) || 25)),
                hasNext: false,
                hasPrev: false,
              },
              filters: response.data.filters || {},
              stats: response.data.stats || {},
            },
          };
        }

        if (Array.isArray(response.data)) {
          return {
            success: true,
            data: {
              buyers: response.data,
              pagination: {
                page: parseInt(params.page) || 1,
                limit: parseInt(params.limit) || 25,
                total: response.data.length,
                pages: 1,
                hasNext: false,
                hasPrev: false,
              },
              filters: {},
              stats: {},
            },
          };
        }

        if (response.buyers) {
          return {
            success: true,
            data: {
              buyers: response.buyers,
              pagination: response.pagination || {
                page: parseInt(params.page) || 1,
                limit: parseInt(params.limit) || 25,
                total: response.total || response.buyers.length,
                pages: response.pages || 1,
                hasNext: response.hasNext || false,
                hasPrev: response.hasPrev || false,
              },
              filters: response.filters || {},
              stats: response.stats || {},
            },
          };
        }
      }

      throw new Error("Invalid response format from server");
    } catch (error) {
      console.error("Get buyers error:", error);

      if (error.response?.status === 401) {
        throw new Error("Authentication required. Please login again.");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied. Admin privileges required.");
      } else if (error.response?.status === 404) {
        throw new Error("Buyers endpoint not found.");
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

  // ===== USER MANAGEMENT APIS =====

  async getUsers(params = {}) {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);
      if (params.search && params.search.trim()) {
        queryParams.append("search", params.search.trim());
      }
      if (params.accountType && params.accountType !== "all") {
        queryParams.append("accountType", params.accountType);
      }
      if (params.status && params.status !== "all") {
        queryParams.append("status", params.status);
      }
      if (params.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const url = `/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
      const response = await apiService.get(url);

      if (response.success && response.data) {
        return {
          success: true,
          data: {
            users: response.data.users || response.data,
            pagination: response.data.pagination || {
              page: parseInt(params.page) || 1,
              limit: parseInt(params.limit) || 20,
              total: response.data.total || 0,
              pages: Math.ceil((response.data.total || 0) / (parseInt(params.limit) || 20)),
              hasNext: false,
              hasPrev: false,
            },
          },
        };
      }

      throw new Error("Invalid response format");
    } catch (error) {
      console.error("Get users error:", error);
      throw new Error(error.message || "Failed to fetch users");
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
      sortOptions: [
        { value: "businessName", label: "Business Name" },
        { value: "createdAt", label: "Registration Date" },
        { value: "updatedAt", label: "Last Updated" },
        { value: "city", label: "City" },
        { value: "state", label: "State" },
      ],
    };
  },

  getBuyerFilterOptions() {
    return {
      statuses: [
        { value: "active", label: "Active" },
        { value: "blocked", label: "Blocked" },
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
      ],
    };
  },
};
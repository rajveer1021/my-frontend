// src/services/inquiryService.js - Fixed  statements
import { apiService } from "./api";

export const inquiryService = {
  // Get vendor's inquiries with filters and pagination
  async getInquiries(params = {}) {
    try {
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 10,
        ...params,
      };

      // Add status filter if provided
      if (params.status) {
        queryParams.status = params.status.toUpperCase();
      }

      // Add search filter if provided
      if (params.search?.trim()) {
        queryParams.search = params.search.trim();
      }

      const response = await apiService.get("/inquiries/vendor", queryParams);
      (response);

      if (response.success && response.data) {
        // Transform API response to match frontend structure
        const inquiries = (response.data.inquiries || []).map((inquiry) => ({
          id: inquiry.id,
          message: inquiry.message,
          status: inquiry.status.toLowerCase(),
          productId: inquiry.productId,
          productName: inquiry.product?.name,
          buyerId: inquiry.buyerId,
          buyerName: `${inquiry.buyer?.firstName || ""} ${
            inquiry.buyer?.lastName || ""
          }`.trim(),
          buyerEmail: inquiry.buyer?.email,
          createdAt: inquiry.createdAt,
          updatedAt: inquiry.updatedAt,
        }));

        return {
          success: true,
          data: {
            inquiries,
            pagination: response.data.pagination || {
              page: 1,
              limit: 10,
              total: inquiries.length,
              pages: 1,
            },
          },
        };
      }

      throw new Error("Invalid response format");
    } catch (error) {
      console.error("Get inquiries error:", error);
      throw new Error(error.message || "Failed to fetch inquiries");
    }
  },

  // Get recent inquiries (default to OPEN status)
  async getRecentInquiries(limit = 5) {
    try {
      const response = await this.getInquiries({
        page: 1,
        limit,
        status: "OPEN",
      });

      return response.data.inquiries || [];
    } catch (error) {
      console.error("Get recent inquiries error:", error);
      return [];
    }
  },

  // Update inquiry status
  async updateInquiryStatus(inquiryId, status) {
    try {
      const validStatuses = ["OPEN", "CLOSED", "RESPONDED"];
      const statusUpper = status.toUpperCase();

      if (!validStatuses.includes(statusUpper)) {
        throw new Error(
          `Invalid status. Must be one of: ${validStatuses.join(", ")}`
        );
      }

      const response = await apiService.put(`/inquiries/${inquiryId}/status`, {
        status: statusUpper,
      });

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message || "Inquiry status updated successfully",
        };
      }

      throw new Error("Failed to update inquiry status");
    } catch (error) {
      console.error("Update inquiry status error:", error);
      throw new Error(error.message || "Failed to update inquiry status");
    }
  },

  // Mark inquiry as responded
  async markAsResponded(inquiryId) {
    return this.updateInquiryStatus(inquiryId, "RESPONDED");
  },

  // Close inquiry
  async closeInquiry(inquiryId) {
    return this.updateInquiryStatus(inquiryId, "CLOSED");
  },

  // Reopen inquiry
  async reopenInquiry(inquiryId) {
    return this.updateInquiryStatus(inquiryId, "OPEN");
  },

  // Check if inquiry is new (created within last 24 hours)
  isNewInquiry(createdAt) {
    try {
      const inquiryDate = new Date(createdAt);
      const now = new Date();
      const diffHours = (now - inquiryDate) / (1000 * 60 * 60);
      return diffHours <= 24;
    } catch {
      return false;
    }
  },

  // Get status badge color for UI
  getStatusBadgeColor(status) {
    const statusColors = {
      open: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      responded: "bg-blue-100 text-blue-800 border-blue-200",
      closed: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return statusColors[status.toLowerCase()] || statusColors["pending"];
  },

  // Get status display text
  getStatusDisplayText(status) {
    const statusTexts = {
      open: "Open",
      pending: "Pending",
      responded: "Responded",
      closed: "Closed",
    };

    return statusTexts[status.toLowerCase()] || "Unknown";
  },
};

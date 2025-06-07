// src/services/adminService.js
import { apiService } from './api';

export const adminService = {
  // ===== DASHBOARD APIS =====
  
  // Get admin dashboard statistics
  async getDashboardStats() {
    try {
      const response = await apiService.get('/admin/dashboard/stats');
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Get admin dashboard stats error:', error);
      throw new Error(error.message || 'Failed to fetch dashboard statistics');
    }
  },

  // ===== VENDOR MANAGEMENT APIS =====
  
  // Get vendors with advanced filtering and pagination
  async getVendors(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add search parameter
      if (params.search && params.search.trim()) {
        queryParams.append('search', params.search.trim());
      }
      
      // Add filter parameters
      if (params.vendorType && params.vendorType !== 'all') {
        queryParams.append('vendorType', params.vendorType);
      }
      
      if (params.verificationStatus && params.verificationStatus !== 'all') {
        queryParams.append('verificationStatus', params.verificationStatus);
      }
      
      if (params.status && params.status !== 'all') {
        queryParams.append('status', params.status);
      }
      
      if (params.city && params.city.trim()) {
        queryParams.append('city', params.city.trim());
      }
      
      if (params.state && params.state.trim()) {
        queryParams.append('state', params.state.trim());
      }
      
      if (params.sortBy) {
        queryParams.append('sortBy', params.sortBy);
      }
      
      if (params.sortOrder) {
        queryParams.append('sortOrder', params.sortOrder);
      }
      
      if (params.dateFrom) {
        queryParams.append('dateFrom', params.dateFrom);
      }
      
      if (params.dateTo) {
        queryParams.append('dateTo', params.dateTo);
      }

      const url = `/admin/vendors${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('Fetching vendors from:', url);
      
      const response = await apiService.get(url);
      
      // Handle different possible response formats
      if (response.success) {
        // If response has the expected structure
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
                hasPrev: false
              },
              filters: response.data.filters || {},
              stats: response.data.stats || {}
            }
          };
        }
        
        // If response data is directly an array (simpler format)
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
                hasPrev: false
              },
              filters: {},
              stats: {}
            }
          };
        }
        
        // If response is the vendors array directly
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
                hasPrev: response.hasPrev || false
              },
              filters: response.filters || {},
              stats: response.stats || {}
            }
          };
        }
      }
      
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Get vendors error:', error);
      
      // Check if it's a network error
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please login again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      } else if (error.response?.status === 404) {
        throw new Error('Vendors endpoint not found.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      throw new Error(error.message || 'Failed to fetch vendors');
    }
  },

  // Get single vendor details
  async getVendor(vendorId) {
    try {
      const response = await apiService.get(`/admin/vendors/${vendorId}`);
      
      if (response.success) {
        return {
          success: true,
          data: response.data.vendor || response.data
        };
      }
      
      throw new Error('Vendor not found');
    } catch (error) {
      console.error('Get vendor error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Vendor not found');
      }
      
      throw new Error(error.message || 'Failed to fetch vendor details');
    }
  },

  // Update vendor status (active, blocked, suspended)
  async updateVendorStatus(vendorId, status) {
    try {
      const response = await apiService.put(`/admin/vendors/${vendorId}/status`, {
        status: status.toUpperCase()
      });

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message || 'Vendor status updated successfully'
        };
      }

      throw new Error('Failed to update vendor status');
    } catch (error) {
      console.error('Update vendor status error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Vendor not found');
      }
      
      throw new Error(error.message || 'Failed to update vendor status');
    }
  },

  // Update vendor verification status
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
          message: response.message || `Vendor ${verified ? 'verified' : 'unverified'} successfully`
        };
      }

      throw new Error('Failed to update vendor verification');
    } catch (error) {
      console.error('Update vendor verification error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Vendor not found');
      }
      
      throw new Error(error.message || 'Failed to update vendor verification');
    }
  },

  // Delete vendor account
  async deleteVendor(vendorId) {
    try {
      const response = await apiService.delete(`/admin/vendors/${vendorId}`);

      if (response.success) {
        return {
          success: true,
          message: response.message || 'Vendor deleted successfully'
        };
      }

      throw new Error('Failed to delete vendor');
    } catch (error) {
      console.error('Delete vendor error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Vendor not found');
      }
      
      throw new Error(error.message || 'Failed to delete vendor');
    }
  },

  // ===== BUYER MANAGEMENT APIS =====
  
  // Get buyers with filtering and pagination
  async getBuyers(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination parameters
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add search parameter
      if (params.search && params.search.trim()) {
        queryParams.append('search', params.search.trim());
      }
      
      // Add filter parameters
      if (params.status && params.status !== 'all') {
        queryParams.append('status', params.status);
      }
      
      if (params.registrationDate && params.registrationDate !== 'all') {
        queryParams.append('registrationDate', params.registrationDate);
      }
      
      if (params.activity && params.activity !== 'all') {
        queryParams.append('activity', params.activity);
      }
      
      if (params.city && params.city.trim()) {
        queryParams.append('city', params.city.trim());
      }
      
      if (params.state && params.state.trim()) {
        queryParams.append('state', params.state.trim());
      }
      
      if (params.sortBy) {
        queryParams.append('sortBy', params.sortBy);
      }
      
      if (params.sortOrder) {
        queryParams.append('sortOrder', params.sortOrder);
      }
      
      if (params.dateFrom) {
        queryParams.append('dateFrom', params.dateFrom);
      }
      
      if (params.dateTo) {
        queryParams.append('dateTo', params.dateTo);
      }

      const url = `/admin/buyers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('Fetching buyers from:', url);
      
      const response = await apiService.get(url);
      
      if (response.success) {
        // Handle different possible response formats
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
                hasPrev: false
              },
              filters: response.data.filters || {},
              stats: response.data.stats || {}
            }
          };
        }
        
        // If response data is directly an array
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
                hasPrev: false
              },
              filters: {},
              stats: {}
            }
          };
        }
        
        // If response is the buyers array directly
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
                hasPrev: response.hasPrev || false
              },
              filters: response.filters || {},
              stats: response.stats || {}
            }
          };
        }
      }
      
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Get buyers error:', error);
      
      // Check if it's a network error
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please login again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      } else if (error.response?.status === 404) {
        throw new Error('Buyers endpoint not found.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      throw new Error(error.message || 'Failed to fetch buyers');
    }
  },

  // Get single buyer details
  async getBuyer(buyerId) {
    try {
      const response = await apiService.get(`/admin/buyers/${buyerId}`);
      
      if (response.success) {
        return {
          success: true,
          data: response.data.buyer || response.data
        };
      }
      
      throw new Error('Buyer not found');
    } catch (error) {
      console.error('Get buyer error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Buyer not found');
      }
      
      throw new Error(error.message || 'Failed to fetch buyer details');
    }
  },

  // Update buyer status (active, blocked, suspended)
  async updateBuyerStatus(buyerId, status) {
    try {
      const response = await apiService.put(`/admin/buyers/${buyerId}/status`, {
        status: status.toUpperCase()
      });

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message || 'Buyer status updated successfully'
        };
      }

      throw new Error('Failed to update buyer status');
    } catch (error) {
      console.error('Update buyer status error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Buyer not found');
      }
      
      throw new Error(error.message || 'Failed to update buyer status');
    }
  },

  // Delete buyer account
  async deleteBuyer(buyerId) {
    try {
      const response = await apiService.delete(`/admin/buyers/${buyerId}`);

      if (response.success) {
        return {
          success: true,
          message: response.message || 'Buyer deleted successfully'
        };
      }

      throw new Error('Failed to delete buyer');
    } catch (error) {
      console.error('Delete buyer error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Buyer not found');
      }
      
      throw new Error(error.message || 'Failed to delete buyer');
    }
  },

  // ===== USER MANAGEMENT APIS =====
  
  // Get all users (generic endpoint)
  async getUsers(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search && params.search.trim()) {
        queryParams.append('search', params.search.trim());
      }
      if (params.accountType && params.accountType !== 'all') {
        queryParams.append('accountType', params.accountType);
      }
      if (params.status && params.status !== 'all') {
        queryParams.append('status', params.status);
      }
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = `/admin/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
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
              hasPrev: false
            }
          }
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Get users error:', error);
      throw new Error(error.message || 'Failed to fetch users');
    }
  },

  // ===== VERIFICATION APIS =====
  
  // Get vendor verification submissions
  async getVendorSubmissions(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search && params.search.trim()) {
        queryParams.append('search', params.search.trim());
      }
      if (params.status && params.status !== 'all') {
        queryParams.append('status', params.status);
      }
      if (params.verificationType && params.verificationType !== 'all') {
        queryParams.append('verificationType', params.verificationType);
      }
      if (params.vendorType && params.vendorType !== 'all') {
        queryParams.append('vendorType', params.vendorType);
      }
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const url = `/admin/vendor-submissions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: {
            submissions: response.data.submissions || [],
            pagination: response.data.pagination || {
              page: parseInt(params.page) || 1,
              limit: parseInt(params.limit) || 20,
              total: response.data.total || 0,
              pages: Math.ceil((response.data.total || 0) / (parseInt(params.limit) || 20)),
              hasNext: false,
              hasPrev: false
            }
          }
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Get vendor submissions error:', error);
      throw new Error(error.message || 'Failed to fetch vendor submissions');
    }
  },

  // Approve vendor submission
  async approveVendorSubmission(submissionId) {
    try {
      const response = await apiService.put(`/admin/vendor-submissions/${submissionId}/approve`);

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message || 'Vendor submission approved successfully'
        };
      }

      throw new Error('Failed to approve vendor submission');
    } catch (error) {
      console.error('Approve vendor submission error:', error);
      throw new Error(error.message || 'Failed to approve vendor submission');
    }
  },

  // Reject vendor submission
  async rejectVendorSubmission(submissionId, reason = '') {
    try {
      const response = await apiService.put(`/admin/vendor-submissions/${submissionId}/reject`, {
        reason
      });

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message || 'Vendor submission rejected'
        };
      }

      throw new Error('Failed to reject vendor submission');
    } catch (error) {
      console.error('Reject vendor submission error:', error);
      throw new Error(error.message || 'Failed to reject vendor submission');
    }
  },

  // ===== ANALYTICS APIS =====
  
  // Get admin analytics
  async getAnalytics(period = '30d') {
    try {
      const response = await apiService.get('/admin/analytics', { period });
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Get analytics error:', error);
      throw new Error(error.message || 'Failed to fetch analytics');
    }
  },

  // Export data
  async exportData(type, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      queryParams.append('format', params.format || 'csv');
      if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
      if (params.dateTo) queryParams.append('dateTo', params.dateTo);
      
      // Add any additional filter parameters
      if (params.filters) {
        Object.entries(params.filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
      }

      const url = `/admin/export/${type}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(url);
      
      if (response.success) {
        return {
          success: true,
          data: response.data,
          downloadUrl: response.downloadUrl
        };
      }
      
      throw new Error('Export failed');
    } catch (error) {
      console.error('Export data error:', error);
      throw new Error(error.message || 'Failed to export data');
    }
  },

  // ===== HELPER METHODS =====

  // Get available filter options for vendors
  getVendorFilterOptions() {
    return {
      vendorTypes: [
        { value: 'MANUFACTURER', label: 'Manufacturer' },
        { value: 'WHOLESALER', label: 'Wholesaler' },
        { value: 'RETAILER', label: 'Retailer' }
      ],
      verificationStatuses: [
        { value: 'verified', label: 'Verified' },
        { value: 'pending', label: 'Pending' },
        { value: 'rejected', label: 'Rejected' },
      ],
      statuses: [
        { value: 'active', label: 'Active' },
        { value: 'blocked', label: 'Blocked' },
      ],
      sortOptions: [
        { value: 'businessName', label: 'Business Name' },
        { value: 'createdAt', label: 'Registration Date' },
        { value: 'updatedAt', label: 'Last Updated' },
        { value: 'city', label: 'City' },
        { value: 'state', label: 'State' }
      ]
    };
  },

  // Get available filter options for buyers
  getBuyerFilterOptions() {
    return {
      statuses: [
        { value: 'active', label: 'Active' },
        { value: 'blocked', label: 'Blocked' },
        { value: 'suspended', label: 'Suspended' }
      ],
      registrationPeriods: [
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
        { value: 'quarter', label: 'This Quarter' },
        { value: 'year', label: 'This Year' }
      ],
      activityLevels: [
        { value: 'high', label: 'High Activity' },
        { value: 'medium', label: 'Medium Activity' },
        { value: 'low', label: 'Low Activity' },
        { value: 'inactive', label: 'Inactive' }
      ],
      sortOptions: [
        { value: 'name', label: 'Name' },
        { value: 'createdAt', label: 'Registration Date' },
        { value: 'lastLogin', label: 'Last Login' },
        { value: 'email', label: 'Email' }
      ]
    };
  }
};
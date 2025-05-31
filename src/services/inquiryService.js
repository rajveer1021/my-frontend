// src/services/inquiryService.js
import { apiService } from './api';

export const inquiryService = {
  // Get vendor's inquiries with filters and pagination
  async getInquiries(params = {}) {
    try {
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 10,
        ...params
      };

      // Add status filter if provided
      if (params.status) {
        queryParams.status = params.status.toUpperCase();
      }

      // Add search filter if provided
      if (params.search?.trim()) {
        queryParams.search = params.search.trim();
      }

      console.log('Fetching inquiries with params:', queryParams);
      
      const response = await apiService.get('/inquiries/vendor', queryParams);
      
      if (response.success && response.data) {
        // Transform API response to match frontend structure
        const inquiries = (response.data.inquiries || []).map(inquiry => ({
          id: inquiry.id,
          name: inquiry.customerName || inquiry.name || 'Unknown Customer',
          buyerName: inquiry.customerName || inquiry.name || 'Unknown Customer',
          email: inquiry.customerEmail || inquiry.email,
          buyerEmail: inquiry.customerEmail || inquiry.email,
          customerEmail: inquiry.customerEmail || inquiry.email,
          phone: inquiry.customerPhone || inquiry.phone,
          message: inquiry.message || inquiry.inquiry || 'No message provided',
          productName: inquiry.productName,
          productId: inquiry.productId,
          status: inquiry.status ? inquiry.status.toLowerCase() : 'pending',
          date: new Date(inquiry.createdAt).toLocaleDateString(),
          createdAt: inquiry.createdAt,
          updatedAt: inquiry.updatedAt,
          isNew: this.isNewInquiry(inquiry.createdAt)
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
              hasNext: false,
              hasPrev: false
            }
          }
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Get inquiries error:', error);
      throw new Error(error.message || 'Failed to fetch inquiries');
    }
  },

  // Get recent inquiries (default to OPEN status)
  async getRecentInquiries(limit = 5) {
    try {
      const response = await this.getInquiries({ 
        page: 1, 
        limit,
        status: 'OPEN' // Only get open inquiries for recent list
      });
      
      return response.data.inquiries || [];
    } catch (error) {
      console.error('Get recent inquiries error:', error);
      return [];
    }
  },

  // Update inquiry status
  async updateInquiryStatus(inquiryId, status) {
    try {
      const validStatuses = ['OPEN', 'CLOSED', 'RESPONDED'];
      const statusUpper = status.toUpperCase();
      
      if (!validStatuses.includes(statusUpper)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      console.log(`Updating inquiry ${inquiryId} status to ${statusUpper}`);
      
      const response = await apiService.put(`/inquiries/${inquiryId}/status`, {
        status: statusUpper
      });
      
      if (response.success) {
        console.log('Inquiry status updated successfully:', response);
        return {
          success: true,
          data: response.data,
          message: response.message || 'Inquiry status updated successfully'
        };
      }
      
      throw new Error('Failed to update inquiry status');
    } catch (error) {
      console.error('Update inquiry status error:', error);
      throw new Error(error.message || 'Failed to update inquiry status');
    }
  },

  // Mark inquiry as responded
  async markAsResponded(inquiryId) {
    return this.updateInquiryStatus(inquiryId, 'RESPONDED');
  },

  // Close inquiry
  async closeInquiry(inquiryId) {
    return this.updateInquiryStatus(inquiryId, 'CLOSED');
  },

  // Reopen inquiry
  async reopenInquiry(inquiryId) {
    return this.updateInquiryStatus(inquiryId, 'OPEN');
  },

  // Get inquiry statistics
  async getInquiryStats() {
    try {
      // Try to get stats from a dedicated endpoint if available
      try {
        const response = await apiService.get('/inquiries/vendor/stats');
        if (response.success && response.data) {
          return {
            total: response.data.total || 0,
            open: response.data.open || 0,
            closed: response.data.closed || 0,
            responded: response.data.responded || 0,
            pending: response.data.pending || response.data.open || 0,
            new: response.data.new || 0
          };
        }
      } catch (statsError) {
        console.log('Stats endpoint not available, calculating from inquiries');
      }
      
      // Fallback: Calculate stats from inquiries
      const [openInquiries, allInquiries] = await Promise.all([
        this.getInquiries({ limit: 100, status: 'OPEN' }),
        this.getInquiries({ limit: 100 })
      ]);
      
      const open = openInquiries.data.inquiries.length;
      const total = allInquiries.data.inquiries.length;
      const closed = allInquiries.data.inquiries.filter(i => i.status === 'closed').length;
      const responded = allInquiries.data.inquiries.filter(i => i.status === 'responded').length;
      const newCount = allInquiries.data.inquiries.filter(i => i.isNew).length;
      
      return {
        total,
        open,
        closed,
        responded,
        pending: open,
        new: newCount
      };
    } catch (error) {
      console.error('Get inquiry stats error:', error);
      return {
        total: 0,
        open: 0,
        closed: 0,
        responded: 0,
        pending: 0,
        new: 0
      };
    }
  },

  // Send response to inquiry (if API supports it)
  async respondToInquiry(inquiryId, responseMessage) {
    try {
      const response = await apiService.post(`/inquiries/${inquiryId}/respond`, {
        response: responseMessage
      });
      
      if (response.success) {
        // Also update status to RESPONDED
        await this.updateInquiryStatus(inquiryId, 'RESPONDED');
        
        return {
          success: true,
          data: response.data,
          message: response.message || 'Response sent successfully'
        };
      }
      
      throw new Error('Failed to send response');
    } catch (error) {
      console.error('Respond to inquiry error:', error);
      throw new Error(error.message || 'Failed to send response');
    }
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
      'open': 'bg-green-100 text-green-800 border-green-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'responded': 'bg-blue-100 text-blue-800 border-blue-200',
      'closed': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return statusColors[status.toLowerCase()] || statusColors['pending'];
  },

  // Get status display text
  getStatusDisplayText(status) {
    const statusTexts = {
      'open': 'Open',
      'pending': 'Pending',
      'responded': 'Responded',
      'closed': 'Closed'
    };
    
    return statusTexts[status.toLowerCase()] || 'Unknown';
  }
};
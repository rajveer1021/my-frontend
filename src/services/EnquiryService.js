import { apiService } from './api';

export const productService = {
  // Get vendor's products with optional filters and pagination
  async getProducts(filters = {}) {
    try {
      const params = {};
      
      // Add pagination params
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      
      // Add search params
      if (filters.search) params.search = filters.search;
      if (filters.category && filters.category !== 'all') params.category = filters.category;
      
      // Add sorting params
      if (filters.sort) params.sort = filters.sort;
      
      const response = await apiService.get('/products', params);
      
      if (response.success && response.data) {
        // Transform API response to match frontend structure
        const products = response.data.products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          categories: [product.category], // For compatibility with existing components
          stock: product.stock,
          status: this.getStockStatus(product.stock),
          image: product.images && product.images.length > 0 
            ? product.images[0] 
            : 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
          uploadDate: new Date(product.createdAt).toLocaleDateString(),
          isActive: product.isActive,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt
        }));

        return {
          products,
          pagination: response.data.pagination
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Get products error:', error);
      throw new Error(error.message || 'Failed to fetch products');
    }
  },

  // Get stock status based on stock number
  getStockStatus(stock) {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 10) return 'Low Stock';
    return 'In Stock';
  }
};

export const enquiryService = {
  // Get vendor's inquiries with optional filters and pagination
  async getInquiries(filters = {}) {
    try {
      const params = {};
      
      // Add pagination params
      if (filters.page) params.page = filters.page;
      if (filters.limit) params.limit = filters.limit;
      
      // Add search/filter params if needed
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;
      
      const response = await apiService.get('/inquiries/vendor', params);
      
      if (response.success && response.data) {
        // Transform API response to match frontend structure
        const inquiries = response.data.inquiries.map(inquiry => ({
          id: inquiry.id,
          name: inquiry.customerName || inquiry.name || 'Unknown Customer',
          email: inquiry.customerEmail || inquiry.email,
          phone: inquiry.customerPhone || inquiry.phone,
          message: inquiry.message || inquiry.inquiry,
          productName: inquiry.productName,
          productId: inquiry.productId,
          status: inquiry.status || 'pending',
          date: new Date(inquiry.createdAt).toLocaleDateString(),
          createdAt: inquiry.createdAt,
          updatedAt: inquiry.updatedAt,
          isNew: this.isNewInquiry(inquiry.createdAt)
        }));

        return {
          inquiries,
          pagination: response.data.pagination
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Get inquiries error:', error);
      throw new Error(error.message || 'Failed to fetch inquiries');
    }
  },

  // Get recent inquiries (last 5)
  async getRecentInquiries() {
    try {
      const response = await this.getInquiries({ 
        page: 1, 
        limit: 5 
      });
      return response.inquiries;
    } catch (error) {
      console.error('Get recent inquiries error:', error);
      return [];
    }
  },

  // Get inquiry statistics
  async getInquiryStats() {
    try {
      const response = await apiService.get('/inquiries/vendor/stats');
      
      if (response.success && response.data) {
        return {
          total: response.data.total || 0,
          pending: response.data.pending || 0,
          responded: response.data.responded || 0,
          new: response.data.new || 0
        };
      }
      
      // If stats endpoint doesn't exist, calculate from inquiries
      const inquiriesResponse = await this.getInquiries({ limit: 100 });
      const inquiries = inquiriesResponse.inquiries;
      
      return {
        total: inquiries.length,
        pending: inquiries.filter(i => i.status === 'pending').length,
        responded: inquiries.filter(i => i.status === 'responded').length,
        new: inquiries.filter(i => i.isNew).length
      };
    } catch (error) {
      console.error('Get inquiry stats error:', error);
      return {
        total: 0,
        pending: 0,
        responded: 0,
        new: 0
      };
    }
  },

  // Update inquiry status
  async updateInquiryStatus(inquiryId, status) {
    try {
      const response = await apiService.put(`/inquiries/${inquiryId}/status`, {
        status
      });
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error('Failed to update inquiry status');
    } catch (error) {
      console.error('Update inquiry status error:', error);
      throw new Error(error.message || 'Failed to update inquiry status');
    }
  },

  // Respond to inquiry
  async respondToInquiry(inquiryId, responseMessage) {
    try {
      const response = await apiService.post(`/inquiries/${inquiryId}/respond`, {
        response: responseMessage
      });
      
      if (response.success) {
        return response.data;
      }
      
      throw new Error('Failed to send response');
    } catch (error) {
      console.error('Respond to inquiry error:', error);
      throw new Error(error.message || 'Failed to send response');
    }
  },

  // Check if inquiry is new (created within last 24 hours)
  isNewInquiry(createdAt) {
    const inquiryDate = new Date(createdAt);
    const now = new Date();
    const diffHours = (now - inquiryDate) / (1000 * 60 * 60);
    return diffHours <= 24;
  }
};
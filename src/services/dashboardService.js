// src/services/dashboardService.js
import { apiService } from './api';

export const dashboardService = {
  // Get dashboard statistics
  async getDashboardStats() {
    try {
      const response = await apiService.get('/dashboard/stats');
      
      if (response.success && response.data) {
        return {
          totalProducts: response.data.totalProducts || 0,
          totalInquiries: response.data.totalInquiries || 0,
          inStock: response.data.inStock || 0,
          lowStock: response.data.lowStock || 0,
          outOfStock: response.data.outOfStock || 0,
          isProfileVerified: response.data.isProfileVerified || false,
          // Calculate additional metrics
          inventoryValue: response.data.inventoryValue || 0,
          monthlyVisitors: response.data.monthlyVisitors || 0,
          profileCompletionPercentage: response.data.isProfileVerified ? 100 : 75
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw new Error(error.message || 'Failed to fetch dashboard statistics');
    }
  },

  // Get recent inquiries for dashboard (delegate to inquiry service)
  async getRecentInquiries(limit = 5) {
    try {
      // Import inquiry service dynamically to avoid circular dependency
      const { inquiryService } = await import('./inquiryService');
      return await inquiryService.getRecentInquiries(limit);
    } catch (error) {
      console.error('Get recent inquiries error:', error);
      // Return empty array on error to avoid breaking the dashboard
      return [];
    }
  },

  // Get recent products for dashboard
  async getRecentProducts(limit = 6) {
    try {
      const response = await apiService.get('/products', { 
        page: 1, 
        limit,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      if (response.success && response.data) {
        // Transform API response to match frontend structure
        const products = response.data.products.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          categories: [product.category],
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

        return products;
      }
      
      return [];
    } catch (error) {
      console.error('Get recent products error:', error);
      // Return empty array on error to avoid breaking the dashboard
      return [];
    }
  },

  // Helper method to determine stock status
  getStockStatus(stock) {
    if (stock === 0) {
      return 'Out of Stock';
    } else if (stock <= 10) {
      return 'Low Stock';
    } else {
      return 'In Stock';
    }
  },

  // Check if inquiry is new (created within last 24 hours)
  isNewInquiry(createdAt) {
    const inquiryDate = new Date(createdAt);
    const now = new Date();
    const diffHours = (now - inquiryDate) / (1000 * 60 * 60);
    return diffHours <= 24;
  },

  // Calculate trends (you can enhance this with historical data)
  calculateTrend(current, previous = 0) {
    if (previous === 0) return '+0%';
    const change = ((current - previous) / previous) * 100;
    return `${change >= 0 ? '+' : ''}${change.toFixed(0)}%`;
  },

  // Get stock overview data formatted for StockOverview component
  getStockOverview(stats) {
    return {
      inStock: stats.inStock || 0,
      lowStock: stats.lowStock || 0,
      outOfStock: stats.outOfStock || 0
    };
  }
};
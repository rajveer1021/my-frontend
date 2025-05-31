// src/services/productService.js - Updated with real API integration
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

  // Get single product by ID
  async getProduct(id) {
    try {
      const response = await apiService.get(`/products/${id}`);
      
      if (response.success && response.data) {
        const product = response.data;
        
        // Transform API response to match frontend structure
        return {
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
        };
      }
      
      throw new Error('Product not found');
    } catch (error) {
      console.error('Get product error:', error);
      throw new Error(error.message || 'Failed to fetch product');
    }
  },

  // Create new product
  async createProduct(productData) {
    try {
      const payload = {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        category: productData.category,
        stock: parseInt(productData.stock) || 0
      };

      const response = await apiService.post('/products', payload);
      
      if (response.success && response.data) {
        const product = response.data;
        
        // Transform API response to match frontend structure
        return {
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
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Create product error:', error);
      throw new Error(error.message || 'Failed to create product');
    }
  },

  // Update existing product
  async updateProduct(id, productData) {
    try {
      const payload = {
        name: productData.name,
        description: productData.description,
        price: parseFloat(productData.price),
        stock: parseInt(productData.stock) || 0
      };

      // Only include category if it's provided and different
      if (productData.category) {
        payload.category = productData.category;
      }

      const response = await apiService.put(`/products/${id}`, payload);
      
      if (response.success && response.data) {
        const product = response.data;
        
        // Transform API response to match frontend structure
        return {
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
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Update product error:', error);
      throw new Error(error.message || 'Failed to update product');
    }
  },

  // Delete product
  async deleteProduct(id) {
    try {
      const response = await apiService.delete(`/products/${id}`);
      
      if (response.success) {
        return true;
      }
      
      throw new Error('Failed to delete product');
    } catch (error) {
      console.error('Delete product error:', error);
      throw new Error(error.message || 'Failed to delete product');
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

  // Get product categories (can be enhanced to fetch from API if needed)
  async getCategories() {
    // For now, return static categories. You can make this dynamic by adding an API endpoint
    return [
      'Electronics',
      'Computers',
      'IoT',
      'Infrastructure',
      'Cable Management', 
      'Tools',
      'Industrial Equipment',
      'Machinery',
      'Automation',
      'Sensors'
    ];
  }
};
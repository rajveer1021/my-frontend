// src/services/productService.js - Updated with search API integration
import { apiService } from './api';

export const productService = {
  // Search products with filters, pagination, and sorting
  async searchProducts(params = {}) {
    try {
      const queryParams = {};
      
      // Add pagination params
      if (params.page) queryParams.page = params.page;
      if (params.limit) queryParams.limit = params.limit;
      
      // Add search params
      if (params.search?.trim()) queryParams.search = params.search.trim();
      if (params.category) queryParams.category = params.category;
      
      // Add sorting params
      if (params.sortBy) queryParams.sortBy = params.sortBy;
      if (params.sortOrder) queryParams.sortOrder = params.sortOrder;
      
      ('Product search params:', queryParams);
      
      const response = await apiService.get('/vendor/products/search', queryParams);
      
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
          success: true,
          data: {
            products,
            availableCategories: response.data.availableCategories || [],
            filters: response.data.filters || {},
            pagination: response.data.pagination || {
              page: 1,
              limit: 10,
              total: 0,
              pages: 1,
              hasNext: false,
              hasPrev: false
            }
          }
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Search products error:', error);
      throw new Error(error.message || 'Failed to search products');
    }
  },

  // Get vendor's products with optional filters and pagination (fallback method)
  async getProducts(filters = {}) {
    try {
      // Use search API if available, otherwise fallback to regular API
      try {
        return await this.searchProducts(filters);
      } catch (searchError) {
        console.warn('Search API not available, using fallback:', searchError.message);
        
        // Fallback to regular products API
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

          return {
            success: true,
            data: {
              products,
              availableCategories: [], // Not available in fallback
              filters: {},
              pagination: response.data.pagination
            }
          };
        }
        
        throw new Error('Invalid response format');
      }
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
      'Infrastructure',
      'Tools',
      'Industrial Equipment',
      'Machinery',
      'Automation',
    ];
  }
};
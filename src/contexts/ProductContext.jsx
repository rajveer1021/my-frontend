// src/contexts/ProductContext.jsx - Updated with smart API selection for vendor products
import React, { createContext, useContext, useState, useCallback } from 'react';
import { productService } from '../services/productService';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasNext: false,
    hasPrev: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to determine which API to use
  const shouldUseSearchAPI = (params = {}) => {
    return !!(
      params.search?.trim() ||
      (params.category && params.category !== 'all') ||
      params.sortBy !== 'createdAt' ||
      params.sortOrder !== 'desc'
    );
  };

  // Smart product fetching - uses appropriate API based on parameters
  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (shouldUseSearchAPI(params)) {
        console.log('Using search API for filtered results');
        response = await productService.searchProducts(params);
      } else {
        console.log('Using vendor products API for basic listing');
        response = await productService.getProducts(params);
      }
      
      if (response.success && response.data) {
        setProducts(response.data.products || []);
        setAvailableCategories(response.data.availableCategories || []);
        setFilters(response.data.filters || {});
        setPagination(response.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 1,
          hasNext: false,
          hasPrev: false
        });
        return response.data.products || [];
      }
      
      throw new Error('Invalid response format');
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
      // Don't throw error, just set empty array to prevent infinite loading
      setProducts([]);
      setAvailableCategories([]);
      setFilters({});
      setPagination({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1,
        hasNext: false,
        hasPrev: false
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Search products with filters (uses search API)
  const searchProducts = useCallback(async (searchParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.searchProducts(searchParams);
      
      if (response.success && response.data) {
        setProducts(response.data.products || []);
        setAvailableCategories(response.data.availableCategories || []);
        setFilters(response.data.filters || {});
        setPagination(response.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 1,
          hasNext: false,
          hasPrev: false
        });
        return response.data.products || [];
      }
      
      throw new Error('Invalid response format');
    } catch (err) {
      setError(err.message);
      console.error('Error searching products:', err);
      setProducts([]);
      setAvailableCategories([]);
      setFilters({});
      setPagination({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1,
        hasNext: false,
        hasPrev: false
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get vendor products (uses basic listing API)
  const getVendorProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts(params);
      
      if (response.success && response.data) {
        setProducts(response.data.products || []);
        setAvailableCategories(response.data.availableCategories || []);
        setFilters(response.data.filters || {});
        setPagination(response.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 1,
          hasNext: false,
          hasPrev: false
        });
        return response.data.products || [];
      }
      
      throw new Error('Invalid response format');
    } catch (err) {
      setError(err.message);
      console.error('Error getting vendor products:', err);
      setProducts([]);
      setAvailableCategories([]);
      setFilters({});
      setPagination({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1,
        hasNext: false,
        hasPrev: false
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = async (productData) => {
    try {
      const newProduct = await productService.createProduct(productData);
      
      // Add to the beginning of the products list
      setProducts(prev => [newProduct, ...prev]);
      
      // Update pagination total
      setPagination(prev => ({
        ...prev,
        total: prev.total + 1
      }));
      
      return newProduct;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const updatedProduct = await productService.updateProduct(id, productData);
      
      // Update the product in the list
      setProducts(prev => 
        prev.map(product => 
          product.id === id ? updatedProduct : product
        )
      );
      
      return updatedProduct;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productService.deleteProduct(id);
      
      // Remove from products list
      setProducts(prev => prev.filter(product => product.id !== id));
      
      // Update pagination total
      setPagination(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1)
      }));
      
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getProduct = async (id) => {
    try {
      // First try to find in existing products
      const existingProduct = products.find(p => p.id === id);
      if (existingProduct) {
        return existingProduct;
      }
      
      // If not found, fetch from API
      const product = await productService.getProduct(id);
      return product;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Refresh products with current filters
  const refreshProducts = useCallback(async (customFilters = {}) => {
    const currentFilters = { ...filters, ...customFilters };
    return await fetchProducts(currentFilters);
  }, [filters, fetchProducts]);

  const clearError = () => {
    setError(null);
  };

  // Clear all data (useful for logout or reset)
  const clearProducts = () => {
    setProducts([]);
    setAvailableCategories([]);
    setFilters({});
    setPagination({
      page: 1,
      limit: 10,
      total: 0,
      pages: 1,
      hasNext: false,
      hasPrev: false
    });
    setError(null);
  };

  const value = {
    // Data
    products,
    availableCategories,
    filters,
    pagination,
    loading,
    error,

    // Smart fetching method (chooses appropriate API)
    fetchProducts,
    
    // Specific API methods
    searchProducts,
    getVendorProducts,
    
    // CRUD operations
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    refreshProducts,
    
    // Utility methods
    clearError,
    clearProducts,
    
    // Helper to determine API usage
    shouldUseSearchAPI
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
// src/contexts/ProductContext.jsx - Updated with real API integration
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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getProducts(filters);
      setProducts(response.products || []);
      setPagination(response.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        pages: 1
      });
      return response.products || [];
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
      // Don't throw error, just set empty array to prevent infinite loading
      setProducts([]);
      setPagination({
        page: 1,
        limit: 10,
        total: 0,
        pages: 1
      });
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

  const refreshProducts = useCallback(async (filters = {}) => {
    return await fetchProducts(filters);
  }, [fetchProducts]);

  const clearError = () => {
    setError(null);
  };

  const value = {
    products,
    pagination,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    refreshProducts,
    clearError
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
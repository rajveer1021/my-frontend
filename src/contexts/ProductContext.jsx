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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts(filters);
      setProducts(data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching products:', err);
      // Don't throw error, just set empty array to prevent infinite loading
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addProduct = async (productData) => {
    try {
      const newProduct = await productService.createProduct(productData);
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const updatedProduct = await productService.updateProduct(id, productData);
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
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getProduct = async (id) => {
    try {
      return await productService.getProduct(id);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
import React, { useState, useEffect } from 'react';
import { ProductForm } from '../components/products/ProductForm';
import { useProducts } from '../contexts/ProductContext';
import { productService } from '../services/productService';

const EditProduct = ({ onNavigate, productId }) => {
  const { updateProduct } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await productService.getProduct(productId);
        setProduct(productData);
      } catch (error) {
        alert('Failed to load product');
        onNavigate('products');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, onNavigate]);

  const handleSubmit = async (productData) => {
    try {
      await updateProduct(productId, productData);
      onNavigate('products');
    } catch (error) {
      alert('Failed to update product');
    }
  };

  const handleCancel = () => {
    onNavigate('products');
  };

  if (loading) {
    return <div className="text-center py-8">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center py-8">Product not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600">Update product information</p>
      </div>

      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={true}
      />
    </div>
  );
};
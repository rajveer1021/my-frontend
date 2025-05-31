import React, { useState, useEffect } from 'react';
import { ProductForm } from '../components/products/ProductForm';
import { useProducts } from '../contexts/ProductContext';
import { productService } from '../services/productService';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

const EditProduct = ({ onNavigate, productId }) => {
  const { updateProduct } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const productData = await productService.getProduct(productId);
        setProduct(productData);
      } catch (error) {
        setError('Failed to load product');
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    } else {
      setError('No product ID provided');
      setLoading(false);
    }
  }, [productId]);

  const handleSubmit = async (productData) => {
    try {
      await updateProduct(productId, productData);
      onNavigate('products');
    } catch (error) {
      throw new Error('Failed to update product');
    }
  };

  const handleCancel = () => {
    onNavigate('products');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Loading product..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <ErrorMessage 
          message={error} 
          type="error"
          onClose={() => onNavigate('products')}
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <ErrorMessage 
          message="Product not found" 
          type="error"
          onClose={() => onNavigate('products')}
        />
      </div>
    );
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

export default EditProduct;
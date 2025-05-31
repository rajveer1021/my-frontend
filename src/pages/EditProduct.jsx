import React, { useState, useEffect } from 'react';
import { ProductForm } from '../components/products/ProductForm';
import { useProducts } from '../contexts/ProductContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

const EditProduct = ({ onNavigate, productId }) => {
  const { updateProduct, getProduct } = useProducts();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const productData = await getProduct(productId);
        
        // Transform data to match form structure
        const formData = {
          ...productData,
          category: productData.categories?.[0] || '',
          subCategory: productData.categories?.[1] || '',
          tags: productData.tags || []
        };
        
        setProduct(formData);
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
  }, [productId, getProduct]);

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
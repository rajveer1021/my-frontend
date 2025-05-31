import React from 'react';
import { ProductForm } from '../components/products/ProductForm';
import { useProducts } from '../contexts/ProductContext';

const AddProduct = ({ onNavigate }) => {
  const { addProduct } = useProducts();

  const handleSubmit = async (productData) => {
    try {
      await addProduct(productData);
      onNavigate('products');
    } catch (error) {
      alert('Failed to add product');
    }
  };

  const handleCancel = () => {
    onNavigate('products');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
        <p className="text-gray-600">Create a new product listing</p>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={false}
      />
    </div>
  );
};

export default AddProduct;
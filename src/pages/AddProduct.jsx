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
      {/* No additional header since the form includes everything */}
      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={false}
      />
    </div>
  );
};

export default AddProduct;
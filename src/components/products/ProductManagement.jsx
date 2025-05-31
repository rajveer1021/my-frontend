import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import { ProductFilters } from './ProductFilters';
import { ProductTable } from './ProductTable';
import { useProducts } from '../../contexts/ProductContext';

const ProductManagement = ({ onNavigate }) => {
  const { products, loading, fetchProducts, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProducts({
      search: searchTerm,
      category: categoryFilter,
      sort: sortBy
    });
  }, [searchTerm, categoryFilter, sortBy, fetchProducts]);

  const handleView = (productId) => {
    onNavigate('product-details', { productId });
  };

  const handleEdit = (productId) => {
    onNavigate('edit-product', { productId });
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        alert('Failed to delete product');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Button onClick={() => onNavigate('add-product')}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Products Table */}
      <ProductTable
        products={products}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ProductManagement;
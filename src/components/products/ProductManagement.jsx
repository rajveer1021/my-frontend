import React, { useState, useEffect } from 'react';
import { Plus, Package } from 'lucide-react';
import Button from '../ui/Button';
import { ProductFilters } from './ProductFilters';
import { ProductTable } from './ProductTable';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { useProducts } from '../../contexts/ProductContext';

const ProductManagement = ({ onNavigate }) => {
  const { products, loading, fetchProducts, deleteProduct } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeProducts = async () => {
      try {
        await fetchProducts({
          search: searchTerm,
          category: categoryFilter,
          sort: sortBy
        });
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    if (!isInitialized) {
      initializeProducts();
    }
  }, [fetchProducts, isInitialized]);

  // Refetch when filters change, but only after initial load
  useEffect(() => {
    if (isInitialized) {
      fetchProducts({
        search: searchTerm,
        category: categoryFilter,
        sort: sortBy
      });
    }
  }, [searchTerm, categoryFilter, sortBy, fetchProducts, isInitialized]);

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

  // Show loading only during initial load
  if (!isInitialized && loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" text="Loading products..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Button onClick={() => onNavigate('add-product')} className="w-full sm:w-auto">
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

      {/* Products Table/Loading */}
      {loading && isInitialized ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <LoadingSpinner size="lg" text="Loading products..." />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-50 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || categoryFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Create your first product to get started'
            }
          </p>
          <Button onClick={() => onNavigate('add-product')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Product
          </Button>
        </div>
      ) : (
        <ProductTable
          products={products}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default ProductManagement;
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { productService } from '../services/productService';
import { formatCurrency, getStockStatusColor } from '../utils/helpers';

const ProductDetails = ({ onNavigate, productId }) => {
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

  const handleEdit = () => {
    onNavigate('edit-product', { productId });
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(productId);
        onNavigate('products');
      } catch (error) {
        alert('Failed to delete product');
      }
    }
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => onNavigate('products')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">Product Details</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <Card>
          <CardContent className="p-6">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
              }}
            />
          </CardContent>
        </Card>

        {/* Information */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Name</label>
              <p className="text-lg font-semibold">{product.name}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Description</label>
              <p className="text-gray-700">{product.description}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Price</label>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(product.price)}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge variant={getStockStatusColor(product.status)}>
                  {product.status}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500">Categories</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {product.categories?.map((category, index) => (
                  <Badge key={index} variant="secondary">
                    {category}
                  </Badge>
                )) || <span className="text-gray-500">No categories</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Stock</label>
                <p className="text-lg font-semibold">{product.stock || 0}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Upload Date</label>
                <p className="text-lg font-semibold">{product.uploadDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Views</label>
                <p className="text-lg font-semibold">{product.views || 0}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Orders</label>
                <p className="text-lg font-semibold">{product.orders || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetails;
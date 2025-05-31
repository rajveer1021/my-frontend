// src/pages/EditProduct.jsx - Fixed with proper routing and data loading
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Edit, Package, ArrowLeft, Sparkles } from "lucide-react";
import { ProductForm } from "../components/products/ProductForm";
import { useProducts } from "../contexts/ProductContext";
import Button from "../components/ui/Button";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { useToast } from "../components/ui/Toast";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { updateProduct, getProduct } = useProducts();
  const { addToast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError('No product ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const productData = await getProduct(productId);
        
        if (!productData) {
          setError('Product not found');
          return;
        }
        
        // Transform data to match form structure
        const formData = {
          name: productData.name || '',
          description: productData.description || '',
          price: productData.price || '',
          category: productData.category || '',
          stock: productData.stock || 0
        };
        
        setProduct(formData);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.message || 'Failed to load product');
        addToast('Failed to load product details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, getProduct, addToast]);

  const handleSubmit = async (productData) => {
    try {
      await updateProduct(productId, productData);
      addToast('Product updated successfully!', 'success');
      navigate('/products');
    } catch (error) {
      console.error('Failed to update product:', error);
      addToast(error.message || 'Failed to update product', 'error');
      throw error; // Re-throw to let ProductForm handle loading state
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <div className="w-full max-w-none space-y-6">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-4 sm:p-6 lg:p-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <div className="h-8 w-48 bg-white/20 rounded-lg mb-2"></div>
                <div className="h-4 w-64 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl">
            <LoadingSpinner size="lg" text="Loading product details..." />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-none space-y-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-4 sm:p-6 lg:p-8 text-white">
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <Button
                      variant="ghost"
                      onClick={handleCancel}
                      className="text-white hover:bg-white/20 backdrop-blur-sm rounded-xl p-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                    Error Loading <span className="text-red-200">Product</span>
                  </h1>
                  <p className="text-red-100 text-sm sm:text-base lg:text-lg">
                    Unable to load the product for editing
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
            <div className="p-8">
              <ErrorMessage 
                message={error} 
                type="error"
                className="mb-6"
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleCancel}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Products
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full max-w-none space-y-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 p-4 sm:p-6 lg:p-8 text-white">
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    <Button
                      variant="ghost"
                      onClick={handleCancel}
                      className="text-white hover:bg-white/20 backdrop-blur-sm rounded-xl p-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                  </div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                    Product <span className="text-gray-200">Not Found</span>
                  </h1>
                  <p className="text-gray-100 text-sm sm:text-base lg:text-lg">
                    The product you're trying to edit doesn't exist
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Product not found
              </h3>
              <p className="text-gray-500 mb-6">
                The product may have been deleted or you don't have permission to edit it.
              </p>
              <Button
                onClick={handleCancel}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-none space-y-6">
      <div className="space-y-6">
        {/* Enhanced Header */}
        <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-4 sm:p-6 lg:p-8 text-white">
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <Button
                    variant="ghost"
                    onClick={handleCancel}
                    className="text-white hover:bg-white/20 backdrop-blur-sm rounded-xl p-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                  Edit <span className="text-blue-200">Product</span>
                </h1>
                <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                  Update your product details and information
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-4 lg:p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Tips for Updating Your Product
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Keep descriptions current and accurate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Update stock levels regularly</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Adjust pricing based on market</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Review product categories</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span>Enhance product features</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span>Monitor performance metrics</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          <div className="p-4 lg:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center">
                <Edit className="w-5 h-5 lg:w-6 lg:h-6 mr-3 text-blue-600" />
                Update Product Information
              </h2>
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Edit className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Modify the details below to update your product listing
            </p>
          </div>

          <div className="p-4 lg:p-6">
            <ProductForm
              initialData={product}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isEditing={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
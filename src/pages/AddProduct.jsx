import React from "react";
import { Plus, Package, ArrowLeft, Sparkles } from "lucide-react";
import { ProductForm } from "../components/products/ProductForm";
import { useProducts } from "../contexts/ProductContext";
import Button from "../components/ui/Button";

const AddProduct = ({ onNavigate }) => {
  const { addProduct } = useProducts();

  const handleSubmit = async (productData) => {
    try {
      await addProduct(productData);
      onNavigate("products");
    } catch (error) {
      alert("Failed to add product");
    }
  };

  const handleCancel = () => {
    onNavigate("products");
  };

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
                  Add New <span className="text-blue-200">Product</span>
                </h1>
                <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                  Create a new product listing for your marketplace
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
                Tips for Creating Great Product Listings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Use clear, descriptive titles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Add detailed descriptions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Select appropriate categories</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Set competitive pricing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                  <span>Upload high-quality images</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                  <span>Keep stock updated</span>
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
                <Package className="w-5 h-5 lg:w-6 lg:h-6 mr-3 text-blue-600" />
                Product Information
              </h2>
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Plus className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-2">
              Fill in the details below to create your product listing
            </p>
          </div>

          <div className="p-4 lg:p-6">
            <ProductForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isEditing={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;

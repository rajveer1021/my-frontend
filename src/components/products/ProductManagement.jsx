import React, { useState, useEffect } from "react";
import {
  Plus,
  Package,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import Button from "../ui/Button";
import { ProductFilters } from "./ProductFilters";
import { ProductTable } from "./ProductTable";
import ProductDetailsModal from "./ProductDetailsModal";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useProducts } from "../../contexts/ProductContext";

const ProductManagement = ({ onNavigate }) => {
  const { products, loading, fetchProducts, deleteProduct, getProduct } =
    useProducts();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isInitialized, setIsInitialized] = useState(false);

  // Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  useEffect(() => {
    const initializeProducts = async () => {
      try {
        await fetchProducts({
          search: searchTerm,
          category: categoryFilter,
          sort: sortBy,
        });
      } catch (error) {
        console.error("Failed to fetch products:", error);
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
        sort: sortBy,
      });
    }
  }, [searchTerm, categoryFilter, sortBy, fetchProducts, isInitialized]);

  const handleView = async (productId) => {
    try {
      const product = await getProduct(productId);
      setSelectedProduct(product);
      setIsDetailsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      // Fallback to product from list
      const product = products.find((p) => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        setIsDetailsModalOpen(true);
      }
    }
  };

  const handleEdit = (productId) => {
    onNavigate("edit-product", { productId });
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
      } catch (error) {
        alert("Failed to delete product");
      }
    }
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedProduct(null);
  };

  // Show loading only during initial load
  if (!isInitialized && loading) {
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
            <LoadingSpinner size="lg" text="Loading products..." />
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
          {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"7\" cy=\"7\" r=\"3\"/%3E%3Ccircle cx=\"27\" cy=\"7\" r=\"3\"/%3E%3Ccircle cx=\"47\" cy=\"7\" r=\"3\"/%3E%3Ccircle cx=\"7\" cy=\"27\" r=\"3\"/%3E%3Ccircle cx=\"27\" cy=\"27\" r=\"3\"/%3E%3Ccircle cx=\"47\" cy=\"27\" r=\"3\"/%3E%3Ccircle cx=\"7\" cy=\"47\" r=\"3\"/%3E%3Ccircle cx=\"27\" cy=\"47\" r=\"3\"/%3E%3Ccircle cx=\"47\" cy=\"47\" r=\"3\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" /> */}

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Package className="w-5 h-5 lg:w-6 lg:h-6" />
                  </div>
                  <div className="text-xs lg:text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                    Product Management
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
                  Manage <span className="text-blue-200">Products</span>
                </h1>
                <p className="text-blue-100 text-sm sm:text-base lg:text-lg">
                  Create, edit, and organize your product catalog
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => onNavigate("add-product")}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-white/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
              <Filter className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg lg:text-xl font-bold text-gray-900">
              Filter & Search
            </h2>
          </div>
          <ProductFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </div>

        {/* Products Table/Loading */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
          {loading && isInitialized ? (
            <div className="p-8 text-center">
              <LoadingSpinner size="lg" text="Loading products..." />
            </div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || categoryFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Create your first product to get started"}
              </p>
              <Button
                onClick={() => onNavigate("add-product")}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            </div>
          ) : (
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 lg:w-6 lg:h-6 mr-3 text-blue-600" />
                  Products ({products.length})
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                  <Edit className="w-4 h-4 ml-3" />
                  <span>Edit</span>
                  <Trash2 className="w-4 h-4 ml-3" />
                  <span>Delete</span>
                </div>
              </div>
              <ProductTable
                products={products}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          )}
        </div>

        {/* Product Details Modal */}
        <ProductDetailsModal
          product={selectedProduct}
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
        />
      </div>
    </div>
  );
};

export default ProductManagement;

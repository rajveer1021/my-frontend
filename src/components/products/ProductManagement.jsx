// src/components/products/ProductManagement.jsx - Fixed with robust filter handling
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useProducts } from "../../contexts/ProductContext";
import { useToast } from "../ui/Toast";
import { productService } from "../../services/productService";

const ProductManagement = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // Refs for managing debouncing and preventing duplicate API calls
  const searchTimeoutRef = useRef(null);
  const lastFetchParamsRef = useRef(null);
  const isFetchingRef = useRef(false);

  // State for products and filters
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [availableCategories, setAvailableCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  });

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Determine which API to use based on filters
  const shouldUseSearch = useCallback((currentFilters) => {
    return !!(
      currentFilters.search?.trim() ||
      (currentFilters.category && currentFilters.category !== "all" && currentFilters.category !== "") ||
      currentFilters.sortBy !== "createdAt" ||
      currentFilters.sortOrder !== "desc"
    );
  }, []);

  // Create a stable reference for filter comparison
  const createFilterSignature = useCallback((filterObj) => {
    return JSON.stringify({
      search: filterObj.search?.trim() || "",
      category: filterObj.category === "all" ? "" : filterObj.category || "",
      sortBy: filterObj.sortBy || "createdAt",
      sortOrder: filterObj.sortOrder || "desc",
      page: filterObj.page || 1,
      limit: filterObj.limit || 10,
    });
  }, []);

  // Robust fetch products function with duplicate call prevention
  const fetchProducts = useCallback(async (newFilters = {}, forceRefresh = false) => {
    // Prevent duplicate API calls
    if (isFetchingRef.current && !forceRefresh) {
      return;
    }

    const currentFilters = { ...filters, ...newFilters };
    const filterSignature = createFilterSignature(currentFilters);

    // Check if we're making the same request
    if (!forceRefresh && lastFetchParamsRef.current === filterSignature) {
      return;
    }

    try {
      isFetchingRef.current = true;
      setLoading(true);
      lastFetchParamsRef.current = filterSignature;

      let response;
      const useSearchAPI = shouldUseSearch(currentFilters);

      if (useSearchAPI) {
        // Use search API when filters are applied

        const params = {
          page: currentFilters.page,
          limit: currentFilters.limit,
          sortBy: currentFilters.sortBy,
          sortOrder: currentFilters.sortOrder,
        };

        // Add search if provided
        if (currentFilters.search?.trim()) {
          params.search = currentFilters.search.trim();
        }

        // Add category if selected and not 'all'
        if (currentFilters.category && currentFilters.category !== "all" && currentFilters.category !== "") {
          params.category = currentFilters.category;
        }

        response = await productService.searchProducts(params);
      } else {
        // Use basic vendor products API for simple listing
        
        const params = {
          page: currentFilters.page,
          limit: currentFilters.limit,
        };

        response = await productService.getProducts(params);
      }

      if (response.success && response.data) {
        setProducts(response.data.products || []);
        setPagination(response.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 1,
          hasNext: false,
          hasPrev: false,
        });
        setAvailableCategories(response.data.availableCategories || []);

        // Update filters state only if successful
        setFilters(currentFilters);
        
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      addToast(error.message || "Failed to load products", "error");
      setProducts([]);
      
      // Reset last fetch params on error to allow retry
      lastFetchParamsRef.current = null;
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [filters, shouldUseSearch, createFilterSignature, addToast]);

  // Initialize products on component mount
  useEffect(() => {
    const initializeProducts = async () => {
      await fetchProducts({}, true); // Force refresh on init
      setIsInitialized(true);
    };

    if (!isInitialized) {
      initializeProducts();
    }
  }, [isInitialized, fetchProducts]);

  // Handle search input change with proper debouncing
  const handleSearchChange = useCallback((searchTerm) => {
    
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Update filters immediately for UI responsiveness
    setFilters(prev => ({ 
      ...prev, 
      search: searchTerm, 
      page: 1 
    }));

    // Debounce the API call
    searchTimeoutRef.current = setTimeout(() => {
      const newFilters = { 
        search: searchTerm, 
        page: 1 
      };
      fetchProducts(newFilters);
    }, 500);
  }, [fetchProducts]);

  // Handle category filter change - immediate API call
  const handleCategoryChange = useCallback((category) => {
    
    // Clear any pending search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const normalizedCategory = category === "all" ? "" : category;
    const newFilters = {
      category: normalizedCategory,
      page: 1,
    };

    // Update filters and fetch immediately for category changes
    setFilters(prev => ({ ...prev, ...newFilters }));
    fetchProducts(newFilters);
  }, [fetchProducts]);

  // Handle sort change - immediate API call
  const handleSortChange = useCallback((sortOption) => {
    
    // Clear any pending search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const [sortBy, sortOrder] = sortOption.includes("-")
      ? sortOption.split("-")
      : [sortOption, "asc"];

    const newFilters = {
      sortBy,
      sortOrder: sortOrder === "high" ? "desc" : sortOrder === "low" ? "asc" : sortOrder,
      page: 1,
    };

    setFilters(prev => ({ ...prev, ...newFilters }));
    fetchProducts(newFilters);
  }, [fetchProducts]);

  // Handle pagination - immediate API call
  const handlePageChange = useCallback((page) => {
    
    const newFilters = { page };
    setFilters(prev => ({ ...prev, ...newFilters }));
    fetchProducts(newFilters);
  }, [fetchProducts]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    
    // Clear any pending timeouts
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const newFilters = {
      search: "",
      category: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
      limit: 10,
    };
    
    setFilters(newFilters);
    fetchProducts(newFilters, true); // Force refresh
  }, [fetchProducts]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Handle view product
  const handleView = async (productId) => {
    try {
      const product = products.find((p) => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        setIsDetailsModalOpen(true);
      } else {
        // Fetch product details if not in current list
        const productDetails = await productService.getProduct(productId);
        setSelectedProduct(productDetails);
        setIsDetailsModalOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      addToast("Failed to load product details", "error");
    }
  };

  // Handle edit product
  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  // Handle delete product - show confirmation modal
  const handleDelete = (productId) => {
    const product = products.find((p) => p.id === productId);
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete product
  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await productService.deleteProduct(productToDelete.id);

      // Remove from local state
      setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));

      // Update pagination
      setPagination((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));

      addToast("Product deleted successfully", "success");
      setIsDeleteModalOpen(false);
      setProductToDelete(null);

      // Refresh products if needed
      if (products.length === 1 && pagination.page > 1) {
        // If this was the last product on the page, go to previous page
        handlePageChange(pagination.page - 1);
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
      addToast(error.message || "Failed to delete product", "error");
    }
  };

  // Close modals
  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedProduct(null);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleAddProduct = () => {
    navigate("/add-product");
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
                  onClick={handleAddProduct}
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>
            </div>

            {/* Stats */}
            {pagination.total > 0 && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold">{pagination.total}</div>
                  <div className="text-blue-100 text-sm">Total Products</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-2xl font-bold">
                    {availableCategories.length}
                  </div>
                  <div className="text-blue-100 text-sm">Categories</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-white/50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                <Filter className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                Search & Filter Products
              </h2>
            </div>
            {(filters.search ||
              filters.category ||
              filters.sortBy !== "createdAt") && (
              <Button
                variant="ghost"
                onClick={clearAllFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                Clear All Filters
              </Button>
            )}
          </div>

          <ProductFilters
            searchTerm={filters.search}
            onSearchChange={handleSearchChange}
            categoryFilter={filters.category || "all"}
            onCategoryChange={handleCategoryChange}
            sortBy={`${filters.sortBy}-${filters.sortOrder}`}
            onSortChange={handleSortChange}
            availableCategories={availableCategories}
            loading={loading}
          />
        </div>

        {/* Products Section */}
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
                {filters.search || filters.category
                  ? "No products found"
                  : "No products yet"}
              </h3>
              <p className="text-gray-500 mb-6">
                {filters.search || filters.category
                  ? "Try adjusting your search or filters"
                  : "Create your first product to get started"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={handleAddProduct}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Product
                </Button>
                {(filters.search || filters.category) && (
                  <Button variant="outline" onClick={clearAllFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg lg:text-xl font-bold text-gray-900 flex items-center">
                  <Package className="w-5 h-5 lg:w-6 lg:h-6 mr-3 text-blue-600" />
                  Products ({pagination.total})
                </h2>
                {/* Debug info in development */}
                {process.env.NODE_ENV === 'development' && (
                  <div className="text-xs text-gray-500">
                    API: {shouldUseSearch(filters) ? 'Search' : 'Basic'}
                  </div>
                )}
              </div>

              <ProductTable
                products={products}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                loading={loading}
              />

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total
                    )}{" "}
                    of {pagination.total} results
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={!pagination.hasPrev || loading}
                      className="text-sm"
                    >
                      Previous
                    </Button>

                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(5, pagination.pages) },
                        (_, i) => {
                          const page = i + 1;
                          const isActive = page === pagination.page;

                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              disabled={loading}
                              className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                                isActive
                                  ? "bg-blue-600 text-white"
                                  : "text-gray-500 hover:bg-gray-100"
                              }`}
                            >
                              {page}
                            </button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={!pagination.hasNext || loading}
                      className="text-sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product Details Modal */}
        <ProductDetailsModal
          product={selectedProduct}
          isOpen={isDetailsModalOpen}
          onClose={closeDetailsModal}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={confirmDelete}
          product={productToDelete}
        />
      </div>
    </div>
  );
};

export default ProductManagement;
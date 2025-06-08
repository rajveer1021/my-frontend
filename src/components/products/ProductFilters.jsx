// src/components/products/ProductFilters.jsx - Improved with better event handling
import React, { useState, useCallback } from "react";
import { Search, Filter, X, Loader2 } from "lucide-react";
import { Input } from "../ui/Input";
import Button from "../ui/Button";
import { Badge } from "../ui/Badge";

const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Newest First" },
  { value: "createdAt-asc", label: "Oldest First" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

export const ProductFilters = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
  availableCategories = [],
  loading = false,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  // Handle search input with proper event handling
  const handleSearchInputChange = useCallback(
    (e) => {
      const value = e.target.value;
      onSearchChange(value);
    },
    [onSearchChange]
  );

  // Handle category change with proper event handling
  const handleCategorySelectChange = useCallback(
    (e) => {
      const value = e.target.value;
      onCategoryChange(value);
    },
    [onCategoryChange]
  );

  // Handle sort change with proper event handling
  const handleSortSelectChange = useCallback(
    (e) => {
      const value = e.target.value;
      onSortChange(value);
    },
    [onSortChange]
  );

  const clearFilters = useCallback(() => {
    onSearchChange("");
    onCategoryChange("all");
    onSortChange("createdAt-desc");
  }, [onSearchChange, onCategoryChange, onSortChange]);

  const clearSearch = useCallback(() => {
    onSearchChange("");
  }, [onSearchChange]);

  const clearCategory = useCallback(() => {
    onCategoryChange("all");
  }, [onCategoryChange]);

  const clearSort = useCallback(() => {
    onSortChange("createdAt-desc");
  }, [onSortChange]);

  const hasActiveFilters =
    searchTerm || categoryFilter !== "all" || sortBy !== "createdAt-desc";
  const activeFilterCount = [
    searchTerm,
    categoryFilter !== "all" ? categoryFilter : null,
    sortBy !== "createdAt-desc" ? sortBy : null,
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search products by name, description..."
            value={searchTerm || ""}
            onChange={handleSearchInputChange}
            className="pl-10 h-11"
            disabled={loading}
          />
          {/* {loading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
          )} */}
          {searchTerm && !loading && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 w-4 h-4 flex items-center justify-center"
              disabled={loading}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex space-x-2 sm:hidden">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex-1 h-11"
            disabled={loading}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge
                variant="destructive"
                className="ml-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="h-11 px-3"
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Desktop Filters */}
        <div className="hidden sm:flex space-x-2">
          <select
            value={categoryFilter || "all"}
            onChange={handleCategorySelectChange}
            disabled={loading}
            className="px-3 py-2 h-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm min-w-[140px] disabled:opacity-50"
          >
            <option value="all">All Categories</option>
            {availableCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={sortBy || "createdAt-desc"}
            onChange={handleSortSelectChange}
            disabled={loading}
            className="px-3 py-2 h-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm min-w-[140px] disabled:opacity-50"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              size="sm"
              disabled={loading}
              className="h-11 px-3"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Filters Dropdown */}
      {showFilters && (
        <div className="sm:hidden bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={categoryFilter || "all"}
              onChange={handleCategorySelectChange}
              disabled={loading}
              className="w-full px-3 py-2 h-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50"
            >
              <option value="all">All Categories</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              value={sortBy || "createdAt-desc"}
              onChange={handleSortSelectChange}
              disabled={loading}
              className="w-full px-3 py-2 h-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(false)}
              className="flex-1"
              disabled={loading}
            >
              Close
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={() => {
                  clearFilters();
                  setShowFilters(false);
                }}
                className="flex-1"
                disabled={loading}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{searchTerm}"
              <button
                onClick={clearSearch}
                disabled={loading}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors disabled:opacity-50"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {categoryFilter !== "all" && categoryFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {categoryFilter}
              <button
                onClick={clearCategory}
                disabled={loading}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors disabled:opacity-50"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {sortBy !== "createdAt-desc" && sortBy && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Sort:{" "}
              {SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label ||
                sortBy}
              <button
                onClick={clearSort}
                disabled={loading}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors disabled:opacity-50"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Results Summary */}
      {(searchTerm || (categoryFilter !== "all" && categoryFilter)) &&
        !loading && (
          <div className="text-sm text-gray-600">
            {searchTerm && <span>Searching for "{searchTerm}"</span>}
            {searchTerm && categoryFilter !== "all" && categoryFilter && (
              <span> in </span>
            )}
            {categoryFilter !== "all" && categoryFilter && (
              <span>category "{categoryFilter}"</span>
            )}
          </div>
        )}
    </div>
  );
};

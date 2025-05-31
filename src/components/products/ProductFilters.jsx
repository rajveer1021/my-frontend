// src/components/products/ProductFilters.jsx - Updated for search API integration
import React, { useState } from 'react';
import { Search, Filter, X, Loader2 } from 'lucide-react';
import { Input } from '../ui/Input';
import Button from '../ui/Button';
import { Badge } from '../ui/Badge';

const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' }
];

export const ProductFilters = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortChange,
  availableCategories = [],
  loading = false
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const clearFilters = () => {
    onSearchChange('');
    onCategoryChange('all');
    onSortChange('createdAt-desc');
  };

  const hasActiveFilters = searchTerm || categoryFilter !== 'all' || sortBy !== 'createdAt-desc';
  const activeFilterCount = [
    searchTerm,
    categoryFilter !== 'all' ? categoryFilter : null,
    sortBy !== 'createdAt-desc' ? sortBy : null
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
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11"
            disabled={loading}
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 animate-spin" />
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
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs flex items-center justify-center">
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
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={loading}
            className="px-3 py-2 h-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm min-w-[140px] disabled:opacity-50"
          >
            <option value="all">All Categories</option>
            {availableCategories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            disabled={loading}
            className="px-3 py-2 h-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm min-w-[140px] disabled:opacity-50"
          >
            {SORT_OPTIONS.map(option => (
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
              value={categoryFilter}
              onChange={(e) => onCategoryChange(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 h-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50"
            >
              <option value="all">All Categories</option>
              {availableCategories.map(category => (
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
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 h-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50"
            >
              {SORT_OPTIONS.map(option => (
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
                onClick={() => onSearchChange('')}
                disabled={loading}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {categoryFilter !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {categoryFilter}
              <button
                onClick={() => onCategoryChange('all')}
                disabled={loading}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {sortBy !== 'createdAt-desc' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Sort: {SORT_OPTIONS.find(opt => opt.value === sortBy)?.label}
              <button
                onClick={() => onSortChange('createdAt-desc')}
                disabled={loading}
                className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Results Summary */}
      {(searchTerm || categoryFilter !== 'all') && !loading && (
        <div className="text-sm text-gray-600">
          {searchTerm && (
            <span>Searching for "{searchTerm}"</span>
          )}
          {searchTerm && categoryFilter !== 'all' && <span> in </span>}
          {categoryFilter !== 'all' && (
            <span>category "{categoryFilter}"</span>
          )}
        </div>
      )}
    </div>
  );
};
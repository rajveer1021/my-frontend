import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '../ui/Input';
import Button from '../ui/Button';
import { Badge } from '../ui/Badge';
import { PRODUCT_CATEGORIES, SORT_OPTIONS } from '../../utils/constants';

export const ProductFilters = ({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  sortBy,
  setSortBy
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setSortBy('newest');
  };

  const hasActiveFilters = searchTerm || categoryFilter !== 'all' || sortBy !== 'newest';

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex space-x-2 sm:hidden">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex-1"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                !
              </Badge>
            )}
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Desktop Filters */}
        <div className="hidden sm:flex space-x-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
          >
            <option value="all">All Categories</option>
            {PRODUCT_CATEGORIES.map(category => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
          >
            {SORT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <Button variant="ghost" onClick={clearFilters} size="sm">
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
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Categories</option>
              {PRODUCT_CATEGORIES.map(category => (
                <option key={category} value={category.toLowerCase()}>
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
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSearchTerm('')}
              />
            </Badge>
          )}
          {categoryFilter !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {PRODUCT_CATEGORIES.find(cat => cat.toLowerCase() === categoryFilter)}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setCategoryFilter('all')}
              />
            </Badge>
          )}
          {sortBy !== 'newest' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Sort: {SORT_OPTIONS.find(opt => opt.value === sortBy)?.label}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setSortBy('newest')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
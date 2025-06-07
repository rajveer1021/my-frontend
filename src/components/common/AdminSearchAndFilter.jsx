// src/components/admin/common/AdminSearchAndFilter.jsx
import React from 'react';
import { Search, Filter, X, RefreshCw } from 'lucide-react';
import { Input } from '../ui/Input';
import Button from '../ui/Button';
import { Badge } from '../ui/Badge';

export const AdminSearchAndFilter = ({
  searchTerm,
  onSearchChange,
  filters = {},
  onFilterChange,
  availableFilters = [],
  onClearFilters,
  loading = false,
  placeholder = "Search...",
  showRefresh = false,
  onRefresh
}) => {
  const hasActiveFilters = searchTerm || Object.values(filters).some(value => 
    value && value !== 'all' && value !== ''
  );

  const activeFilterCount = [
    searchTerm ? 1 : 0,
    ...Object.values(filters).map(value => 
      value && value !== 'all' && value !== '' ? 1 : 0
    )
  ].reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-white/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg lg:text-xl font-bold text-gray-900">
            Search & Filter
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          {showRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="text-gray-500 hover:text-gray-700"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          )}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              disabled={loading}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear ({activeFilterCount})
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder={placeholder}
            value={searchTerm || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-11"
            disabled={loading}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 w-4 h-4 flex items-center justify-center"
              disabled={loading}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        {availableFilters.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {availableFilters.map((filter) => (
              <div key={filter.key} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {filter.label}
                </label>
                <select
                  value={filters[filter.key] || 'all'}
                  onChange={(e) => onFilterChange(filter.key, e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm disabled:opacity-50"
                >
                  <option value="all">All {filter.label}</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
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
                  className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors disabled:opacity-50"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {Object.entries(filters).map(([key, value]) => {
              if (!value || value === 'all' || value === '') return null;
              
              const filter = availableFilters.find(f => f.key === key);
              const option = filter?.options.find(o => o.value === value);
              
              if (!filter || !option) return null;

              return (
                <Badge key={key} variant="secondary" className="flex items-center gap-1">
                  {filter.label}: {option.label}
                  <button
                    onClick={() => onFilterChange(key, 'all')}
                    disabled={loading}
                    className="ml-1 hover:bg-gray-300 rounded-full p-0.5 transition-colors disabled:opacity-50"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
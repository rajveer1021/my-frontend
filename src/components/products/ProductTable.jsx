// src/components/products/ProductTable.jsx - Updated with better loading states
import React from 'react';
import { Eye, Edit, Trash2, MoreVertical, Package, Loader2 } from 'lucide-react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '../ui/Table';
import { Badge } from '../ui/Badge';
import Button from '../ui/Button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '../ui/DropdownMenu';
import { formatCurrency, getStockStatusColor } from '../../utils/helpers';

export const ProductTable = ({ 
  products, 
  onView, 
  onEdit, 
  onDelete,
  loading = false
}) => {
  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="flex items-center space-x-4">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Mobile card view for products
  const MobileProductCard = ({ product }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start space-x-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-gray-200"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
          }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant={getStockStatusColor(product.status)} className="text-xs">
              {product.status}
            </Badge>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(product.price)}
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-400 hover:text-gray-600"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MoreVertical className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(product.id)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(product.id)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(product.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex flex-wrap gap-1">
        {product.categories && product.categories.map((category, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {category}
          </Badge>
        ))}
      </div>
      
      <div className="flex justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
        <span>Uploaded: {product.uploadDate}</span>
        <span>Stock: {product.stock || 0}</span>
      </div>
    </div>
  );

  // Show loading skeleton
  if (loading && products.length === 0) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-base font-medium mb-1">No products found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View */}
      <div className="block lg:hidden space-y-4">
        {loading && products.length > 0 && (
          <div className="flex items-center justify-center py-4 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Updating products...
          </div>
        )}
        {products.map((product) => (
          <MobileProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden">
        {loading && products.length > 0 && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
            <div className="flex items-center text-sm text-blue-700">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Updating products...
            </div>
          </div>
        )}
        
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-gray-600 font-medium">Product</TableHead>
              <TableHead className="text-gray-600 font-medium">Categories</TableHead>
              <TableHead className="text-gray-600 font-medium">Price</TableHead>
              <TableHead className="text-gray-600 font-medium">Stock Status</TableHead>
              <TableHead className="text-gray-600 font-medium">Upload Date</TableHead>
              <TableHead className="text-gray-600 font-medium w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className={`hover:bg-gray-50 ${loading ? 'opacity-75' : ''}`}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                      }}
                    />
                    <div className="min-w-0">
                      <div className="font-medium text-gray-900 truncate">{product.name}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{product.description}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {product.categories && product.categories.map((category, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-gray-900">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 flex-col">
                    {/* <Badge variant={getStockStatusColor(product.status)}>
                      {product.status}
                    </Badge> */}
                    <span className="text-sm text-gray-500">
                      {product.stock || 0} units
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {product.uploadDate}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onView(product.id)}
                      disabled={loading}
                      className="h-8 w-8 text-gray-400 hover:text-gray-600"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(product.id)}
                      disabled={loading}
                      className="h-8 w-8 text-gray-400 hover:text-gray-600"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete(product.id)}
                      disabled={loading}
                      className="h-8 w-8 text-gray-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
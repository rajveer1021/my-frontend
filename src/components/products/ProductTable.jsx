import React from 'react';
import { Eye, Edit, Trash2, MoreVertical, Package } from 'lucide-react';
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
  onDelete 
}) => {
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
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
              <MoreVertical className="h-4 w-4" />
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

  if (products.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-base font-medium mb-1">No products found</p>
          <p className="text-sm">Create your first product to get started</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile View */}
      <div className="block lg:hidden space-y-4">
        {products.map((product) => (
          <MobileProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden">
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
              <TableRow key={product.id} className="hover:bg-gray-50">
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
                      <div className="text-sm text-gray-500 truncate">{product.description}</div>
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
                  <Badge variant={getStockStatusColor(product.status)}>
                    {product.status}
                  </Badge>
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
                      className="h-8 w-8 text-gray-400 hover:text-gray-600"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onEdit(product.id)}
                      className="h-8 w-8 text-gray-400 hover:text-gray-600"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => onDelete(product.id)}
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
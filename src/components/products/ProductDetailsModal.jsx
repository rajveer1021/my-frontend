import React from 'react';
import { X, Package, Calendar, Tag, MapPin } from 'lucide-react';
import { Dialog, DialogContent } from '../ui/Dialog';
import { Badge } from '../ui/Badge';
import { formatCurrency, getStockStatusColor } from '../../utils/helpers';

const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  if (!product) return null;

  const getStockStatusText = (status) => {
    const statusMap = {
      'In Stock': 'In Stock',
      'Low Stock': 'Low Stock',
      'Out of Stock': 'Out of Stock',
    };
    return statusMap[status] || status;
  };

  const getStockStatusBadgeClass = (status) => {
    switch (status) {
      case 'In Stock':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-0">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Product Details</h2>
                  <p className="text-blue-100 text-sm">Complete product information</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm p-2 rounded-xl transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Product Image and Basic Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Image */}

              {/* Product Information */}
                {/* Title and Price */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-base mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl font-bold text-blue-600">{formatCurrency(product.price)}</div>
                    <div className="text-sm text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded-lg">Per unit</span>
                    </div>
                  </div>
                </div>

                {/* Key Information Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Package className="w-4 h-4 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Stock Status</h4>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStockStatusBadgeClass(
                        product.status
                      )}`}
                    >
                      {getStockStatusText(product.status)}
                    </span>
                    {product.stock && (
                      <p className="text-xs text-gray-500 mt-2">{product.stock} units available</p>
                    )}
                  </div>

                  <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Upload Date</h4>
                    </div>
                    <p className="text-base font-medium text-gray-900">{product.uploadDate || '1/10/2024'}</p>
                    <p className="text-xs text-gray-500 mt-1">Listed on marketplace</p>
                  </div>
                </div>

                {/* Categories */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Tag className="w-4 h-4 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Categories</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.categories && product.categories.length > 0 ? (
                      product.categories.map((category, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-sm bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          {category}
                        </Badge>
                      ))
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="text-sm bg-blue-50 text-blue-700 border-blue-200"
                        >
                          Electronics
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-sm bg-green-50 text-green-700 border-green-200"
                        >
                          IoT
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-sm bg-purple-50 text-purple-700 border-purple-200"
                        >
                          Sensors
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
            </div>

            {/* Full Description */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">Product Description</h4>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed text-base">
                  {product.fullDescription ||
                    'Advanced IoT sensor for temperature, humidity, and air quality monitoring. Features wireless connectivity and long battery life, perfect for industrial and commercial applications. Built with high-quality materials and designed for durability in harsh environments.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
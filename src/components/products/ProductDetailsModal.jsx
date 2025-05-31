import React from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from '../ui/Dialog';
import { Badge } from '../ui/Badge';
import { formatCurrency, getStockStatusColor } from '../../utils/helpers';

const ProductDetailsModal = ({
  product,
  isOpen,
  onClose
}) => {
  if (!product) return null;

  const getStockStatusText = (status) => {
    const statusMap = {
      'In Stock': 'in stock',
      'Low Stock': 'low stock', 
      'Out of Stock': 'out of stock'
    };
    return statusMap[status] || status.toLowerCase();
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
        <div className="bg-white rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Product Image */}
            <div className="flex justify-center">
              <div className="w-48 h-32 bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 rounded-lg flex items-center justify-center overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-teal-400 via-teal-500 to-white rounded-lg"></div>
                )}
              </div>
            </div>

            {/* Product Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Product Name</h3>
                  <p className="text-lg font-semibold text-gray-900">{product.name}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Subheading</h3>
                  <p className="text-gray-700">{product.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Price</h3>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(product.price)}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Stock Status</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStockStatusBadgeClass(product.status)}`}>
                    {getStockStatusText(product.status)}
                  </span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.categories && product.categories.length > 0 ? (
                      product.categories.map((category, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {category}
                        </Badge>
                      ))
                    ) : (
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-sm">Electronics</Badge>
                        <Badge variant="outline" className="text-sm">IoT</Badge>
                        <Badge variant="outline" className="text-sm">Sensors</Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Upload Date</h3>
                  <p className="text-gray-700">{product.uploadDate || '1/10/2024'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.fullDescription || 
                 "Advanced IoT sensor for temperature, humidity, and air quality monitoring. Wireless connectivity and long battery life."}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
import React from "react";
import { X, Package, Calendar, Tag, MapPin } from "lucide-react";
import { Dialog, DialogContent } from "../ui/Dialog";
import { Badge } from "../ui/Badge";
import { formatCurrency, getStockStatusColor } from "../../utils/helpers";

const ProductDetailsModal = ({ product, isOpen, onClose }) => {
  console.log("products:", product);
  if (!product) return null;

  const getStockStatusText = (status) => {
    const statusMap = {
      "In Stock": "In Stock",
      "Low Stock": "Low Stock",
      "Out of Stock": "Out of Stock",
    };
    return statusMap[status] || status;
  };

  const getStockStatusBadgeClass = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800 border-green-200";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Out of Stock":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-[90vw] max-h-[85vh] bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-0 overflow-hidden">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-4 text-white relative overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Product Details</h2>
                  <p className="text-blue-100 text-sm">
                    Complete product information
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm p-2 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 overflow-y-auto">
            {/* Product Header Section */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 border border-gray-200/50 rounded-xl p-5 mb-5 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                {product.name}
              </h3>
              <div className="flex items-center justify-center space-x-3">
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(product.price)}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-sm">
                    Per unit
                  </span>
                </div>
              </div>
            </div>

            {/* Main Content Grid - 2 columns for better spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stock Status Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-blue-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Package className="w-4 h-4 text-blue-600" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    Stock Status
                  </h4>
                </div>
                <div className="space-y-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${getStockStatusBadgeClass(
                      product.status
                    )}`}
                  >
                    {getStockStatusText(product.status)}
                  </span>
                  {product.stock && (
                    <p className="text-sm text-gray-600">
                      {product.stock} units available
                    </p>
                  )}
                </div>
              </div>

              {/* Upload Date Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:border-green-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">Upload Date</h4>
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold text-gray-900">
                    {product.uploadDate || "1/10/2024"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Listed on marketplace
                  </p>
                </div>
              </div>

              {/* Categories Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Tag className="w-4 h-4 text-purple-600" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">Categories</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.categories && product.categories.length > 0 ? (
                    product.categories.map((category, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs px-2 py-1 bg-gray-50 hover:bg-gray-100 transition-colors rounded-md border"
                      >
                        {category}
                      </Badge>
                    ))
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-1 bg-blue-50 text-blue-700 border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        Electronics
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-1 bg-green-50 text-green-700 border-green-200 rounded-md hover:bg-green-100 transition-colors"
                      >
                        IoT
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs px-2 py-1 bg-purple-50 text-purple-700 border-purple-200 rounded-md hover:bg-purple-100 transition-colors"
                      >
                        Sensors
                      </Badge>
                    </div>
                  )}
                </div>
              </div>

              {/* Description Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">
                    Description
                  </h4>
                </div>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed text-sm line-clamp-3">
                    {product.description ||
                      "Advanced IoT sensor for temperature, humidity, and air quality monitoring. Features wireless connectivity and long battery life."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
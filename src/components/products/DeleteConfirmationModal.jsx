// src/components/products/DeleteConfirmationModal.jsx
import React from "react";
import { X, Trash2, AlertTriangle, Package } from "lucide-react";
import { Dialog, DialogContent } from "../ui/Dialog";
import Button from "../ui/Button";
import { formatCurrency } from "../../utils/helpers";

const DeleteConfirmationModal = ({ product, isOpen, onClose, onConfirm, loading = false }) => {
  if (!product) return null;

  const handleConfirm = async () => {
    await onConfirm();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[90vw] bg-white/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl p-0 overflow-hidden">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-4 text-white relative overflow-hidden flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <Trash2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Delete Product</h2>
                  <p className="text-red-100 text-sm">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="text-white/80 hover:text-white hover:bg-white/20 backdrop-blur-sm p-2 rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {/* Warning Icon */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Are you sure you want to delete this product?
              </h3>
              <p className="text-gray-600 text-sm">
                This will permanently remove the product from your catalog and cannot be reversed.
              </p>
            </div>

            {/* Product Info Card */}
            <div className="bg-gradient-to-r from-gray-50 to-red-50/30 border border-gray-200/50 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate mb-1">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Stock: {product.stock || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-semibold text-red-800 text-sm mb-1">
                    Important Warning
                  </h5>
                  <ul className="text-red-700 text-sm space-y-1">
                    <li>• This action cannot be undone</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="flex-1 h-11 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl transition-all duration-200 font-medium"
              >
                Cancel
              </Button>
              
              <Button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 h-11 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Deleting...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Product</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
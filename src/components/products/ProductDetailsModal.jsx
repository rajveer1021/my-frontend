import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/Dialog';
import Button from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Heart, ShoppingCart, Star, Share2, MessageCircle } from 'lucide-react';

const ProductDetailsModal = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isInWishlist,
  onToggleWishlist
}) => {
  const [quantity, setQuantity] = useState(1);

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(product);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
            <Badge 
              className={`absolute top-4 left-4 ${getStockStatusColor(product.stockStatus)}`}
            >
              {product.stockStatus.replace('-', ' ')}
            </Badge>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">{product.description}</h2>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(128 reviews)</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.categories.map((category) => (
                <Badge key={category} variant="outline">
                  {category}
                </Badge>
              ))}
            </div>

            <div className="border-t pt-4">
              <span className="text-3xl font-bold text-green-600">
                ${product.price.toFixed(2)}
              </span>
              <p className="text-sm text-gray-600 mt-1">Free shipping on orders over $100</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            <div className="border-t pt-4">
              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="font-medium">Quantity:</label>
                  <div className="flex items-center border rounded">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-8 w-8 p-0"
                    >
                      -
                    </Button>
                    <span className="px-4 py-1 border-x">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-8 w-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleAddToCart}
                    disabled={product.stockStatus === 'out-of-stock'}
                    className="flex-1"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onToggleWishlist}
                    className="px-4"
                  >
                    <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Vendor
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Vendor Info */}
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <h4 className="font-semibold mb-2">Vendor Information</h4>
                <p className="text-sm text-gray-600">TechParts Manufacturing Co.</p>
                <p className="text-sm text-gray-600">⭐ 4.8/5 rating (342 reviews)</p>
                <p className="text-sm text-gray-600">🚚 Ships within 2-3 business days</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsModal;
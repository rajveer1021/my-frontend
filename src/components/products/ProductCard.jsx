import React, { useState } from 'react';
import { Star, Heart, ShoppingCart, Eye, ExternalLink } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const ProductCard = ({ 
  product, 
  onAddToCart, 
  onToggleWishlist, 
  onView,
  isWishlisted = false 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleWishlist?.(product);
  };

  const handleView = () => {
    onView?.(product);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400 opacity-50" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating || 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
      );
    }

    return stars;
  };

  const getStockStatus = () => {
    if (product.status === 'Out of Stock') {
      return { text: 'Out of Stock', color: 'bg-red-500' };
    } else if (product.status === 'Low Stock') {
      return { text: 'Low Stock', color: 'bg-yellow-500' };
    }
    return { text: 'In Stock', color: 'bg-green-500' };
  };

  const stockStatus = getStockStatus();

  return (
    <div 
      className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden animate-fade-in cursor-pointer"
      onClick={handleView}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        {!imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            <img
              src={product.image}
              alt={product.title || product.name}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <Eye className="w-12 h-12" />
          </div>
        )}

        {/* Stock Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={cn(
            'px-2 py-1 text-xs font-medium text-white rounded-full',
            stockStatus.color
          )}>
            {stockStatus.text}
          </span>
        </div>

        {/* Category Badge */}
        {product.categories && product.categories.length > 0 && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-white/90 text-xs font-medium text-gray-700 rounded-full">
              {product.categories[0]}
            </span>
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <button
              onClick={handleToggleWishlist}
              className={cn(
                'p-2 rounded-full transition-all duration-200',
                isWishlisted
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-gray-700 hover:bg-white'
              )}
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={cn('w-4 h-4', isWishlisted && 'fill-current')} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleView();
              }}
              className="p-2 bg-white/90 text-gray-700 rounded-full hover:bg-white transition-colors duration-200"
              title="View details"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            {product.status !== 'Out of Stock' && (
              <button
                onClick={handleAddToCart}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
                title="Add to cart"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {product.title || product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center mb-3">
            <div className="flex items-center mr-2">
              {renderStars(product.rating.rate || product.rating)}
            </div>
            <span className="text-sm text-gray-500">
              ({product.rating.count || 0})
            </span>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900">
              ${product.price}
            </span>
            {product.stock !== undefined && (
              <span className="text-xs text-gray-500">
                {product.stock} in stock
              </span>
            )}
          </div>
          
          {product.status !== 'Out of Stock' ? (
            <button
              onClick={handleAddToCart}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add to Cart
            </button>
          ) : (
            <button
              disabled
              className="px-4 py-2 bg-gray-300 text-gray-500 text-sm font-medium rounded-lg cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
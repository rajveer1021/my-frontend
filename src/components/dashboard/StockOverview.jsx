import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Package } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const StockOverview = ({ stockData }) => {
  const totalProducts =
    stockData.inStock + stockData.lowStock + stockData.outOfStock;

  const stockItems = [
    {
      label: 'In Stock',
      value: stockData.inStock,
      color: 'from-green-400 to-green-500',
      bg: 'bg-green-50',
      text: 'text-green-700',
    },
    {
      label: 'Low Stock',
      value: stockData.lowStock,
      color: 'from-yellow-400 to-orange-500',
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
    },
    {
      label: 'Out of Stock',
      value: stockData.outOfStock,
      color: 'from-red-400 to-red-500',
      bg: 'bg-red-50',
      text: 'text-red-700',
    },
  ];

  if (totalProducts === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50 text-center">
        <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600 text-sm">No products in inventory</p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 lg:p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Package className="w-6 h-6 mr-3 text-blue-600" />
          Stock Overview
        </h2>
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Package className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Stat blocks */}
      <div className="space-y-4">
        {stockItems.map((item, index) => {
          const percentage = (
            (item.value / Math.max(totalProducts, 1)) *
            100
          ).toFixed(1);

          return (
            <div
              key={index}
              className={cn(
                `${item.bg} rounded-xl p-4 hover:scale-105 transition-all duration-300 cursor-pointer group`
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${item.color} shadow-lg`}
                  />
                  <span className={`font-medium ${item.text}`}>{item.label}</span>
                </div>
                <span
                  className={`text-2xl font-bold ${item.text} group-hover:scale-110 transition-transform duration-300`}
                >
                  {item.value}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {percentage}% of total
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

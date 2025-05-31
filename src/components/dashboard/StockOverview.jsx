import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Package } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { cn } from '../../utils/helpers';

export const StockOverview = ({ stockData }) => {
  const totalProducts = stockData.inStock + stockData.lowStock + stockData.outOfStock;
  
  const stockItems = [
    {
      label: 'In Stock',
      value: stockData.inStock,
      percentage: totalProducts > 0 ? `${Math.round((stockData.inStock / totalProducts) * 100)}%` : '0%',
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Low Stock',
      value: stockData.lowStock,
      percentage: totalProducts > 0 ? `${Math.round((stockData.lowStock / totalProducts) * 100)}%` : '0%',
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Out of Stock',
      value: stockData.outOfStock,
      percentage: totalProducts > 0 ? `${Math.round((stockData.outOfStock / totalProducts) * 100)}%` : '0%',
      icon: XCircle,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Package className="w-5 h-5 mr-2 text-gray-600" />
          Stock Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stockItems.map((item, index) => (
            <div key={index} className={cn(
              'flex items-center justify-between p-4 rounded-lg transition-colors',
              item.bgColor
            )}>
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <item.icon className={cn('w-6 h-6', item.color)} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-600">{item.percentage} of total</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                <div className="text-sm text-gray-500">products</div>
              </div>
            </div>
          ))}
        </div>
        
        {totalProducts === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No products in inventory</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
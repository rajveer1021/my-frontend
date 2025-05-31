import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../utils/helpers';

export const StatCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  trendValue,
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-600'
}) => {
  const isPositiveTrend = trend === 'up';
  
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', iconBgColor)}>
            <Icon className={cn('w-6 h-6', iconColor)} />
          </div>
          {trendValue && (
            <div className={cn(
              'flex items-center text-sm font-medium',
              isPositiveTrend ? 'text-green-600' : 'text-red-600'
            )}>
              {isPositiveTrend ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {trendValue}
            </div>
          )}
        </div>
        
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};
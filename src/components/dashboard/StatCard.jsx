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
  iconColor = 'text-blue-600',
  gradient = 'bg-gradient-to-br from-blue-500 to-indigo-600',
  delay = 0,
}) => {
  const isPositiveTrend = trend === 'up';

  return (
    <div
      className={cn(
        'relative rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer animate-fade-in',
        gradient
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Hover Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Card content sits on top of overlay */}
      <Card className="bg-transparent shadow-none backdrop-blur-sm">
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className={cn('p-3 rounded-xl bg-white/20')}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            {trendValue && (
              <div
                className={cn(
                  'flex items-center text-sm font-medium',
                  isPositiveTrend ? 'text-green-200' : 'text-red-200'
                )}
              >
                {isPositiveTrend ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {trendValue}
              </div>
            )}
          </div>

          <div className="text-white">
            <p className="text-sm opacity-90 mb-1">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {description && (
              <p className="text-sm text-white/70 mt-1">{description}</p>
            )}
          </div>

          {/* Icon watermark in background */}
          <div className="absolute top-4 right-4 opacity-20">
            <Icon className="w-12 h-12 text-white" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

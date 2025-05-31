import React from 'react';
import { cn } from '../../utils/helpers';

export const Badge = ({ children, variant = 'default', className, onClick }) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    destructive: 'bg-red-100 text-red-800',
    secondary: 'bg-gray-100 text-gray-800'
  };

  return (
    <span 
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        onClick && 'cursor-pointer hover:opacity-80',
        className
      )}
      onClick={onClick}
    >
      {children}
    </span>
  );
};
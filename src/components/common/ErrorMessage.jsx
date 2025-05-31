import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const ErrorMessage = ({ 
  message, 
  type = 'error', 
  onClose, 
  className 
}) => {
  const typeStyles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const iconStyles = {
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  };

  return (
    <div className={cn(
      'flex items-center p-4 border rounded-lg',
      typeStyles[type],
      className
    )}>
      <AlertTriangle className={cn('w-5 h-5 mr-3', iconStyles[type])} />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-3 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
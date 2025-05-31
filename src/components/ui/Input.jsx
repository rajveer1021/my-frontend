import React from 'react';
import { cn } from '../../utils/helpers';

export const Input = React.forwardRef(({ className, type = 'text', ...props }, ref) => (
  <input
    type={type}
    className={cn(
      'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm',
      'placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'transition-colors duration-200',
      className
    )}
    ref={ref}
    {...props}
  />
));

Input.displayName = 'Input';
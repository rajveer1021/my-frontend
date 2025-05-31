import React from 'react';
import { cn } from '../../utils/helpers';

const Button = React.forwardRef(({
  className,
  variant = 'default',
  size = 'default',
  children,
  ...props
}, ref) => {
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
    ghost: 'hover:bg-gray-100 hover:text-gray-900',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50 shadow-sm',
    destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200'
  };

  const sizes = {
    default: 'h-10 px-4 py-2 text-sm',
    sm: 'h-9 px-3 text-sm',
    lg: 'h-11 px-8 text-base',
    icon: 'h-10 w-10 p-0'
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        'active:scale-[0.98]',
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
import React from 'react';
import { cn } from '../../utils/helpers';

export const Card = ({ children, className }) => (
  <div className={cn('rounded-lg border border-gray-200 bg-white shadow-sm', className)}>
    {children}
  </div>
);

export const CardHeader = ({ children, className }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)}>
    {children}
  </div>
);

export const CardTitle = ({ children, className }) => (
  <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)}>
    {children}
  </h3>
);

export const CardContent = ({ children, className }) => (
  <div className={cn('p-6 pt-0', className)}>
    {children}
  </div>
);
import React from 'react';
import { cn } from '../../utils/helpers';

export const Table = ({ children, className }) => (
  <div className="relative w-full overflow-auto">
    <table className={cn('w-full caption-bottom text-sm', className)}>
      {children}
    </table>
  </div>
);

export const TableHeader = ({ children, className }) => (
  <thead className={cn('border-b border-gray-200', className)}>
    {children}
  </thead>
);

export const TableBody = ({ children, className }) => (
  <tbody className={cn('divide-y divide-gray-200', className)}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className }) => (
  <tr className={cn('hover:bg-gray-50', className)}>
    {children}
  </tr>
);

export const TableHead = ({ children, className }) => (
  <th className={cn('h-12 px-4 text-left align-middle font-medium text-gray-500', className)}>
    {children}
  </th>
);

export const TableCell = ({ children, className }) => (
  <td className={cn('p-4 align-middle', className)}>
    {children}
  </td>
);
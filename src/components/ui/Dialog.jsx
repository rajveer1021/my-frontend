import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';

export const Dialog = ({ open, onOpenChange, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children, className }) => (
  <div className={cn(
    'bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-4',
    className
  )}>
    {children}
  </div>
);

export const DialogHeader = ({ children }) => (
  <div className="mb-4">
    {children}
  </div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-lg font-semibold text-gray-900">
    {children}
  </h2>
);

export const DialogClose = ({ onClose }) => (
  <button
    onClick={onClose}
    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
  >
    <X className="w-4 h-4" />
  </button>
);

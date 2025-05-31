import React, { useEffect } from 'react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-10 w-full max-w-lg">
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children, className }) => (
  <div className={cn(
    'bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto',
    'animate-in fade-in-0 zoom-in-95 duration-200',
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

export const DialogTitle = ({ children, className }) => (
  <h2 className={cn("text-lg font-semibold text-gray-900", className)}>
    {children}
  </h2>
);

export const DialogClose = ({ onClose }) => (
  <button
    onClick={onClose}
    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
  >
    <X className="w-4 h-4" />
  </button>
);
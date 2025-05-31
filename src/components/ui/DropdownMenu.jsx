import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../../utils/helpers';

export const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative inline-block text-left">
      {React.Children.map(children, child =>
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  );
};

export const DropdownMenuTrigger = ({ children, isOpen, setIsOpen, asChild }) => {
  const handleClick = () => setIsOpen(!isOpen);
  
  if (asChild) {
    return React.cloneElement(children, { onClick: handleClick });
  }
  
  return (
    <button onClick={handleClick}>
      {children}
    </button>
  );
};

export const DropdownMenuContent = ({ children, isOpen, setIsOpen, align = 'right' }) => {
  const ref = useRef();
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);
  
  if (!isOpen) return null;
  
  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 transform -translate-x-1/2'
  };
  
  return (
    <div
      ref={ref}
      className={cn(
        'absolute top-full mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg z-50',
        alignClasses[align]
      )}
    >
      <div className="py-1">
        {children}
      </div>
    </div>
  );
};

export const DropdownMenuItem = ({ children, onClick, className }) => (
  <button
    className={cn(
      'flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors',
      className
    )}
    onClick={onClick}
  >
    {children}
  </button>
);

export const DropdownMenuSeparator = () => (
  <div className="my-1 h-px bg-gray-200" />
);
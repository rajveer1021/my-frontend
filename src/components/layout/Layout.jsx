import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../hooks/useAuth';

const Layout = ({ children, currentPage, onPageChange }) => {
  // Desktop sidebar starts open, mobile starts closed
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [currentPage]);

  // Handle resize to manage sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        // On desktop, restore previous state or default to open
        const savedState = localStorage.getItem('sidebarOpen');
        setSidebarOpen(savedState !== null ? JSON.parse(savedState) : true);
      }
    };

    // Save sidebar state for desktop
    if (window.innerWidth >= 1024) {
      localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
      
      <div className="flex">
        <Sidebar 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
        
        {/* Main content with proper margin for fixed sidebar */}
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'
        }`}>
          <div className="p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-4rem)]">
              {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

export const Layout = ({ children, currentPage, onPageChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

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
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
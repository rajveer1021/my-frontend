import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { ToastProvider } from './components/ui/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import { Layout } from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ProductDetails from './pages/ProductDetails';
import Settings from './pages/Settings';
import { NotFound } from './components/common/NotFound';
import './index.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [pageParams, setPageParams] = useState({});

  const handleNavigation = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigation} />;
      case 'products':
        return <Products onNavigate={handleNavigation} />;
      case 'add-product':
        return <AddProduct onNavigate={handleNavigation} />;
      case 'edit-product':
        return (
          <EditProduct 
            onNavigate={handleNavigation} 
            productId={pageParams.productId} 
          />
        );
      case 'product-details':
        return (
          <ProductDetails 
            onNavigate={handleNavigation} 
            productId={pageParams.productId} 
          />
        );
      case 'settings':
        return <Settings onNavigate={handleNavigation} />;
      default:
        return <NotFound onNavigateHome={() => handleNavigation('dashboard')} />;
    }
  };

  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <ProductProvider>
            <Layout 
              currentPage={currentPage} 
              onPageChange={(page) => handleNavigation(page)}
            >
              {renderCurrentPage()}
            </Layout>
          </ProductProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
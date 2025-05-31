import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { ToastProvider } from './components/ui/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useAuth } from './hooks/useAuth';
import Auth from './pages/Auth';
import Layout from './components/layout/Layout';
import VendorDashboard from './components/dashboard/VendorDashboard';
import ProductManagement from './components/products/ProductManagement';
import VendorOnboarding from './components/onboarding/VendorOnboarding';
import Settings from './pages/Settings';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ProductDetails from './pages/ProductDetails';
import './index.css';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [pageParams, setPageParams] = useState({});
  const [isOnboarded, setIsOnboarded] = useState(
    localStorage.getItem('vendorOnboarded') === 'true'
  );

  const navigateToPage = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth if no user
  if (!user) {
    return <Auth />;
  }

  // Show onboarding if vendor not completed
  if (!isOnboarded) {
    return (
      <VendorOnboarding 
        onComplete={() => {
          setIsOnboarded(true);
          localStorage.setItem('vendorOnboarded', 'true');
        }}
      />
    );
  }

  // Render vendor pages
  const renderVendorPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <VendorDashboard />;
      case 'products':
        return <ProductManagement onNavigate={navigateToPage} />;
      case 'add-product':
        return <AddProduct onNavigate={navigateToPage} />;
      case 'edit-product':
        return <EditProduct onNavigate={navigateToPage} productId={pageParams.productId} />;
      case 'product-details':
        return <ProductDetails onNavigate={navigateToPage} productId={pageParams.productId} />;
      case 'settings':
        return <Settings />;
      default:
        return <VendorDashboard />;
    }
  };

  return (
    <Layout 
      currentPage={currentPage} 
      onPageChange={setCurrentPage}
    >
      {renderVendorPage()}
    </Layout>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <ProductProvider>
            <AppContent />
          </ProductProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
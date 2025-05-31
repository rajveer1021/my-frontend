import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { ToastProvider } from './components/ui/Toast';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useAuth } from './contexts/AuthContext';
import Auth from './pages/Auth';
import Layout from './components/layout/Layout';
import VendorDashboard from './components/dashboard/VendorDashboard';
import ProductManagement from './components/products/ProductManagement';
import VendorOnboarding from './components/onboarding/VendorOnboarding';
import Settings from './pages/Settings';
import './index.css';

const AppContent = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isOnboarded, setIsOnboarded] = useState(
    localStorage.getItem('vendorOnboarded') === 'true'
  );

  if (!user) {
    return <Auth />;
  }

  if (user.userType === 'buyer') {
    return <BuyerDashboard />;
  }

  // Show onboarding if vendor hasn't completed it
  if (user.userType === 'vendor' && !isOnboarded) {
    return (
      <VendorOnboarding 
        onComplete={() => setIsOnboarded(true)}
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <VendorDashboard />;
      case 'products':
        return <ProductManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <VendorDashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
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
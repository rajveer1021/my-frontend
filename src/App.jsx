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

// Enhanced Buyer Dashboard Component
const BuyerDashboard = () => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-6 text-white">
      <h1 className="text-2xl font-bold mb-2">Welcome to Buyer Portal!</h1>
      <p className="text-green-100">Discover and purchase products from verified vendors.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="font-semibold text-lg mb-2">Browse Products</h3>
        <p className="text-gray-600 mb-4">Explore our marketplace catalog</p>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          View Products
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="font-semibold text-lg mb-2">My Orders</h3>
        <p className="text-gray-600 mb-4">Track your purchases</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          View Orders
        </button>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="font-semibold text-lg mb-2">Wishlist</h3>
        <p className="text-gray-600 mb-4">Saved products</p>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
          View Wishlist
        </button>
      </div>
    </div>
  </div>
);

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

  console.log('Current user:', user); // Debug log

  // Handle buyer users
  if (user.userType === 'buyer') {
    return (
      <Layout 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        userType="buyer"
      >
        <BuyerDashboard />
      </Layout>
    );
  }

  // Handle vendor users - show onboarding if not completed
  if (user.userType === 'vendor' && !isOnboarded) {
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
      userType="vendor"
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
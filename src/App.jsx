// src/App.jsx - Updated with better route protection and redirection
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ProductProvider } from "./contexts/ProductContext";
import { ToastProvider } from "./components/ui/Toast";
import Layout from "./components/layout/Layout";
import VendorDashboard from "./components/dashboard/VendorDashboard";
import ProductManagement from "./components/products/ProductManagement";
import VendorOnboarding from "./components/onboarding/VendorOnboarding";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import { NotFound } from "./components/common/NotFound";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { LoadingSpinner } from "./components/common/LoadingSpinner";
import "./index.css";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to auth page with return URL
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If user is already authenticated, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleNavigate = (page, params = {}) => {
    setCurrentPage(page);
    
    // Handle navigation with URL parameters
    if (page === 'edit-product' && params.productId) {
      window.history.pushState(null, '', `/edit-product/${params.productId}`);
    } else {
      const routes = {
        'dashboard': '/',
        'products': '/products',
        'add-product': '/add-product',
        'settings': '/settings',
        'vendor-onboarding': '/vendor-onboarding'
      };
      
      if (routes[page]) {
        window.history.pushState(null, '', routes[page]);
      }
    }
  };

  return (
    <Routes>
      {/* Public Auth Route */}
      <Route 
        path="/auth" 
        element={
          <AuthRoute>
            <Auth />
          </AuthRoute>
        } 
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout currentPage="dashboard" onPageChange={handleNavigate}>
              <VendorDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <Layout currentPage="products" onPageChange={handleNavigate}>
              <ProductManagement onNavigate={handleNavigate} />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/add-product"
        element={
          <ProtectedRoute>
            <Layout currentPage="add-product" onPageChange={handleNavigate}>
              <AddProduct onNavigate={handleNavigate} />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/edit-product/:productId"
        element={
          <ProtectedRoute>
            <Layout currentPage="edit-product" onPageChange={handleNavigate}>
              <EditProduct onNavigate={handleNavigate} />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout currentPage="settings" onPageChange={handleNavigate}>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      {/* Vendor Onboarding - Semi-protected (requires auth but not full onboarding) */}
      <Route
        path="/vendor-onboarding"
        element={
          <ProtectedRoute>
            <VendorOnboarding
              onComplete={() => {
                localStorage.setItem("vendorOnboarded", "true");
                // Redirect to dashboard after onboarding
                window.location.href = '/';
              }}
            />
          </ProtectedRoute>
        }
      />
      
      {/* 404 Page */}
      <Route 
        path="*" 
        element={
          <NotFound 
            onNavigateHome={() => window.location.href = '/'} 
          />
        } 
      />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <ToastProvider>
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </ToastProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
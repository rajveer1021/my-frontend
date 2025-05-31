import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import { ToastProvider } from './components/ui/Toast';
import Layout from './components/layout/Layout';
import VendorDashboard from './components/dashboard/VendorDashboard';
import ProductManagement from './components/products/ProductManagement';
import VendorOnboarding from './components/onboarding/VendorOnboarding';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Settings from './pages/Settings'
import {NotFound} from './components/common/NotFound';
import ErrorBoundary from './components/common/ErrorBoundary';
import {LoadingSpinner} from './components/common/LoadingSpinner';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <ToastProvider>
            <ErrorBoundary>
              <Routes>
                {/* <Route path="/auth" element={<Auth />} /> */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <VendorDashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ProductManagement />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-product"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <AddProduct />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/edit-product/:productId"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <EditProduct />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                {/* <Route
                  path="/product-details/:productId"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ProductDetails />
                      </Layout>
                    </ProtectedRoute>
                  }
                /> */}
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Settings />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/vendor-onboarding"
                  element={
                    <ProtectedRoute>
                        <VendorOnboarding
                          onComplete={() => {
                            localStorage.setItem('vendorOnboarded', 'true');
                          }}
                        />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ErrorBoundary>
          </ToastProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
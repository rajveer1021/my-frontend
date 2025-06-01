// src/App.jsx - Fixed version with proper provider structure
import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
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
import GoogleAuthProvider from "./providers/GoogleOAuthProvider";
import "./index.css";

const ProtectedRoute = ({ children }) => {
  const { user, loading, isAuthenticated, error } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">
            Loading your account...
          </p>
          {error && <p className="mt-2 text-sm text-amber-600">{error}</p>}
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    console.log("ProtectedRoute: Redirecting to auth, not authenticated");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  console.log("ProtectedRoute: User authenticated, rendering children");
  return children;
};

const AuthRoute = ({ children }) => {
  const { user, loading, isAuthenticated, error } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  console.log("AuthRoute check:", { user: !!user, loading, isAuthenticated });

  useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log("AuthRoute: User already authenticated, redirecting");
      // Get the intended destination from state or default to dashboard
      const from = location.state?.from?.pathname || "/";

      console.log("AuthRoute: Redirecting to:", from);
      navigate(from, { replace: true });
    }
  }, [loading, isAuthenticated, navigate, location.state]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">
            Checking authentication...
          </p>
          {error && <p className="mt-2 text-sm text-amber-600">{error}</p>}
        </div>
      </div>
    );
  }

  // If user is already authenticated, the useEffect will handle the redirect
  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  console.log("AuthRoute: Rendering auth form");
  return children;
};

const VendorOnboardingRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Don't redirect automatically - let users access onboarding freely
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log("VendorOnboardingRoute: Not authenticated, redirecting to auth");
      navigate("/auth", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

// Wrapper components to handle URL parameters
const EditProductWrapper = () => {
  const { productId } = useParams();
  return <EditProduct productId={productId} />;
};

const VendorOnboardingWrapper = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    localStorage.setItem("vendorOnboarded", "true");
    navigate("/", { replace: true });
  };

  return <VendorOnboarding onComplete={handleComplete} />;
};

const AppRoutes = () => {
  const navigate = useNavigate();

  const handleNavigate = (page, params = {}) => {
    const routes = {
      dashboard: "/",
      products: "/products",
      "add-product": "/add-product",
      settings: "/settings",
      "vendor-onboarding": "/vendor-onboarding",
    };

    if (page === "edit-product" && params.productId) {
      navigate(`/edit-product/${params.productId}`);
    } else if (routes[page]) {
      navigate(routes[page]);
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
            <Layout
              currentPage="edit-product"
              onPageChange={handleNavigate}
            >
              <EditProductWrapper />
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

      {/* Vendor Onboarding - Protected but no auto-redirect */}
      <Route
        path="/vendor-onboarding"
        element={
          <VendorOnboardingRoute>
            <VendorOnboardingWrapper />
          </VendorOnboardingRoute>
        }
      />

      {/* 404 Page */}
      <Route
        path="*"
        element={<NotFound onNavigateHome={() => navigate("/")} />}
      />
    </Routes>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <GoogleAuthProvider>
        <BrowserRouter>
          <AuthProvider>
            <ProductProvider>
              <ToastProvider>
                <AppRoutes />
              </ToastProvider>
            </ProductProvider>
          </AuthProvider>
        </BrowserRouter>
      </GoogleAuthProvider>
    </ErrorBoundary>
  );
};

export default App;
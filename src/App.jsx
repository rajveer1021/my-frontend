// src/App.jsx - Fixed authentication flow with proper React Router navigation
import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
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
import "./index.css";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">
            Loading your account...
          </p>
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
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // Get the intended destination from state or default to dashboard
      const from = location.state?.from?.pathname || "/";

      // Check if user needs onboarding
      const needsOnboarding =
        !localStorage.getItem("vendorOnboarded") &&
        (user.userType === "vendor" || user.accountType === "VENDOR");

      if (needsOnboarding) {
        navigate("/vendor-onboarding", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, loading, navigate, location.state]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  // If user is already authenticated, the useEffect will handle the redirect
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 font-medium">Redirecting...</p>
        </div>
      </div>
    );
  }

  return children;
};

const OnboardingRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      const isOnboarded = localStorage.getItem("vendorOnboarded") === "true";
      if (isOnboarded) {
        navigate("/", { replace: true });
      }
    }
  }, [user, loading, navigate]);

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

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
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
            <Layout currentPage="edit-product" onPageChange={handleNavigate}>
              <EditProduct />
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

      {/* Vendor Onboarding - Semi-protected */}
      <Route
        path="/vendor-onboarding"
        element={
          <OnboardingRoute>
            <VendorOnboardingWrapper />
          </OnboardingRoute>
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

// Wrapper components to handle URL parameters
const EditProductWrapper = ({ onNavigate }) => {
  const { productId } = useParams();
  return <EditProduct onNavigate={onNavigate} productId={productId} />;
};

const VendorOnboardingWrapper = () => {
  const navigate = useNavigate();

  const handleComplete = () => {
    localStorage.setItem("vendorOnboarded", "true");
    navigate("/", { replace: true });
  };

  return <VendorOnboarding onComplete={handleComplete} />;
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

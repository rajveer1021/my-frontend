import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../layout/Header';
import { Sidebar } from '../layout/Sidebar';

const AdminLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  // Don't render layout for non-admin users
  if (user?.accountType !== 'ADMIN') {
    return null;
  }

  // Get current page from location
  const getCurrentPage = () => {
    const path = location.pathname;
    
    switch (path) {
      case '/admin':
        return 'admin-dashboard';
      case '/admin/vendors':
        return 'admin-vendors';
      case '/admin/profile-verification':
        return 'admin-profile-verification';
      case '/admin/buyers':
        return 'admin-buyers';
      case '/admin/products':
        return 'admin-products';
      case '/admin/settings':
        return 'admin-settings';
      default:
        return 'admin-dashboard';
    }
  };

  const currentPage = getCurrentPage();

  // Handle navigation
  const handlePageChange = (pageId) => {
    const routes = {
      'admin-dashboard': '/admin',
      'admin-vendors': '/admin/vendors',
      'admin-profile-verification': '/admin/profile-verification',
      'admin-buyers': '/admin/buyers',
      'admin-products': '/admin/products',
      'admin-settings': '/admin/settings',
    };

    const route = routes[pageId];
    if (route) {
      navigate(route);
    }
  };

  // Close sidebar on mobile when route changes
  React.useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [currentPage]);

  // Handle resize to manage sidebar state
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        const savedState = localStorage.getItem("adminSidebarOpen");
        setSidebarOpen(savedState !== null ? JSON.parse(savedState) : true);
      }
    };

    // Save sidebar state for desktop
    if (window.innerWidth >= 1024) {
      localStorage.setItem("adminSidebarOpen", JSON.stringify(sidebarOpen));
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  // Prevent body scroll when mobile sidebar is open
  React.useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <Header
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        isAdmin={true}
      />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          isAdmin={true}
        />

        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? "lg:ml-72" : "lg:ml-20"
          } overflow-hidden`}
        >
          <div className="h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
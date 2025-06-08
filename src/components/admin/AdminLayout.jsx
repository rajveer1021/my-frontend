// src/components/layout/AdminLayout.jsx - Improved with shared utilities
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Header } from '../layout/Header';
import { Sidebar } from '../layout/Sidebar';
import { 
  useSidebarState, 
  navigationUtils, 
  layoutConstants,
  layoutValidation 
} from '../layout/shared/layoutUtils';

const AdminLayout = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use shared sidebar state management
  const [sidebarOpen, setSidebarOpen] = useSidebarState(true);

  // Validate user access and redirect if necessary
  useEffect(() => {
    const redirectPath = layoutValidation.shouldRedirect(user, true);
    if (redirectPath) {
      navigate(redirectPath, { replace: true });
      return;
    }
  }, [user, navigate]);

  // Don't render layout for non-admin users or if validation fails
  if (!layoutValidation.validateUserAccess(user, true)) {
    return null;
  }

  // Get current page from location using shared utilities
  const currentPage = navigationUtils.getCurrentPage(location, true);

  // Handle navigation using shared utilities
  const handlePageChange = (pageId) => {
    const routes = navigationUtils.getRoutesMapping(true);
    const route = routes[pageId];
    
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className={layoutConstants.ADMIN_GRADIENTS.background + " min-h-screen"}>
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
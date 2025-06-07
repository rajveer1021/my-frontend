// src/components/layout/Layout.jsx - Improved with shared utilities
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { 
  useSidebarState, 
  navigationUtils, 
  layoutConstants,
  layoutValidation 
} from "./shared/layoutUtils";

const Layout = ({ children, currentPage, onPageChange }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use shared sidebar state management
  const [sidebarOpen, setSidebarOpen] = useSidebarState(true);

  // Validate user access and redirect if necessary
  useEffect(() => {
    const redirectPath = layoutValidation.shouldRedirect(user, false);
    if (redirectPath) {
      navigate(redirectPath, { replace: true });
      return;
    }
  }, [user, navigate]);

  // Don't render layout for admin users or if validation fails
  if (!layoutValidation.validateUserAccess(user, false)) {
    return null;
  }

  // Get current page from location if not provided
  const actualCurrentPage = currentPage || navigationUtils.getCurrentPage(location, false);

  // Handle navigation using shared utilities
  const handlePageChange = (pageId) => {
    const routes = navigationUtils.getRoutesMapping(false);
    const route = routes[pageId];
    
    if (route) {
      navigate(route);
    }
    
    if (onPageChange) {
      onPageChange(pageId);
    }
  };

  return (
    <div className={layoutConstants.VENDOR_GRADIENTS.background + " min-h-screen"}>
      <Header
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage={actualCurrentPage}
        onPageChange={handlePageChange}
        isAdmin={false}
      />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          currentPage={actualCurrentPage}
          onPageChange={handlePageChange}
          isAdmin={false}
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

export default Layout;
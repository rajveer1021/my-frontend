// src/utils/navigation.js
export class NavigationService {
  // Navigate to a specific route
  static navigateTo(path, replace = false) {
    if (replace) {
      window.location.replace(path);
    } else {
      window.location.href = path;
    }
  }

  // Navigate to dashboard
  static toDashboard() {
    this.navigateTo('/');
  }

  // Navigate to auth page
  static toAuth(returnUrl = null) {
    const url = returnUrl ? `/auth?returnUrl=${encodeURIComponent(returnUrl)}` : '/auth';
    this.navigateTo(url);
  }

  // Navigate to products page
  static toProducts() {
    this.navigateTo('/products');
  }

  // Navigate to add product page
  static toAddProduct() {
    this.navigateTo('/add-product');
  }

  // Navigate to edit product page
  static toEditProduct(productId) {
    this.navigateTo(`/edit-product/${productId}`);
  }

  // Navigate to settings page
  static toSettings() {
    this.navigateTo('/settings');
  }

  // Navigate to vendor onboarding
  static toVendorOnboarding() {
    this.navigateTo('/vendor-onboarding');
  }

  // Get current path
  static getCurrentPath() {
    return window.location.pathname;
  }

  // Get query parameters
  static getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
      result[key] = value;
    }
    return result;
  }

  // Get return URL from query params
  static getReturnUrl() {
    const params = this.getQueryParams();
    return params.returnUrl || '/';
  }

  // Check if current path matches
  static isCurrentPath(path) {
    return window.location.pathname === path;
  }

  // Redirect based on user role and state
  static redirectAfterAuth(user) {
    const returnUrl = this.getReturnUrl();
    
    // Check if user needs onboarding (if your API provides this info)
    const needsOnboarding = !localStorage.getItem('vendorOnboarded') && user.userType === 'vendor';
    
    if (needsOnboarding) {
      this.toVendorOnboarding();
    } else if (returnUrl && returnUrl !== '/auth') {
      this.navigateTo(returnUrl);
    } else {
      this.toDashboard();
    }
  }

  // Handle logout redirect
  static redirectAfterLogout() {
    this.toAuth();
  }

  // Navigate back in history
  static goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.toDashboard();
    }
  }

  // Reload current page
  static reload() {
    window.location.reload();
  }
}

// Convenience exports
export const navigation = NavigationService;

// React hook for navigation (if you prefer hooks)
export const useNavigation = () => {
  return {
    navigateTo: NavigationService.navigateTo,
    toDashboard: NavigationService.toDashboard,
    toAuth: NavigationService.toAuth,
    toProducts: NavigationService.toProducts,
    toAddProduct: NavigationService.toAddProduct,
    toEditProduct: NavigationService.toEditProduct,
    toSettings: NavigationService.toSettings,
    toVendorOnboarding: NavigationService.toVendorOnboarding,
    getCurrentPath: NavigationService.getCurrentPath,
    getQueryParams: NavigationService.getQueryParams,
    getReturnUrl: NavigationService.getReturnUrl,
    isCurrentPath: NavigationService.isCurrentPath,
    redirectAfterAuth: NavigationService.redirectAfterAuth,
    redirectAfterLogout: NavigationService.redirectAfterLogout,
    goBack: NavigationService.goBack,
    reload: NavigationService.reload
  };
};
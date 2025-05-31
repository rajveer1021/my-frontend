// src/hooks/useSafeUser.js - Safe user data access hook
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook that provides safe access to user data with fallbacks
 * This prevents components from breaking when user data is temporarily unavailable
 */
export const useSafeUser = () => {
  const { user, isAuthenticated, loading } = useAuth();

  // Helper function to get user display name with fallbacks
  const getDisplayName = () => {
    if (!user) return "Vendor";
    
    if (user.fullName) return user.fullName;
    if (user.firstName && user.lastName) return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    if (user.email) return user.email.split('@')[0];
    return "Vendor";
  };

  // Helper function to get user email with fallback
  const getEmail = () => {
    return user?.email || "vendor@example.com";
  };

  // Helper function to get user initials with fallbacks
  const getInitials = () => {
    if (!user) return "V";
    
    if (user.fullName) {
      const names = user.fullName.split(' ');
      if (names.length >= 2) {
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
      }
      return user.fullName.charAt(0).toUpperCase();
    }
    
    if (user.firstName && user.lastName) {
      return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
    }
    
    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    
    return "V";
  };

  // Helper function to get first name with fallback
  const getFirstName = () => {
    if (!user) return "Vendor";
    
    if (user.firstName) return user.firstName;
    if (user.fullName) return user.fullName.split(' ')[0];
    if (user.email) return user.email.split('@')[0];
    return "Vendor";
  };

  // Helper function to get last name with fallback
  const getLastName = () => {
    if (!user) return "";
    
    if (user.lastName) return user.lastName;
    if (user.fullName) {
      const names = user.fullName.split(' ');
      return names.length > 1 ? names[names.length - 1] : "";
    }
    return "";
  };

  // Helper function to get phone with fallback
  const getPhone = () => {
    return user?.phone || "";
  };

  // Helper function to get address with fallback
  const getAddress = () => {
    return user?.address || "";
  };

  // Helper function to get account type with fallback
  const getAccountType = () => {
    return user?.accountType || user?.userType?.toUpperCase() || "VENDOR";
  };

  // Helper function to check if user data is complete
  const isProfileComplete = () => {
    if (!user) return false;
    return !!(user.firstName && user.lastName && user.email);
  };

  // Helper function to get missing profile fields
  const getMissingFields = () => {
    if (!user) return ['firstName', 'lastName', 'email'];
    
    const missing = [];
    if (!user.firstName) missing.push('firstName');
    if (!user.lastName) missing.push('lastName');
    if (!user.email) missing.push('email');
    
    return missing;
  };

  return {
    // Raw user data (might be null)
    user,
    
    // Authentication state
    isAuthenticated,
    loading,
    
    // Safe accessors with fallbacks
    displayName: getDisplayName(),
    email: getEmail(),
    initials: getInitials(),
    firstName: getFirstName(),
    lastName: getLastName(),
    phone: getPhone(),
    address: getAddress(),
    accountType: getAccountType(),
    
    // Helper methods
    getDisplayName,
    getEmail,
    getInitials,
    getFirstName,
    getLastName,
    getPhone,
    getAddress,
    getAccountType,
    
    // Profile completeness helpers
    isProfileComplete: isProfileComplete(),
    missingFields: getMissingFields(),
    
    // Convenience flags
    hasUser: !!user,
    hasEmail: !!(user?.email),
    hasName: !!(user?.firstName || user?.fullName),
    hasPhone: !!(user?.phone),
    hasAddress: !!(user?.address),
  };
};
// src/contexts/AuthContext.jsx - Fixed with defensive user data management
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Local storage keys
const STORAGE_KEYS = {
  USER_DATA: 'vendorHub_userData',
  AUTH_TOKEN: 'authToken',
  USER_CACHE_TIMESTAMP: 'userCacheTimestamp'
};

// Cache duration (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Helper functions for localStorage management
  const saveUserToStorage = (userData) => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      localStorage.setItem(STORAGE_KEYS.USER_CACHE_TIMESTAMP, Date.now().toString());
      ('✅ User data saved to localStorage:', userData);
    } catch (error) {
      console.error('❌ Failed to save user data to localStorage:', error);
    }
  };

  const getUserFromStorage = () => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      const timestamp = localStorage.getItem(STORAGE_KEYS.USER_CACHE_TIMESTAMP);
      
      if (!userData || !timestamp) {
        return null;
      }

      // Check if cache is still valid
      const cacheAge = Date.now() - parseInt(timestamp);
      if (cacheAge > CACHE_DURATION) {
        ('📅 User cache expired, will refresh from API but keep using cached data');
        // Don't return null - return cached data but mark it as expired
      }

      const parsedUser = JSON.parse(userData);
      ('✅ User data loaded from localStorage:', parsedUser);
      return parsedUser;
    } catch (error) {
      console.error('❌ Failed to load user data from localStorage:', error);
      return null;
    }
  };

  const clearUserFromStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.USER_CACHE_TIMESTAMP);
      ('🗑️ User data cleared from localStorage');
    } catch (error) {
      console.error('❌ Failed to clear user data from localStorage:', error);
    }
  };

  // Helper function to validate user data quality
  const isValidUserData = (userData) => {
    if (!userData) return false;
    
    // Check for required fields
    const hasRequiredFields = !!(
      userData.id && 
      userData.email && 
      (userData.firstName || userData.fullName)
    );
    
    // Check for "undefined" strings which indicate bad data
    const hasUndefinedValues = (
      userData.firstName === "undefined" ||
      userData.lastName === "undefined" ||
      userData.fullName === "undefined undefined" ||
      userData.email === "undefined"
    );
    
    ('🔍 User data validation:', {
      userData,
      hasRequiredFields,
      hasUndefinedValues,
      isValid: hasRequiredFields && !hasUndefinedValues
    });
    
    return hasRequiredFields && !hasUndefinedValues;
  };

  // Helper function to merge user data intelligently
  const mergeUserData = (currentUser, newUser) => {
    if (!currentUser) return newUser;
    if (!newUser) return currentUser;
    
    // If new user data is invalid, keep current user
    if (!isValidUserData(newUser)) {
      ('⚠️ New user data is invalid, keeping current user data');
      return currentUser;
    }
    
    // If current user data is invalid, use new user
    if (!isValidUserData(currentUser)) {
      ('⚠️ Current user data is invalid, using new user data');
      return newUser;
    }
    
    // Both are valid, merge them (prefer new data but keep any missing fields from current)
    const merged = {
      ...currentUser,
      ...newUser,
      // Preserve good values if new ones are empty/undefined
      firstName: newUser.firstName || currentUser.firstName,
      lastName: newUser.lastName || currentUser.lastName,
      email: newUser.email || currentUser.email,
      id: newUser.id || currentUser.id,
      fullName: newUser.fullName !== "undefined undefined" ? newUser.fullName : currentUser.fullName
    };
    
    ('🔄 Merged user data:', { currentUser, newUser, merged });
    return merged;
  };

  const updateUserState = (userData) => {
    if (!userData) {
      setUser(null);
      setIsAuthenticated(false);
      clearUserFromStorage();
      return;
    }

    // Validate and potentially merge with existing data
    const currentUserData = user || getUserFromStorage();
    const finalUserData = mergeUserData(currentUserData, userData);
    
    setUser(finalUserData);
    setIsAuthenticated(!!finalUserData);
    saveUserToStorage(finalUserData);
  };

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if user is already authenticated
        const token = authService.getToken();
        ('🔑 Token found:', !!token);
        
        if (!token) {
          ('❌ No token found, user not authenticated');
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        // Set authenticated state immediately if token exists
        setIsAuthenticated(true);

        // Try to get user from localStorage first (immediate UI update)
        const cachedUser = getUserFromStorage();
        if (cachedUser && isValidUserData(cachedUser)) {
          ('⚡ Using cached user data for immediate UI update');
          setUser(cachedUser);
        }

        // Always try to fetch fresh user data from API (background update)
        try {
          ('🔄 Fetching fresh user data from API...');
          const currentUser = await authService.getCurrentUser();
          
          if (currentUser && isValidUserData(currentUser)) {
            ('✅ Fresh user data received from API:', currentUser);
            updateUserState(currentUser);
          } else if (currentUser) {
            ('⚠️ API returned incomplete user data, keeping cached data:', currentUser);
            // API returned incomplete data - keep using cached data if it's better
            if (cachedUser && isValidUserData(cachedUser)) {
              ('💾 Keeping cached user data due to incomplete API response');
              setUser(cachedUser);
              // Don't save the incomplete data to storage
            } else {
              ('❌ Both API and cached data are incomplete');
              setError('User data is incomplete. Please try logging in again.');
            }
          } else {
            ('❌ API returned no user data, token might be invalid');
            // Token is invalid, clear everything
            authService.logout();
            clearUserFromStorage();
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (apiError) {
          console.warn('⚠️ API fetch failed, using cached data if available:', apiError.message);
          
          // If we have cached user data, continue using it
          if (cachedUser && isValidUserData(cachedUser)) {
            ('💾 Continuing with cached user data due to API error');
            setUser(cachedUser);
          } else {
            ('❌ No valid cached data available');
            // Only clear auth if it's a 401 error (invalid token)
            if (apiError.status === 401) {
              authService.logout();
              clearUserFromStorage();
              setIsAuthenticated(false);
              setUser(null);
            } else {
              // For other errors (network, 500, etc.), keep auth state but show warning
              ('⚠️ Non-auth error, keeping user logged in');
              setError('Unable to sync user data. Some features may be limited.');
            }
          }
        }
      } catch (error) {
        console.error('💥 Auth initialization error:', error);
        setError('Failed to initialize authentication');
        // Keep any valid cached user data in case of initialization error
        const cachedUser = getUserFromStorage();
        if (cachedUser && isValidUserData(cachedUser) && authService.getToken()) {
          ('💾 Using cached user data despite initialization error');
          setUser(cachedUser);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      ('🔐 Attempting login for:', email);
      const result = await authService.login({ email, password });
      
      if (result && result.user) {
        ('✅ Login successful:', result.user);
        updateUserState(result.user);
        
        return {
          success: true,
          user: result.user,
          message: result.message
        };
      }
      
      throw new Error('Invalid response from login');
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      clearUserFromStorage();
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      ('📝 Attempting signup for:', userData.email);
      const result = await authService.signup(userData);
      
      if (result && result.user) {
        ('✅ Signup successful:', result.user);
        updateUserState(result.user);
        
        return {
          success: true,
          user: result.user,
          message: result.message
        };
      }
      
      throw new Error('Invalid response from signup');
    } catch (error) {
      console.error('❌ Signup error:', error);
      const errorMessage = error.message || 'Signup failed';
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      clearUserFromStorage();
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (googleToken, accountType = 'vendor') => {
    try {
      setLoading(true);
      setError(null);
      
      ('🔍 Attempting Google login');
      const result = await authService.googleAuth(googleToken, accountType);
      
      if (result && result.user) {
        ('✅ Google login successful:', result.user);
        updateUserState(result.user);
        
        return {
          success: true,
          user: result.user,
          message: result.message
        };
      }
      
      throw new Error('Invalid response from Google login');
    } catch (error) {
      console.error('❌ Google login error:', error);
      const errorMessage = error.message || 'Google login failed';
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      clearUserFromStorage();
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      ('📝 Updating user profile...');
      const updatedUser = await authService.updateProfile(userData);
      
      // Update both state and localStorage
      updateUserState(updatedUser);
      ('✅ User profile updated successfully');
      
      return {
        success: true,
        user: updatedUser
      };
    } catch (error) {
      console.error('❌ Profile update error:', error);
      const errorMessage = error.message || 'Profile update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email) => {
    try {
      setLoading(true);
      setError(null);
      
      const message = await authService.requestPasswordReset(email);
      
      return {
        success: true,
        message
      };
    } catch (error) {
      const errorMessage = error.message || 'Password reset request failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      
      const message = await authService.resetPassword(token, newPassword);
      
      return {
        success: true,
        message
      };
    } catch (error) {
      const errorMessage = error.message || 'Password reset failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    ('👋 Logging out user');
    authService.logout();
    clearUserFromStorage();
    setUser(null);
    setError(null);
    setIsAuthenticated(false);
    localStorage.removeItem('vendorOnboarded');
  };

  const clearError = () => {
    setError(null);
  };

  // Method to refresh user data manually
  const refreshUser = async () => {
    if (!authService.getToken()) {
      return;
    }

    try {
      setLoading(true);
      const currentUser = await authService.getCurrentUser();
      if (currentUser && isValidUserData(currentUser)) {
        updateUserState(currentUser);
      } else {
        ('⚠️ Refresh returned invalid user data, keeping current user');
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      // Don't throw error, just log it
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    signup,
    googleLogin,
    logout,
    updateUser,
    requestPasswordReset,
    resetPassword,
    clearError,
    refreshUser,
    getToken: authService.getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
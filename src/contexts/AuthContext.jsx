// src/contexts/AuthContext.jsx - Fixed with bypass
import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Local storage keys
const STORAGE_KEYS = {
  USER_DATA: "vendorHub_userData",
  AUTH_TOKEN: "authToken",
  USER_CACHE_TIMESTAMP: "userCacheTimestamp",
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
      localStorage.setItem(
        STORAGE_KEYS.USER_CACHE_TIMESTAMP,
        Date.now().toString()
      );
    } catch (error) {
      console.error("❌ Failed to save user data to localStorage:", error);
    }
  };

  const getUserFromStorage = () => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      const timestamp = localStorage.getItem(STORAGE_KEYS.USER_CACHE_TIMESTAMP);

      if (!userData || !timestamp) {
        return null;
      }

      const parsedUser = JSON.parse(userData);
      return parsedUser;
    } catch (error) {
      console.error("❌ Failed to load user data from localStorage:", error);
      return null;
    }
  };

  const clearUserFromStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.USER_CACHE_TIMESTAMP);
    } catch (error) {
      console.error("❌ Failed to clear user data from localStorage:", error);
    }
  };

  // Helper function to validate user data quality
  const isValidUserData = (userData) => {
    if (!userData) return false;

    const hasRequiredFields = !!(
      userData.id &&
      userData.email &&
      (userData.firstName || userData.fullName)
    );

    const hasUndefinedValues =
      userData.firstName === "undefined" ||
      userData.lastName === "undefined" ||
      userData.fullName === "undefined undefined" ||
      userData.email === "undefined";

    return hasRequiredFields && !hasUndefinedValues;
  };

  const mergeUserData = (currentUser, newUser) => {
    if (!currentUser) return newUser;
    if (!newUser) return currentUser;

    if (!isValidUserData(newUser)) {
      return currentUser;
    }

    if (!isValidUserData(currentUser)) {
      return newUser;
    }

    const merged = {
      ...currentUser,
      ...newUser,
      firstName: newUser.firstName || currentUser.firstName,
      lastName: newUser.lastName || currentUser.lastName,
      email: newUser.email || currentUser.email,
      id: newUser.id || currentUser.id,
      fullName:
        newUser.fullName !== "undefined undefined"
          ? newUser.fullName
          : currentUser.fullName,
    };

    return merged;
  };

  const updateUserState = (userData) => {
    if (!userData) {
      setUser(null);
      setIsAuthenticated(false);
      clearUserFromStorage();
      return;
    }

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

        const token = authService.getToken();

        if (!token) {
          setIsAuthenticated(false);
          setUser(null);
          return;
        }

        setIsAuthenticated(true);

        const cachedUser = getUserFromStorage();
        if (cachedUser && isValidUserData(cachedUser)) {
          setUser(cachedUser);
        }

        try {
          const currentUser = await authService.getCurrentUser();

          if (currentUser && isValidUserData(currentUser)) {
            updateUserState(currentUser);
          } else if (currentUser) {
            if (cachedUser && isValidUserData(cachedUser)) {
              setUser(cachedUser);
            } else {
              setError("User data is incomplete. Please try logging in again.");
            }
          } else {
            authService.logout();
            clearUserFromStorage();
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (apiError) {
          console.warn(
            "⚠️ API fetch failed, using cached data if available:",
            apiError.message
          );

          if (cachedUser && isValidUserData(cachedUser)) {
            setUser(cachedUser);
          } else {
            if (apiError.status === 401) {
              authService.logout();
              clearUserFromStorage();
              setIsAuthenticated(false);
              setUser(null);
            } else {
              setError(
                "Unable to sync user data. Some features may be limited."
              );
            }
          }
        }
      } catch (error) {
        console.error("💥 Auth initialization error:", error);
        setError("Failed to initialize authentication");
        const cachedUser = getUserFromStorage();
        if (
          cachedUser &&
          isValidUserData(cachedUser) &&
          authService.getToken()
        ) {
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

      const result = await authService.login({ email, password });

      if (result && result.user) {
        updateUserState(result.user);

        return {
          success: true,
          user: result.user,
          message: result.message,
        };
      }

      throw new Error("Invalid response from login");
    } catch (error) {
      console.error("❌ Login error:", error);
      const errorMessage = error.message || "Login failed";
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

      const result = await authService.signup(userData);

      if (result && result.user) {
        updateUserState(result.user);

        return {
          success: true,
          user: result.user,
          message: result.message,
        };
      }

      throw new Error("Invalid response from signup");
    } catch (error) {
      console.error("❌ Signup error:", error);
      const errorMessage = error.message || "Signup failed";
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      clearUserFromStorage();
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // BYPASS: Google login method - simplified without account type selection
  const googleLogin = async (googleToken, accountType = 'VENDOR') => {
    try {
      setLoading(true);
      setError(null);

      // BYPASS: Always use VENDOR and skip account type selection entirely
      const result = await authService.googleAuth(googleToken, 'VENDOR');

      // Since we're bypassing account type selection, we should always get a user back
      if (result && result.user) {
        updateUserState(result.user);

        return {
          success: true,
          user: result.user,
          message: result.message || 'Welcome to Multi-Vendor!',
        };
      }

      throw new Error("Invalid response from Google login");
    } catch (error) {
      console.error("❌ Google login error:", error);
      const errorMessage = error.message || "Google login failed";
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

      const updatedUser = await authService.updateProfile(userData);

      updateUserState(updatedUser);

      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      console.error("❌ Profile update error:", error);
      const errorMessage = error.message || "Profile update failed";
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
        message,
      };
    } catch (error) {
      const errorMessage = error.message || "Password reset request failed";
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
        message,
      };
    } catch (error) {
      const errorMessage = error.message || "Password reset failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    clearUserFromStorage();
    setUser(null);
    setError(null);
    setIsAuthenticated(false);
    localStorage.removeItem("vendorOnboarded");
  };

  const clearError = () => {
    setError(null);
  };

  const refreshUser = async () => {
    if (!authService.getToken()) {
      return;
    }

    try {
      setLoading(true);
      const currentUser = await authService.getCurrentUser();
      if (currentUser && isValidUserData(currentUser)) {
        updateUserState(currentUser);
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
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
    googleLogin, // Simplified method without account type selection
    logout,
    updateUser,
    requestPasswordReset,
    resetPassword,
    clearError,
    refreshUser,
    getToken: authService.getToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
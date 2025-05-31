// src/contexts/AuthContext.jsx - Corrected Complete Version
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { navigation } from '../utils/navigation';

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if user is already authenticated
        if (authService.isAuthenticated()) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError('Failed to initialize authentication');
        // Clear invalid token
        authService.logout();
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
      setUser(result.user);
      
      // Redirect using navigation utility
      navigation.redirectAfterAuth(result.user);
      
      return {
        success: true,
        user: result.user,
        message: result.message
      };
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
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
      setUser(result.user);
      
      // Redirect using navigation utility
      navigation.redirectAfterAuth(result.user);
      
      return {
        success: true,
        user: result.user,
        message: result.message
      };
    } catch (error) {
      const errorMessage = error.message || 'Signup failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (googleToken, accountType = 'vendor') => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await authService.googleAuth(googleToken, accountType);
      setUser(result.user);
      
      // Redirect using navigation utility
      navigation.redirectAfterAuth(result.user);
      
      return {
        success: true,
        user: result.user,
        message: result.message
      };
    } catch (error) {
      const errorMessage = error.message || 'Google login failed';
      setError(errorMessage);
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
      setUser(updatedUser);
      
      return {
        success: true,
        user: updatedUser
      };
    } catch (error) {
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
    authService.logout();
    setUser(null);
    setError(null);
    // Redirect using navigation utility
    navigation.redirectAfterLogout();
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    googleLogin,
    logout,
    updateUser,
    requestPasswordReset,
    resetPassword,
    clearError,
    isAuthenticated: authService.isAuthenticated(),
    getToken: authService.getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
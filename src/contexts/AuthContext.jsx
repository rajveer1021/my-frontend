// src/contexts/AuthContext.jsx - Fixed with proper token storage and persistence
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { vendorService } from '../services/vendorService';

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if user is already authenticated
        const token = authService.getToken();
        if (token) {
          console.log('Token found in localStorage:', token);
          setIsAuthenticated(true);
          
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            console.log('User fetched successfully:', currentUser);
            setUser(currentUser);
          } else {
            // Token is invalid, clear it
            console.log('Token invalid, clearing auth state');
            authService.logout();
            setIsAuthenticated(false);
            setUser(null);
          }
        } else {
          console.log('No token found in localStorage');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setError('Failed to initialize authentication');
        // Clear invalid token
        authService.logout();
        setIsAuthenticated(false);
        setUser(null);
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
      
      console.log('Attempting login for:', email);
      const result = await authService.login({ email, password });
      
      if (result && result.user) {
        console.log('Login successful, user:', result.user);
        console.log('Token stored:', authService.getToken());
        
        setUser(result.user);
        setIsAuthenticated(true);
        
        return {
          success: true,
          user: result.user,
          message: result.message
        };
      }
      
      throw new Error('Invalid response from login');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.message || 'Login failed';
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting signup for:', userData.email);
      const result = await authService.signup(userData);
      
      if (result && result.user) {
        console.log('Signup successful, user:', result.user);
        console.log('Token stored:', authService.getToken());
        
        setUser(result.user);
        setIsAuthenticated(true);
        
        return {
          success: true,
          user: result.user,
          message: result.message
        };
      }
      
      throw new Error('Invalid response from signup');
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.message || 'Signup failed';
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
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
      
      if (result && result.user) {
        setUser(result.user);
        setIsAuthenticated(true);
        
        return {
          success: true,
          user: result.user,
          message: result.message
        };
      }
      
      throw new Error('Invalid response from Google login');
    } catch (error) {
      const errorMessage = error.message || 'Google login failed';
      setError(errorMessage);
      setIsAuthenticated(false);
      setUser(null);
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
    console.log('Logging out user');
    authService.logout();
    setUser(null);
    setError(null);
    setIsAuthenticated(false);
    localStorage.removeItem('vendorOnboarded');
  };

  const clearError = () => {
    setError(null);
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
    getToken: authService.getToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
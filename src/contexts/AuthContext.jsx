import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, setCurrentUser, logout as logoutUser } from '../services/mockData';

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

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, accept any password for vendor email
    const mockUser = { 
      id: Date.now().toString(), 
      email, 
      fullName: 'John Vendor',
      userType: 'vendor',
      isVerified: true 
    };
    
    setCurrentUser(mockUser);
    setUser(mockUser);
    setLoading(false);
    return true;
  };

  const signup = async (userData) => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      userType: 'vendor', // Only vendor accounts allowed
      isVerified: true
    };
    
    setCurrentUser(newUser);
    setUser(newUser);
    setLoading(false);
    return true;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
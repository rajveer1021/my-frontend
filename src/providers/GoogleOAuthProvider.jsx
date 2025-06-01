// src/providers/GoogleOAuthProvider.jsx
import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GoogleAuthProvider = ({ children }) => {
  // For Vite, use import.meta.env instead of process.env
  const clientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID || 
                   (typeof process !== 'undefined' ? process.env?.REACT_APP_GOOGLE_CLIENT_ID : null);

  console.log('🔍 GoogleAuthProvider: Checking for client ID');
  console.log('📋 Available env vars:', import.meta.env);
  console.log('🔑 Client ID found:', !!clientId);

  if (!clientId) {
    console.warn('⚠️ Google Client ID not found. Google OAuth will not work.');
    console.warn('💡 For Vite: Add VITE_GOOGLE_CLIENT_ID to your .env file');
    console.warn('💡 For Create React App: Add REACT_APP_GOOGLE_CLIENT_ID to your .env file');
    
    // Return children without Google OAuth if no client ID
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthProvider;
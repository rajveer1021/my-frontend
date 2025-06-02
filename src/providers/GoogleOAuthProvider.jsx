// 1. First, update your Google OAuth Provider configuration
// src/providers/GoogleOAuthProvider.jsx

import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GoogleAuthProvider = ({ children }) => {
  const clientId = import.meta.env?.VITE_GOOGLE_CLIENT_ID || 
                   (typeof process !== 'undefined' ? process.env?.REACT_APP_GOOGLE_CLIENT_ID : null);

  if (!clientId) {
    // Return children without Google OAuth if no client ID
    return <>{children}</>;
  }


  return (
    <GoogleOAuthProvider 
      clientId={clientId}
      onScriptLoadError={() => console.error('Failed to load Google OAuth script')}
      onScriptLoadSuccess={() => console.log('Google OAuth script loaded successfully')}
    >
      {children}
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthProvider;
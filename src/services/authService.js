// src/services/authService.js - Fixed with better handling of incomplete API responses
import { apiService } from './api';

export const authService = {
  async login(credentials) {
    try {
      ('🔐 AuthService: Attempting login...');
      const response = await apiService.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      if (response.success && response.data && response.data.token) {
        // Store token IMMEDIATELY after successful response
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        ('✅ AuthService: Token stored successfully');
        
        // Transform API response to match app structure
        const user = this.transformUserData(response.data.user);
        ('✅ AuthService: Login successful, user data:', user);

        return {
          user,
          token: token,
          message: response.message
        };
      }

      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('❌ AuthService: Login error:', error);
      // Make sure to clear any partial token on error
      localStorage.removeItem('authToken');
      throw new Error(error.message || 'Login failed');
    }
  },

  async signup(userData) {
    try {
      ('📝 AuthService: Attempting signup...');
      const response = await apiService.post('/auth/signup', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        accountType: userData.userType?.toUpperCase() || userData.accountType || 'VENDOR'
      });

      if (response.success && response.data && response.data.token) {
        // Store token IMMEDIATELY after successful response
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        ('✅ AuthService: Token stored successfully');
        
        // Transform API response to match app structure
        const user = this.transformUserData(response.data.user);
        ('✅ AuthService: Signup successful, user data:', user);

        return {
          user,
          token: token,
          message: response.message
        };
      }

      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('❌ AuthService: Signup error:', error);
      // Make sure to clear any partial token on error
      localStorage.removeItem('authToken');
      throw new Error(error.message || 'Signup failed');
    }
  },

  async googleAuth(token, accountType = 'VENDOR') {
    try {
      ('🔍 AuthService: Attempting Google auth...');
      const response = await apiService.post('/auth/google', {
        token,
        accountType: accountType.toUpperCase()
      });

      if (response.success && response.data && response.data.token) {
        // Store token IMMEDIATELY after successful response
        const authToken = response.data.token;
        localStorage.setItem('authToken', authToken);
        ('✅ AuthService: Google auth token stored successfully');
        
        // Transform API response to match app structure
        const user = this.transformUserData(response.data.user);
        ('✅ AuthService: Google auth successful, user data:', user);

        return {
          user,
          token: authToken,
          message: response.message
        };
      }

      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('❌ AuthService: Google auth error:', error);
      // Make sure to clear any partial token on error
      localStorage.removeItem('authToken');
      throw new Error(error.message || 'Google authentication failed');
    }
  },

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        ('❌ AuthService: No token found');
        return null;
      }

      ('🔄 AuthService: Fetching current user...');
      
      // Verify token and get current user
      const response = await apiService.get('/auth/profile');
      
      if (response.success && response.data) {
        const user = this.transformUserData(response.data);
        ('✅ AuthService: Current user fetched successfully:', user);
        
        // Validate that we got meaningful data
        if (this.isValidUserData(user)) {
          return user;
        } else {
          ('⚠️ AuthService: API returned incomplete user data:', user);
          return user; // Return anyway, let AuthContext decide what to do
        }
      }

      ('❌ AuthService: Invalid response from profile endpoint');
      return null;
    } catch (error) {
      console.error('❌ AuthService: Get current user error:', error);
      // If token is invalid, remove it
      if (error.status === 401) {
        ('🗑️ AuthService: Removing invalid token');
        localStorage.removeItem('authToken');
      }
      return null;
    }
  },

  async updateProfile(userData) {
    try {
      ('📝 AuthService: Updating profile...');
      
      // Prepare the request payload according to API specification
      const payload = {};
      
      if (userData.firstName) payload.firstName = userData.firstName;
      if (userData.lastName) payload.lastName = userData.lastName;
      if (userData.phone !== undefined) payload.phone = userData.phone; // Allow empty string
      if (userData.address !== undefined) payload.address = userData.address; // Allow empty string

      ('📤 AuthService: Profile update payload:', payload);

      const response = await apiService.put('/auth/profile', payload);

      if (response.success && response.data && response.data.user) {
        // Transform API response to match app structure
        const user = this.transformUserData(response.data.user);
        ('✅ AuthService: Profile updated successfully:', user);
        return user;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('❌ AuthService: Profile update error:', error);
      throw new Error(error.message || 'Profile update failed');
    }
  },

  // Helper method to transform and validate user data from API
  transformUserData(apiUserData) {
    if (!apiUserData) {
      ('⚠️ AuthService: No user data provided to transform');
      return null;
    }

    ('🔄 AuthService: Transforming user data:', apiUserData);

    // Helper function to clean undefined values
    const cleanValue = (value) => {
      if (value === null || value === undefined || value === 'undefined') {
        return '';
      }
      return String(value);
    };

    // Extract and clean the data
    const firstName = cleanValue(apiUserData.firstName);
    const lastName = cleanValue(apiUserData.lastName);
    
    // Build fullName intelligently
    let fullName = '';
    if (firstName && lastName) {
      fullName = `${firstName} ${lastName}`;
    } else if (firstName) {
      fullName = firstName;
    } else if (lastName) {
      fullName = lastName;
    }

    const user = {
      id: apiUserData.id || '',
      email: cleanValue(apiUserData.email),
      fullName: fullName,
      firstName: firstName,
      lastName: lastName,
      accountType: apiUserData.accountType || 'VENDOR',
      userType: (apiUserData.accountType || 'VENDOR').toLowerCase(),
      phone: cleanValue(apiUserData.phone),
      address: cleanValue(apiUserData.address)
    };

    ('✅ AuthService: Transformed user data:', user);
    return user;
  },

  // Helper method to validate user data quality
  isValidUserData(userData) {
    if (!userData) return false;
    
    const hasRequiredFields = !!(
      userData.id && 
      userData.email && 
      userData.email !== 'undefined' &&
      (userData.firstName || userData.fullName) &&
      userData.firstName !== 'undefined' &&
      userData.fullName !== 'undefined undefined'
    );
    
    ('🔍 AuthService: User data validation:', {
      userData,
      hasRequiredFields,
      hasId: !!userData.id,
      hasEmail: !!userData.email && userData.email !== 'undefined',
      hasName: !!(userData.firstName || userData.fullName) && userData.firstName !== 'undefined'
    });
    
    return hasRequiredFields;
  },

  async requestPasswordReset(email) {
    try {
      ('📧 AuthService: Requesting password reset for:', email);
      const response = await apiService.post('/auth/forgot-password', { email });
      ('✅ AuthService: Password reset email sent');
      return response.message || 'Password reset email sent';
    } catch (error) {
      console.error('❌ AuthService: Password reset request error:', error);
      throw new Error(error.message || 'Password reset request failed');
    }
  },

  async resetPassword(token, newPassword) {
    try {
      ('🔄 AuthService: Resetting password...');
      const response = await apiService.post('/auth/reset-password', {
        token,
        password: newPassword
      });
      ('✅ AuthService: Password reset successful');
      return response.message || 'Password reset successful';
    } catch (error) {
      console.error('❌ AuthService: Password reset error:', error);
      throw new Error(error.message || 'Password reset failed');
    }
  },

  logout() {
    ('👋 AuthService: Logging out...');
    localStorage.removeItem('authToken');
    ('✅ AuthService: Logout completed');
  },

  // Helper method to check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const isAuth = !!token;
    ('🔍 AuthService: Authentication check:', isAuth);
    return isAuth;
  },

  // Helper method to get stored token
  getToken() {
    const token = localStorage.getItem('authToken');
    if (token) {
      ('🔑 AuthService: Token retrieved from storage');
    } else {
      ('❌ AuthService: No token in storage');
    }
    return token;
  },

  // Helper method to validate token format (basic check)
  isValidTokenFormat(token) {
    if (!token || typeof token !== 'string') return false;
    // Basic JWT format check (3 parts separated by dots)
    const parts = token.split('.');
    return parts.length === 3;
  },

  // Helper method to check if token is expired (basic check)
  isTokenExpired(token) {
    if (!token || !this.isValidTokenFormat(token)) return true;
    
    try {
      // Decode the payload (second part of JWT)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // Check if token has exp claim and if it's expired
      if (payload.exp && payload.exp < currentTime) {
        ('⏰ AuthService: Token is expired');
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ AuthService: Error checking token expiration:', error);
      return true; // Assume expired if we can't parse it
    }
  },

  // Helper method to clean up invalid tokens
  cleanupInvalidToken() {
    const token = this.getToken();
    if (token && (this.isTokenExpired(token) || !this.isValidTokenFormat(token))) {
      ('🧹 AuthService: Cleaning up invalid/expired token');
      this.logout();
      return true;
    }
    return false;
  }
};
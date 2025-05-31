// src/services/authService.js - Fixed  statements
import { apiService } from './api';

export const authService = {
  async login(credentials) {
    try {
      const response = await apiService.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      if (response.success && response.data && response.data.token) {
        // Store token IMMEDIATELY after successful response
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        
        // Transform API response to match app structure
        const user = this.transformUserData(response.data.user);

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
        
        // Transform API response to match app structure
        const user = this.transformUserData(response.data.user);

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
      const response = await apiService.post('/auth/google', {
        token,
        accountType: accountType.toUpperCase()
      });

      if (response.success && response.data && response.data.token) {
        // Store token IMMEDIATELY after successful response
        const authToken = response.data.token;
        localStorage.setItem('authToken', authToken);
        
        // Transform API response to match app structure
        const user = this.transformUserData(response.data.user);

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
        return null;
      }
      
      // Verify token and get current user
      const response = await apiService.get('/auth/profile');
      
      if (response.success && response.data) {
        const user = this.transformUserData(response.data);
        
        // Validate that we got meaningful data
        if (this.isValidUserData(user)) {
          return user;
        } else {
          return user; // Return anyway, let AuthContext decide what to do
        }
      }

      return null;
    } catch (error) {
      // If token is invalid, remove it
      if (error.status === 401) {
        localStorage.removeItem('authToken');
      }
      return null;
    }
  },

  async updateProfile(userData) {
    try {      
      // Prepare the request payload according to API specification
      const payload = {};
      
      if (userData.firstName) payload.firstName = userData.firstName;
      if (userData.lastName) payload.lastName = userData.lastName;

      const response = await apiService.put('/auth/profile', payload);

      if (response.success && response.data && response.data.user) {
        // Transform API response to match app structure
        const user = this.transformUserData(response.data.user);
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
      return null;
    }

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
    };

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

    return hasRequiredFields;
  },


  logout() {
    localStorage.removeItem('authToken');
  },

  // Helper method to check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const isAuth = !!token;
    return isAuth;
  },

  // Helper method to get stored token
  getToken() {
    const token = localStorage.getItem('authToken');
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
        return true;
      }
      
      return false;
    } catch (error) {
      return true; // Assume expired if we can't parse it
    }
  },

  // Helper method to clean up invalid tokens
  cleanupInvalidToken() {
    const token = this.getToken();
    if (token && (this.isTokenExpired(token) || !this.isValidTokenFormat(token))) {
      this.logout();
      return true;
    }
    return false;
  }
};
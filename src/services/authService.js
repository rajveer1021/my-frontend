// src/services/authService.js - Updated with correct profile update API
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
        const user = {
          id: response.data.user.id,
          email: response.data.user.email,
          fullName: `${response.data.user.firstName} ${response.data.user.lastName}`,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          accountType: response.data.user.accountType,
          userType: response.data.user.accountType.toLowerCase() // for compatibility
        };

        return {
          user,
          token: token,
          message: response.message
        };
      }

      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('AuthService: Login error:', error);
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
        const user = {
          id: response.data.user.id,
          email: response.data.user.email,
          fullName: `${response.data.user.firstName} ${response.data.user.lastName}`,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          accountType: response.data.user.accountType,
          userType: response.data.user.accountType.toLowerCase()
        };

        return {
          user,
          token: token,
          message: response.message
        };
      }

      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('AuthService: Signup error:', error);
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
        const user = {
          id: response.data.user.id,
          email: response.data.user.email,
          fullName: `${response.data.user.firstName} ${response.data.user.lastName}`,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          accountType: response.data.user.accountType,
          userType: response.data.user.accountType.toLowerCase()
        };

        return {
          user,
          token: authToken,
          message: response.message
        };
      }

      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('AuthService: Google auth error:', error);
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
        const user = {
          id: response.data.id,
          email: response.data.email,
          fullName: `${response.data.firstName} ${response.data.lastName}`,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          accountType: response.data.accountType,
          phone: response.data.phone,
          address: response.data.address
        };
        return user;
      }

      return null;
    } catch (error) {
      console.error('AuthService: Get current user error:', error);
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
      if (userData.phone !== undefined) payload.phone = userData.phone; // Allow empty string
      if (userData.address !== undefined) payload.address = userData.address; // Allow empty string

      const response = await apiService.put('/auth/profile', payload);

      if (response.success && response.data && response.data.user) {
        // Transform API response to match app structure
        const user = {
          id: response.data.user.id,
          email: response.data.user.email,
          fullName: `${response.data.user.firstName} ${response.data.user.lastName}`,
          firstName: response.data.user.firstName,
          lastName: response.data.user.lastName,
          accountType: response.data.user.accountType,
          userType: response.data.user.accountType?.toLowerCase(),
          phone: response.data.user.phone,
          address: response.data.user.address
        };

        return user;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      throw new Error(error.message || 'Profile update failed');
    }
  },

  async requestPasswordReset(email) {
    try {
      const response = await apiService.post('/auth/forgot-password', { email });
      return response.message || 'Password reset email sent';
    } catch (error) {
      throw new Error(error.message || 'Password reset request failed');
    }
  },

  async resetPassword(token, newPassword) {
    try {
      const response = await apiService.post('/auth/reset-password', {
        token,
        password: newPassword
      });
      return response.message || 'Password reset successful';
    } catch (error) {
      throw new Error(error.message || 'Password reset failed');
    }
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
  }
};
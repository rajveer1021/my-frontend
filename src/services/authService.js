// src/services/authService.js
import { apiService } from './api';

export const authService = {
  async login(credentials) {
    try {
      const response = await apiService.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      if (response.success && response.data) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.token);
        
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
          token: response.data.token,
          message: response.message
        };
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Login error:', error);
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

      if (response.success && response.data) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.token);
        
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
          token: response.data.token,
          message: response.message
        };
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Signup failed');
    }
  },

  async googleAuth(token, accountType = 'VENDOR') {
    try {
      const response = await apiService.post('/auth/google', {
        token,
        accountType: accountType.toUpperCase()
      });

      if (response.success && response.data) {
        // Store token in localStorage
        localStorage.setItem('authToken', response.data.token);
        
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
          token: response.data.token,
          message: response.message
        };
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Google auth error:', error);
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
      const response = await apiService.get('/auth/me');
      
      if (response.success && response.data) {
        const user = {
          id: response.data.id,
          email: response.data.email,
          fullName: `${response.data.firstName} ${response.data.lastName}`,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          accountType: response.data.accountType,
          userType: response.data.accountType.toLowerCase()
        };

        return user;
      }

      return null;
    } catch (error) {
      console.error('Get current user error:', error);
      // If token is invalid, remove it
      localStorage.removeItem('authToken');
      return null;
    }
  },

  async updateProfile(userData) {
    try {
      const response = await apiService.put('/auth/profile', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        address: userData.address
      });

      if (response.success && response.data) {
        const user = {
          id: response.data.id,
          email: response.data.email,
          fullName: `${response.data.firstName} ${response.data.lastName}`,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          accountType: response.data.accountType,
          userType: response.data.accountType.toLowerCase(),
          phone: response.data.phone,
          address: response.data.address
        };

        return user;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error(error.message || 'Profile update failed');
    }
  },

  async requestPasswordReset(email) {
    try {
      const response = await apiService.post('/auth/forgot-password', { email });
      return response.message || 'Password reset email sent';
    } catch (error) {
      console.error('Password reset error:', error);
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
      console.error('Reset password error:', error);
      throw new Error(error.message || 'Password reset failed');
    }
  },

  logout() {
    localStorage.removeItem('authToken');
  },

  // Helper method to check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  // Helper method to get stored token
  getToken() {
    return localStorage.getItem('authToken');
  }
};
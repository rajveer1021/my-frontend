// src/services/authService.js - Fixed with proper token storage
import { apiService } from './api';

export const authService = {
  async login(credentials) {
    try {
      console.log('AuthService: Attempting login...');
      const response = await apiService.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      console.log('AuthService: Login response:', response);

      if (response.success && response.data && response.data.token) {
        // Store token IMMEDIATELY after successful response
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        console.log('AuthService: Token stored in localStorage:', token);
        
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

        console.log('AuthService: User object created:', user);

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
      console.log('AuthService: Attempting signup...');
      const response = await apiService.post('/auth/signup', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        accountType: userData.userType?.toUpperCase() || userData.accountType || 'VENDOR'
      });

      console.log('AuthService: Signup response:', response);

      if (response.success && response.data && response.data.token) {
        // Store token IMMEDIATELY after successful response
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        console.log('AuthService: Token stored in localStorage:', token);
        
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

        console.log('AuthService: User object created:', user);

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
      console.log('AuthService: Attempting Google auth...');
      const response = await apiService.post('/auth/google', {
        token,
        accountType: accountType.toUpperCase()
      });

      console.log('AuthService: Google auth response:', response);

      if (response.success && response.data && response.data.token) {
        // Store token IMMEDIATELY after successful response
        const authToken = response.data.token;
        localStorage.setItem('authToken', authToken);
        console.log('AuthService: Token stored in localStorage:', authToken);
        
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
      console.log('AuthService: Getting current user, token:', token);
      
      if (!token) {
        console.log('AuthService: No token found');
        return null;
      }

      // Verify token and get current user
      const response = await apiService.get('/auth/profile');
      console.log('AuthService: Current user response:', response);
      
      if (response.success && response.data) {
        const user = {
          id: response.data.id,
          email: response.data.email,
          fullName: `${response.data.firstName} ${response.data.lastName}`,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          accountType: response.data.accountType,
        };

        console.log('AuthService: Current user parsed:', user);
        return user;
      }

      console.log('AuthService: Invalid user response');
      return null;
    } catch (error) {
      console.error('AuthService: Get current user error:', error);
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
      console.error('AuthService: Update profile error:', error);
      throw new Error(error.message || 'Profile update failed');
    }
  },

  async requestPasswordReset(email) {
    try {
      const response = await apiService.post('/auth/forgot-password', { email });
      return response.message || 'Password reset email sent';
    } catch (error) {
      console.error('AuthService: Password reset error:', error);
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
      console.error('AuthService: Reset password error:', error);
      throw new Error(error.message || 'Password reset failed');
    }
  },

  logout() {
    console.log('AuthService: Logging out, removing token');
    localStorage.removeItem('authToken');
  },

  // Helper method to check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const isAuth = !!token;
    console.log('AuthService: isAuthenticated check, token exists:', isAuth);
    return isAuth;
  },

  // Helper method to get stored token
  getToken() {
    const token = localStorage.getItem('authToken');
    console.log('AuthService: getToken called, token:', token);
    return token;
  }
};
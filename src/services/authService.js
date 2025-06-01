// src/services/authService.js - Fixed with VENDOR bypass
import { apiService } from './api';

export const authService = {
  async login(credentials) {
    try {
      const response = await apiService.post('/auth/login', {
        email: credentials.email,
        password: credentials.password
      });

      if (response.success && response.data && response.data.token) {
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        
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
        const token = response.data.token;
        localStorage.setItem('authToken', token);
        
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
      localStorage.removeItem('authToken');
      throw new Error(error.message || 'Signup failed');
    }
  },

  // BYPASS: Google authentication with default VENDOR account type
  async googleAuth(googleCredential, accountType = 'VENDOR') {
    try {      
      if (!googleCredential) {
        throw new Error('Google credential is required');
      }

      // BYPASS: Always use VENDOR account type for deployment
      const payload = {
        credential: googleCredential,
        accountType: 'VENDOR' // Force VENDOR for bypass
      };

      console.log('🔧 Google Auth Bypass: Using VENDOR account type');

      const response = await apiService.post('/auth/google', payload);

      // BYPASS: Skip account type selection flow entirely
      if (response.success && response.data && response.data.token) {
        const authToken = response.data.token;
        localStorage.setItem('authToken', authToken);
        
        const user = this.transformUserData(response.data.user);

        return {
          success: true,
          user,
          token: authToken,
          message: response.message || 'Google authentication successful'
        };
      }

      // If the response indicates account type selection is needed, bypass it
      if (response.success && response.needsAccountTypeSelection) {
        console.log('🔧 Bypassing account type selection - calling setGoogleUserAccountType directly');
        
        // Try to set account type automatically
        try {
          const setAccountTypeResponse = await apiService.post('/auth/google/set-account-type', {
            email: response.userInfo.email,
            googleId: response.userInfo.googleId,
            accountType: 'VENDOR',
            userInfo: {
              firstName: response.userInfo.firstName || response.userInfo.name?.split(' ')[0] || 'User',
              lastName: response.userInfo.lastName || response.userInfo.name?.split(' ').slice(1).join(' ') || '',
              name: response.userInfo.name,
              picture: response.userInfo.picture
            }
          });

          if (setAccountTypeResponse.success && setAccountTypeResponse.data && setAccountTypeResponse.data.token) {
            const authToken = setAccountTypeResponse.data.token;
            localStorage.setItem('authToken', authToken);
            
            const user = this.transformUserData(setAccountTypeResponse.data.user);

            return {
              success: true,
              user,
              token: authToken,
              message: setAccountTypeResponse.message || 'Account created successfully with VENDOR access'
            };
          }
        } catch (setAccountError) {
          console.error('❌ Failed to set account type automatically:', setAccountError);
          // Fall through to original error handling
        }
      }

      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('❌ AuthService: Google auth error:', error);
      
      localStorage.removeItem('authToken');
      
      // Provide specific error messages based on response
      let errorMessage = 'Google authentication failed';
      
      if (error.status) {
        const status = error.status;
        const serverMessage = error.message;
        
        switch (status) {
          case 400:
            errorMessage = serverMessage || 'Invalid Google credential';
            break;
          case 401:
            errorMessage = 'Google authentication failed. Please try again.';
            break;
          case 409:
            errorMessage = serverMessage || 'An account with this email already exists with a different account type';
            break;
          case 422:
            errorMessage = serverMessage || 'Invalid account type or missing data';
            break;
          case 500:
            errorMessage = 'Server error during authentication. Please try again later.';
            break;
          default:
            errorMessage = serverMessage || `Authentication failed (Error ${status})`;
        }
      } else if (error.message?.includes('Network Error') || error.message?.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else {
        errorMessage = error.message || 'Google authentication failed';
      }
      
      throw new Error(errorMessage);
    }
  },

  async getCurrentUser() {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        return null;
      }
      
      const response = await apiService.get('/auth/profile');
      
      if (response.success && response.data) {
        const user = this.transformUserData(response.data.user);
        return user;
      }

      return null;
    } catch (error) {
      if (error.status === 401) {
        localStorage.removeItem('authToken');
      }
      return null;
    }
  },

  async updateProfile(userData) {
    try {      
      const payload = {};
      
      if (userData.firstName) payload.firstName = userData.firstName;
      if (userData.lastName) payload.lastName = userData.lastName;

      const response = await apiService.put('/auth/profile', payload);

      if (response.success && response.data && response.data.user) {
        const user = this.transformUserData(response.data.user);
        return user;
      }

      throw new Error('Invalid response format');
    } catch (error) {
      console.error('❌ AuthService: Profile update error:', error);
      throw new Error(error.message || 'Profile update failed');
    }
  },

  async requestPasswordReset(email) {
    try {
      const response = await apiService.post('/auth/forgot-password', { email });
      
      if (response.success) {
        return response.message || 'Password reset email sent successfully';
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('❌ AuthService: Password reset request error:', error);
      throw new Error(error.message || 'Failed to send password reset email');
    }
  },

  async resetPassword(token, newPassword) {
    try {
      const response = await apiService.post('/auth/reset-password', {
        token,
        password: newPassword
      });
      
      if (response.success) {
        return response.message || 'Password reset successfully';
      }
      
      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('❌ AuthService: Password reset error:', error);
      throw new Error(error.message || 'Failed to reset password');
    }
  },

  // Helper method to transform user data from API
  transformUserData(apiUserData) {
    if (!apiUserData) {
      return null;
    }

    const cleanValue = (value) => {
      if (value === null || value === undefined || value === 'undefined') {
        return '';
      }
      return String(value);
    };

    const firstName = cleanValue(apiUserData.firstName);
    const lastName = cleanValue(apiUserData.lastName);
    
    let fullName = '';
    if (firstName && lastName) {
      fullName = `${firstName} ${lastName}`;
    } else if (firstName) {
      fullName = firstName;
    } else if (lastName) {
      fullName = lastName;
    }

    return {
      id: apiUserData.id || '',
      email: cleanValue(apiUserData.email),
      fullName: fullName,
      firstName: firstName,
      lastName: lastName,
      accountType: apiUserData.accountType || 'VENDOR',
      googleId: apiUserData.googleId || null,
      picture: apiUserData.picture || null,
      emailVerified: apiUserData.emailVerified || false,
    };
  },

  // Helper method to validate user data
  isValidUserData(userData) {
    if (!userData) return false;
    
    return !!(
      userData.id && 
      userData.email && 
      userData.email !== 'undefined' &&
      (userData.firstName || userData.fullName) &&
      userData.firstName !== 'undefined' &&
      userData.fullName !== 'undefined undefined'
    );
  },

  logout() {
    localStorage.removeItem('authToken');
  },

  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  getToken() {
    return localStorage.getItem('authToken');
  },

  isValidTokenFormat(token) {
    if (!token || typeof token !== 'string') return false;
    const parts = token.split('.');
    return parts.length === 3;
  },

  isTokenExpired(token) {
    if (!token || !this.isValidTokenFormat(token)) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp && payload.exp < currentTime) {
        return true;
      }
      
      return false;
    } catch (error) {
      return true;
    }
  },

  cleanupInvalidToken() {
    const token = this.getToken();
    if (token && (this.isTokenExpired(token) || !this.isValidTokenFormat(token))) {
      this.logout();
      return true;
    }
    return false;
  }
};
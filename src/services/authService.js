import { apiService } from './api';

// Mock user data for development
const mockUser = {
  id: 1,
  fullName: 'John Vendor',
  email: 'vendor@example.com',
  phone: '+1 (555) 123-4567',
  address: '123 Business St, Suite 100, City, State 12345',
  businessName: 'Tech Solutions Ltd',
  profileStatus: 'Verified'
};

export const authService = {
  async login(credentials) {
    // Mock login - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (credentials.email === 'vendor@example.com' && credentials.password === 'password') {
      return {
        user: mockUser,
        token: 'mock-jwt-token'
      };
    }
    
    throw new Error('Invalid credentials');
  },

  async getCurrentUser() {
    // Mock - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUser;
  },

  async updateProfile(userData) {
    // Mock - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { ...mockUser, ...userData };
  }
};
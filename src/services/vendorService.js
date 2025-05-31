// src/services/vendorService.js
import { apiService } from './api';

export const vendorService = {
  // Get vendor profile and completion status
  async getVendorProfile() {
    try {
      const response = await apiService.get('/vendor/profile');
      
      if (response.success && response.data) {
        return {
          vendor: response.data.vendor,
          completion: response.data.completion
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Get vendor profile error:', error);
      throw new Error(error.message || 'Failed to fetch vendor profile');
    }
  },

  // Step 1: Vendor Type
  async updateStep1(vendorType) {
    try {
      const response = await apiService.post('/vendor/onboarding/step1', {
        vendorType: vendorType.toUpperCase()
      });
      
      if (response.success && response.data) {
        return {
          vendor: response.data.vendor,
          completion: response.data.completion
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Update step 1 error:', error);
      throw new Error(error.message || 'Failed to update vendor type');
    }
  },

  // Step 2: Business Information
  async updateStep2(businessData) {
    try {
      const response = await apiService.post('/vendor/onboarding/step2', {
        businessName: businessData.businessName,
        businessAddress1: businessData.businessAddress1,
        businessAddress2: businessData.businessAddress2 || '',
        city: businessData.city,
        state: businessData.state,
        postalCode: businessData.postalCode
      });
      
      if (response.success && response.data) {
        return {
          vendor: response.data.vendor,
          completion: response.data.completion
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Update step 2 error:', error);
      throw new Error(error.message || 'Failed to update business information');
    }
  },

  // Step 3: Documents (GST for now)
  async updateStep3(gstNumber) {
    try {
      const response = await apiService.post('/vendor/onboarding/step3', {
        gstNumber: gstNumber
      });
      
      if (response.success && response.data) {
        return {
          vendor: response.data.vendor,
          completion: response.data.completion
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Update step 3 error:', error);
      throw new Error(error.message || 'Failed to update documents');
    }
  }
};
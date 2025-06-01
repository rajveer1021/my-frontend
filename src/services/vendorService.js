// src/services/vendorService.js - Complete fixed frontend service

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
        vendorType: String(vendorType).toUpperCase()
      });
      
      if (response.success && response.data) {
        return {
          vendor: response.data.vendor,
          completion: response.data.completion
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Step 1 update error:', error);
      throw new Error(error.message || 'Failed to update vendor type');
    }
  },

  // Step 2: Business Information
  async updateStep2(businessData) {
    try {
      
      const payload = {
        businessName: String(businessData.businessName || ''),
        businessAddress1: String(businessData.businessAddress1 || ''),
        businessAddress2: String(businessData.businessAddress2 || ''),
        city: String(businessData.city || ''),
        state: String(businessData.state || ''),
        postalCode: String(businessData.postalCode || '')
      };
      
      const response = await apiService.post('/vendor/onboarding/step2', payload);
      
      if (response.success && response.data) {
        return {
          vendor: response.data.vendor,
          completion: response.data.completion
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Step 2 update error:', error);
      throw new Error(error.message || 'Failed to update business information');
    }
  },

  // Step 3: Documents - FIXED VERSION
  async updateStep3(step3Data) {
    try {
      
      // Create completely clean payload with explicit string conversion
      const cleanPayload = {
        verificationType: String(step3Data.verificationType || '').toLowerCase()
      };
      
      // Handle GST data
      if (step3Data.gstNumber !== undefined && step3Data.gstNumber !== null) {
        cleanPayload.gstNumber = String(step3Data.gstNumber || '');
      }
      
      // Handle manual verification data
      if (step3Data.idType !== undefined && step3Data.idType !== null) {
        cleanPayload.idType = String(step3Data.idType || '').toLowerCase();
      }
      
      if (step3Data.idNumber !== undefined && step3Data.idNumber !== null) {
        cleanPayload.idNumber = String(step3Data.idNumber || '');
      }

      const response = await apiService.post('/vendor/onboarding/step3', cleanPayload);
      
      if (response.success && response.data) {
        return {
          vendor: response.data.vendor,
          completion: response.data.completion
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('❌ Step 3 update error:', error);
      throw new Error(error.message || 'Failed to update documents');
    }
  }
};
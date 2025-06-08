// src/services/subscriptionService.js
import { apiService } from './api';

export const subscriptionService = {
  // ===== SUBSCRIPTION PLANS APIS =====
  
  // Get all subscription plans
  async getPlans() {
    try {
      const url = `/subscriptions`;
      console.log('Fetching subscription plans from:', url);
      
      const response = await apiService.get(url);
      
      // Handle different possible response formats
      if (response.success) {
        // If response has the expected structure
        if (response.data && response.data.plans) {
          return {
            success: true,
            data: {
              plans: response.data.plans || [],
              stats: response.data.stats || {}
            }
          };
        }
        
        // If response data is directly an array (simpler format)
        if (Array.isArray(response.data)) {
          return {
            success: true,
            data: {
              plans: response.data,
              stats: {}
            }
          };
        }
        
        // If response is the plans array directly
        if (response.plans) {
          return {
            success: true,
            data: {
              plans: response.plans,
              stats: response.stats || {}
            }
          };
        }

        // If response.data is the plan object directly
        if (response.data) {
          return {
            success: true,
            data: {
              plans: [response.data],
              stats: {}
            }
          };
        }
      }
      
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Get subscription plans error:', error);
      
      // Check if it's a network error
      if (error.response?.status === 401) {
        throw new Error('Authentication required. Please login again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      } else if (error.response?.status === 404) {
        throw new Error('Subscription plans endpoint not found.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      
      throw new Error(error.message || 'Failed to fetch subscription plans');
    }
  },

  // Get single subscription plan details
  async getPlan(planId) {
    try {
      const response = await apiService.get(`/subscriptions/${planId}`);
      
      if (response.success) {
        return {
          success: true,
          data: response.data.plan || response.data
        };
      }
      
      throw new Error('Subscription plan not found');
    } catch (error) {
      console.error('Get subscription plan error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Subscription plan not found');
      }
      
      throw new Error(error.message || 'Failed to fetch subscription plan details');
    }
  },

  // Create new subscription plan
  async createPlan(planData) {
    try {
      console.log('Creating plan with data:', planData);
      
      // Ensure data matches backend schema exactly
      const apiData = {
        name: planData.name,
        description: planData.description,
        price: planData.price,
        isActive: planData.isActive,
        isPopular: planData.isPopular
      };

      // Only include originalPrice if provided
      if (planData.originalPrice) {
        apiData.originalPrice = planData.originalPrice;
      }

      // Only include limits if provided
      if (planData.limits) {
        apiData.limits = planData.limits;
      }
      
      // Make the API call
      const response = await apiService.post('/subscriptions/', apiData);
      console.log('Create plan response:', response);

      // Handle successful response
      if (response && (response.success !== false)) {
        const planResult = response.data?.plan || response.data || response;
        return {
          success: true,
          data: planResult,
          message: response.message || 'Subscription plan created successfully'
        };
      }

      throw new Error(response.message || 'Failed to create subscription plan');
    } catch (error) {
      console.error('Create subscription plan error:', error);
      
      // Extract error message from different possible error formats
      let errorMessage = 'Failed to create subscription plan';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Handle specific status codes
      if (error.response?.status === 400) {
        throw new Error(`Invalid plan data: ${errorMessage}`);
      } else if (error.response?.status === 409) {
        throw new Error('A plan with this name already exists');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required. Please login again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      throw new Error(errorMessage);
    }
  },

  // Update subscription plan
  async updatePlan(planId, planData) {
    try {
      console.log('Updating plan with ID:', planId, 'and data:', planData);
      
      // Ensure data matches backend schema exactly
      const apiData = {
        name: planData.name,
        description: planData.description,
        price: planData.price,
        isActive: planData.isActive,
        isPopular: planData.isPopular
      };

      // Only include originalPrice if provided
      if (planData.originalPrice) {
        apiData.originalPrice = planData.originalPrice;
      }

      // Only include limits if provided
      if (planData.limits) {
        apiData.limits = planData.limits;
      }
      
      const response = await apiService.put(`/subscriptions/${planId}`, apiData);
      console.log('Update plan response:', response);

      // Handle successful response
      if (response && (response.success !== false)) {
        const planResult = response.data?.plan || response.data || response;
        return {
          success: true,
          data: planResult,
          message: response.message || 'Subscription plan updated successfully'
        };
      }

      throw new Error(response.message || 'Failed to update subscription plan');
    } catch (error) {
      console.error('Update subscription plan error:', error);
      
      // Extract error message
      let errorMessage = 'Failed to update subscription plan';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.response?.status === 404) {
        throw new Error('Subscription plan not found');
      } else if (error.response?.status === 400) {
        throw new Error(`Invalid plan data: ${errorMessage}`);
      } else if (error.response?.status === 409) {
        throw new Error('A plan with this name already exists');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication required. Please login again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      throw new Error(errorMessage);
    }
  },

  // Update subscription plan status (active/inactive)
  async updatePlanStatus(planId, isActive) {
    try {
      const response = await apiService.put(`/subscriptions/${planId}/status`, {
        isActive
      });

      if (response && (response.success !== false)) {
        return {
          success: true,
          data: response.data?.plan || response.data || response,
          message: response.message || `Subscription plan ${isActive ? 'activated' : 'deactivated'} successfully`
        };
      }

      throw new Error('Failed to update subscription plan status');
    } catch (error) {
      console.error('Update subscription plan status error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Subscription plan not found');
      }
      
      throw new Error(error.message || 'Failed to update subscription plan status');
    }
  },

  // Delete subscription plan
  async deletePlan(planId) {
    try {
      const response = await apiService.delete(`/subscriptions/${planId}`);

      if (response && (response.success !== false)) {
        return {
          success: true,
          message: response.message || 'Subscription plan deleted successfully'
        };
      }

      throw new Error('Failed to delete subscription plan');
    } catch (error) {
      console.error('Delete subscription plan error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Subscription plan not found');
      }
      
      if (error.response?.status === 400) {
        throw new Error('Cannot delete plan with active subscribers');
      }
      
      if (error.response?.status === 409) {
        throw new Error('Plan has active subscribers and cannot be deleted');
      }
      
      throw new Error(error.message || 'Failed to delete subscription plan');
    }
  },

  // ===== SUBSCRIPTION ANALYTICS APIS =====
  
  // Get subscription analytics/stats
  async getSubscriptionStats() {
    try {
      const response = await apiService.get('/subscriptions/stats');
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Get subscription stats error:', error);
      throw new Error(error.message || 'Failed to fetch subscription statistics');
    }
  },

  // Get subscription revenue analytics
  async getRevenueAnalytics() {
    try {
      const url = `/subscriptions/analytics/revenue`;
      const response = await apiService.get(url);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Get revenue analytics error:', error);
      throw new Error(error.message || 'Failed to fetch revenue analytics');
    }
  },

  // ===== USER SUBSCRIPTIONS APIS =====
  
  // Get user subscriptions
  async getUserSubscriptions() {
    try {
      const url = `/subscriptions/users`;
      const response = await apiService.get(url);
      
      if (response.success) {
        return {
          success: true,
          data: {
            subscriptions: response.data.subscriptions || response.data || []
          }
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Get user subscriptions error:', error);
      throw new Error(error.message || 'Failed to fetch user subscriptions');
    }
  },

  // Cancel user subscription
  async cancelUserSubscription(subscriptionId, reason = '') {
    try {
      const response = await apiService.put(`/subscriptions/users/${subscriptionId}/cancel`, {
        reason
      });

      if (response.success) {
        return {
          success: true,
          data: response.data,
          message: response.message || 'Subscription cancelled successfully'
        };
      }

      throw new Error('Failed to cancel subscription');
    } catch (error) {
      console.error('Cancel user subscription error:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Subscription not found');
      }
      
      throw new Error(error.message || 'Failed to cancel subscription');
    }
  },

  // ===== HELPER METHODS =====

  // Format currency helper
  formatCurrency(amount, currency = 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  },

  // Calculate discount percentage
  calculateDiscount(originalPrice, discountedPrice) {
    if (!originalPrice || originalPrice <= discountedPrice) return 0;
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  }
};
// src/utils/errorHandler.js
import { navigation } from './navigation';

export class ApiError extends Error {
  constructor(message, status, statusCode, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.statusCode = statusCode;
    this.data = data;
  }
}

export const errorHandler = {
  // Parse API error responses
  parseApiError(error) {
    if (error instanceof ApiError) {
      return {
        message: error.message,
        status: error.status,
        statusCode: error.statusCode,
        data: error.data
      };
    }

    if (error.response) {
      // Server responded with error status
      const { data, status } = error.response;
      return {
        message: data?.message || data?.error || 'Server error occurred',
        status,
        statusCode: data?.statusCode,
        data: data
      };
    }

    if (error.request) {
      // Network error
      return {
        message: 'Network error: Unable to connect to server',
        status: 0,
        statusCode: null,
        data: null
      };
    }

    // Other errors
    return {
      message: error.message || 'An unexpected error occurred',
      status: null,
      statusCode: null,
      data: null
    };
  },

  // Get user-friendly error messages
  getUserFriendlyMessage(error) {
    const parsed = this.parseApiError(error);
    
    // Handle specific status codes
    switch (parsed.status || parsed.statusCode) {
      case 400:
        return parsed.message || 'Invalid request. Please check your input.';
      case 401:
        return 'Authentication failed. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return parsed.message || 'This resource already exists.';
      case 422:
        return parsed.message || 'Validation failed. Please check your input.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      case 503:
        return 'Service temporarily unavailable. Please try again later.';
      default:
        return parsed.message;
    }
  },

  // Handle validation errors
  handleValidationErrors(error) {
    const parsed = this.parseApiError(error);
    
    if (parsed.data?.errors && Array.isArray(parsed.data.errors)) {
      // Handle array of validation errors
      const fieldErrors = {};
      parsed.data.errors.forEach(err => {
        if (err.field && err.message) {
          fieldErrors[err.field] = err.message;
        }
      });
      return fieldErrors;
    }

    if (parsed.data?.errors && typeof parsed.data.errors === 'object') {
      // Handle object of validation errors
      return parsed.data.errors;
    }

    return {};
  },

  // Log errors for debugging
  logError(error, context = '') {
    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.group(`🚨 Error ${context ? `in ${context}` : ''}`);
      console.error('Original error:', error);
      console.error('Parsed error:', this.parseApiError(error));
      console.groupEnd();
    }
  },

  // Check if error is a network error
  isNetworkError(error) {
    return (
      error.message === 'Network Error' ||
      error.message === 'Failed to fetch' ||
      error.code === 'NETWORK_ERROR' ||
      !error.response
    );
  },

  // Check if error is an authentication error
  isAuthError(error) {
    const parsed = this.parseApiError(error);
    return parsed.status === 401 || parsed.statusCode === 401;
  },

  // Check if error is a validation error
  isValidationError(error) {
    const parsed = this.parseApiError(error);
    return parsed.status === 422 || parsed.statusCode === 422;
  },

  // Create standardized error response
  createErrorResponse(message, status = 500, statusCode = null, data = null) {
    return new ApiError(message, status, statusCode, data);
  },

  // Handle authentication errors globally
  handleAuthError(error) {
    if (this.isAuthError(error)) {
      // Clear invalid token
      localStorage.removeItem('authToken');
      // Redirect to auth page with current location as return URL
      const currentPath = navigation.getCurrentPath();
      if (currentPath !== '/auth') {
        navigation.toAuth(currentPath);
      }
      return true;
    }
    return false;
  }
};

// Common error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error: Unable to connect to server',
  GENERIC_ERROR: 'An unexpected error occurred',
  AUTH_REQUIRED: 'Authentication required',
  AUTH_FAILED: 'Authentication failed',
  VALIDATION_FAILED: 'Validation failed',
  NOT_FOUND: 'Resource not found',
  FORBIDDEN: 'Access denied',
  SERVER_ERROR: 'Internal server error',
  TIMEOUT: 'Request timeout',
  RATE_LIMITED: 'Too many requests'
};

// Hook for handling errors in components
export const useErrorHandler = () => {
  const handleError = (error, context = '') => {
    errorHandler.logError(error, context);
    
    // Handle auth errors globally
    if (errorHandler.handleAuthError(error)) {
      return {
        message: 'Redirecting to login...',
        isAuthError: true,
        isNetworkError: false,
        isValidationError: false,
        validationErrors: {}
      };
    }

    return {
      message: errorHandler.getUserFriendlyMessage(error),
      isNetworkError: errorHandler.isNetworkError(error),
      isValidationError: errorHandler.isValidationError(error),
      validationErrors: errorHandler.handleValidationErrors(error),
      isAuthError: false
    };
  };

  return { handleError };
};
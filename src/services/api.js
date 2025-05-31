// src/services/api.js
import { ApiError, errorHandler } from '../utils/errorHandler';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('authToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Parse JSON response
      const data = await response.json();
      
      if (!response.ok) {
        // Create structured error
        const error = new ApiError(
          data.message || data.error || 'Request failed',
          response.status,
          data.statusCode,
          data
        );
        throw error;
      }

      return data;
    } catch (error) {
      // Handle different types of errors
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new ApiError('Network error: Unable to connect to server', 0, null, null);
      }
      
      if (error.name === 'SyntaxError') {
        throw new ApiError('Server response error: Invalid JSON', 500, null, null);
      }
      
      // Log error for debugging
      errorHandler.logError(error, `API ${options.method || 'GET'} ${endpoint}`);
      
      // Re-throw as ApiError
      throw new ApiError(error.message || 'Request failed', 500, null, null);
    }
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url);
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Helper method to handle file uploads
  uploadFile(endpoint, formData) {
    const token = localStorage.getItem('authToken');
    
    return this.request(endpoint, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData, let browser set it
      },
      body: formData,
    });
  }
}

export const apiService = new ApiService();
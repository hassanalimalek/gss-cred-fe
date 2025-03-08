/**
 * API Configuration
 * 
 * This file contains the common configuration for API calls,
 * including base URLs, timeouts, and error handling utilities.
 */

import axios, { AxiosInstance } from 'axios';

// Set reasonable timeout for all API calls (in milliseconds)
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const UPLOAD_TIMEOUT = 120000; // 2 minutes for file uploads

// Create axios instance with base URL from environment variable
export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: DEFAULT_TIMEOUT,
});

// Create a separate instance for file uploads with multipart/form-data
export const fileApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: UPLOAD_TIMEOUT,
});

/**
 * Generic API error handler
 * 
 * @param error - The error object from axios
 * @param defaultMessage - Default message to show if error info is not available
 * @throws Error with appropriate message
 */
export const handleApiError = (error: any, defaultMessage = 'An error occurred'): never => {
  if (axios.isAxiosError(error)) {
    // Network errors
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    
    // Server errors with response data
    if (error.response) {
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.error || 
                         `Server error: ${error.response.status}`;
      throw new Error(errorMessage);
    }
    
    // Network errors without response
    if (error.request) {
      throw new Error('Network error. Please check your connection and try again.');
    }
    
    throw new Error(error.message || defaultMessage);
  }
  
  // Default error handling for non-Axios errors
  throw new Error(error.message || defaultMessage);
}; 
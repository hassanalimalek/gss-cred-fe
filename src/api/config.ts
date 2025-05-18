/**
 * API Configuration
 *
 * This file contains the common configuration for API calls,
 * including base URLs, timeouts, and error handling utilities.
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Set reasonable timeout for all API calls (in milliseconds)
const DEFAULT_TIMEOUT = 180000; // 3 minutes
const UPLOAD_TIMEOUT = 360000; // 6 minutes for file uploads

/**
 * Response interceptor for handling token expiration (401 errors)
 * This function is used by both API instances
 * Note: The actual token expiration handling is now done in the AuthContext
 */
const authErrorInterceptor = (error: any) => {
  // Just pass through the error - AuthContext will handle 401 errors
  return Promise.reject(error);
};

// Create axios instance with base URL from environment variable
export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: DEFAULT_TIMEOUT,
});

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response: AxiosResponse) => response, // Return successful responses as-is
  authErrorInterceptor
);

// Create a separate instance for file uploads with multipart/form-data
export const fileApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: UPLOAD_TIMEOUT,
});

// Apply the same response interceptor to the file upload API instance
fileApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  authErrorInterceptor
);

/**
 * Handle API errors in a consistent way
 * Special handling for payment errors (402) to preserve the detailed error structure
 * Note: 401 errors are already handled by the response interceptor
 */
export const handleApiError = (error: any, defaultMessage = 'An error occurred'): never => {
  // For payment errors (402), preserve the entire error structure
  if (error?.response?.status === 402) {
    // Instead of extracting just the message, throw the entire error object
    // so we can access detailed payment error information
    throw error;
  }

  // For 401 errors, provide appropriate error messages
  if (error?.response?.status === 401) {
    // Check if it's the login endpoint
    const isLoginEndpoint = error.config?.url === '/admin/auth';

    if (isLoginEndpoint) {
      throw new Error('Invalid email or password');
    } else {
      throw new Error('Authentication failed. Please log in again.');
    }
  }

  if (error?.response?.data?.message) {
    throw new Error(error.response.data.message);
  }

  if (error?.response?.data?.error) {
    throw new Error(error.response.data.error);
  }

  if (error?.response?.status) {
    throw new Error(`Server error: ${error.response.status}`);
  }

  if (error?.code === 'ECONNABORTED') {
    throw new Error('Request timed out. Please try again.');
  }

  if (axios.isCancel && axios.isCancel(error)) {
    throw new Error('Request was cancelled.');
  }

  if (error?.request) {
    throw new Error('No response received from server. Please check your connection and try again.');
  }

  if (error?.message) {
    throw new Error(error.message);
  }

  throw new Error(defaultMessage);
};
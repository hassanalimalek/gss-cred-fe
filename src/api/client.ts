/**
 * API Client
 *
 * This file contains the API client configuration for admin-specific API calls
 * that require authentication.
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Set reasonable timeout for all API calls (in milliseconds)
const DEFAULT_TIMEOUT = 180000; // 3 minutes

/**
 * Response interceptor for handling token expiration (401 errors)
 */
const authErrorInterceptor = (error: any) => {
  // Just pass through the error - AuthContext will handle 401 errors
  return Promise.reject(error);
};

// Create axios instance with base URL from environment variable and auth token
export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: DEFAULT_TIMEOUT,
});

// Add request interceptor to include auth token in all requests
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response, // Return successful responses as-is
  authErrorInterceptor
);

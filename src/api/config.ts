/**
 * API Configuration
 * 
 * This file contains the common configuration for API calls,
 * including base URLs, timeouts, and error handling utilities.
 */

import axios, { AxiosInstance, AxiosError, isAxiosError, CancelToken } from 'axios';

// Set reasonable timeout for all API calls (in milliseconds)
const DEFAULT_TIMEOUT = 60000; // 60 seconds (increased from 30)
const UPLOAD_TIMEOUT = 180000; // 3 minutes for file uploads (increased from 2)

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

// Type guard for checking if an object has a specific property
function hasProperty<K extends string>(obj: unknown, prop: K): obj is Record<K, unknown> {
  return !!obj && typeof obj === 'object' && prop in obj;
}

/**
 * Generic API error handler
 * 
 * @param error - The error object from axios
 * @param defaultMessage - Default message to show if error info is not available
 * @throws Error with appropriate message
 */
export const handleApiError = (error: any, defaultMessage = 'An error occurred'): never => {
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
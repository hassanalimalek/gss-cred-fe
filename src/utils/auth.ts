/**
 * Authentication Utilities
 *
 * This file contains utility functions for authentication-related operations
 * such as token handling, logout, and session management.
 */

/**
 * Handle token expiration by clearing tokens
 * This function is used by API interceptors to handle 401 Unauthorized responses
 * Note: This function only clears the tokens but does not redirect.
 * Redirection is handled by the layout components based on authentication state.
 */
export const handleTokenExpiration = (): void => {
  // Clear admin tokens if they exist
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');

    // No redirection here - let the React components handle redirection
    // based on the updated authentication state
  }
};

/**
 * Check if the user is authenticated
 * @returns Boolean indicating whether the user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  const token = localStorage.getItem('admin_token');
  const user = localStorage.getItem('admin_user');

  return !!token && !!user;
};

/**
 * Get the current authentication token
 * @returns The authentication token or null if not authenticated
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return localStorage.getItem('admin_token');
};

/**
 * Get the current authenticated user
 * @returns The authenticated user object or null if not authenticated
 */
export const getUser = (): any | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  const userStr = localStorage.getItem('admin_user');
  if (!userStr) {
    return null;
  }

  try {
    return JSON.parse(userStr);
  } catch (error) {
    // Silently handle parsing error
    return null;
  }
};

/**
 * Logout the current user
 * Note: This function only clears the tokens but does not redirect.
 * Redirection should be handled by the components using this function.
 */
export const logout = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  // Clear storage
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');

  // No redirection here - let the React components handle redirection
  // based on the updated authentication state
};

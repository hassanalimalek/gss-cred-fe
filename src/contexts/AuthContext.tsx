'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin, AdminLoginRequest } from '@/api/admin';
import { api } from '@/api/config';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

// Define the shape of our authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AdminUser | null;
  login: (credentials: AdminLoginRequest) => Promise<boolean>;
  logout: () => void;
}

// Define the user type
interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  login: async () => false,
  logout: () => {},
});

// Track the interceptor ID
let requestInterceptorId: number | null = null;

// Set up the interceptor
function initializeInterceptor(token: string): void {
  // Remove any existing interceptor
  if (requestInterceptorId !== null) {
    api.interceptors.request.eject(requestInterceptorId);
  }

  // Add token to request headers
  requestInterceptorId = api.interceptors.request.use(
    (config: any) => {
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`
        };
      }
      return config;
    },
    (error: any) => Promise.reject(error)
  );

  console.log('API interceptor initialized with token:', token.substring(0, 20) + '...');
}

// Provider component that wraps the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('admin_token');
          const storedUserStr = localStorage.getItem('admin_user');

          if (storedToken && storedUserStr) {
            try {
              const storedUser = JSON.parse(storedUserStr);

              // Update state
              setToken(storedToken);
              setUser(storedUser);

              // Initialize the API interceptor
              initializeInterceptor(storedToken);
            } catch (error) {
              // If parsing fails, clear the storage
              localStorage.removeItem('admin_token');
              localStorage.removeItem('admin_user');
            }
          }
        }
      } catch (error) {
        console.error('Error initializing auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials: AdminLoginRequest): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await adminLogin(credentials);

      // Store token and user info
      localStorage.setItem('admin_token', response.token);
      localStorage.setItem('admin_user', JSON.stringify(response.user));

      // Update state
      setToken(response.token);
      setUser(response.user);

      // Initialize the API interceptor
      initializeInterceptor(response.token);

      // Show success toast
      showSuccessToast(`Welcome back, ${response.user.name}!`);

      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      showErrorToast((error as Error).message || 'Login failed');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    console.log('Logging out user...');

    // Clear storage first
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');

    // Then update state
    setToken(null);
    setUser(null);

    // Use window.location for a hard navigation instead of Next.js router
    // This ensures a complete page refresh and clean state
    console.log('Performing hard navigation to login page...');
    window.location.href = '/admin/login';
  };

  // Handle 401 Unauthorized responses
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Check if it's a 401 Unauthorized error
        if (error.response && error.response.status === 401) {
          // Skip token expiration handling for login endpoint
          const isLoginEndpoint = error.config?.url === '/admin/auth';

          if (!isLoginEndpoint && token) {
            // Only logout if we're currently authenticated
            logout();
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup
    return () => {
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [token, router]);

  // The value that will be provided to consumers of this context
  const value = {
    isAuthenticated: !!token && !!user,
    isLoading,
    user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

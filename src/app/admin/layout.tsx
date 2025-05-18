'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { AdminSidebar } from '@/components/admin/Sidebar';
import { AdminHeader } from '@/components/admin/Header';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Toaster } from 'react-hot-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Check if we're on the login page
  const isLoginPage = pathname === '/admin/login';

  // Handle authentication and redirection
  useEffect(() => {
    console.log('Admin layout: Authentication state -',
      isLoading ? 'Loading...' : (isAuthenticated ? 'Authenticated' : 'Not authenticated'));
    console.log('Current pathname:', pathname);

    // If not loading and not authenticated and not on login page, redirect to login
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      console.log('Admin layout: Redirecting to login page');
      window.location.href = '/admin/login'; // Use window.location for hard navigation
    }
  }, [isAuthenticated, isLoading, isLoginPage, pathname]);

  // Don't apply admin layout to login page
  if (isLoginPage) {
    return children;
  }

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If not authenticated and not on login page, show loading until redirect happens
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Authenticated admin layout
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}

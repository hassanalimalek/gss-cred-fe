'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  Cog6ToothIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { COMPANY_NAME } from '@/constants';

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon, text, isActive }) => {
  return (
    <Link
      href={href}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-primary text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <span className="mr-3 h-5 w-5">{icon}</span>
      <span>{text}</span>
      {isActive && (
        <motion.div
          className="absolute left-0 w-1 h-8 bg-accent rounded-r-md"
          layoutId="activeIndicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </Link>
  );
};

interface AdminSidebarProps {
  isOpen: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen }) => {
  const pathname = usePathname();

  const sidebarLinks = [
    {
      href: '/admin',
      icon: <HomeIcon className="h-5 w-5" />,
      text: 'Dashboard'
    },
    {
      href: '/admin/credit-repair-requests',
      icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
      text: 'Credit Repair Requests'
    },
    // Commented out as requested
    /*
    {
      href: '/admin/customers',
      icon: <UsersIcon className="h-5 w-5" />,
      text: 'Customers'
    },
    {
      href: '/admin/analytics',
      icon: <ChartBarIcon className="h-5 w-5" />,
      text: 'Analytics'
    },
    {
      href: '/admin/settings',
      icon: <Cog6ToothIcon className="h-5 w-5" />,
      text: 'Settings'
    },
    */
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          className="bg-white w-64 border-r border-gray-200 shadow-sm z-10"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-primary truncate">
                Admin Panel
              </h1>
            </div>

            {/* Sidebar Links */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {sidebarLinks.map((link) => (
                <SidebarLink
                  key={link.href}
                  href={link.href}
                  icon={link.icon}
                  text={link.text}
                  isActive={
                    link.href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(link.href)
                  }
                />
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center">
                Admin Portal v1.0
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

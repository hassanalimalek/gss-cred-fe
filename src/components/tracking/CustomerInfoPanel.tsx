'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/utils/animations';
import { UserIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface CustomerInfoPanelProps {
  customerName: string;
  submissionDate: string;
  currentStatus: number;
  statusText: string;
}

export const CustomerInfoPanel: React.FC<CustomerInfoPanelProps> = ({
  customerName,
  submissionDate,
  currentStatus,
  statusText
}) => {
  // Format the submission date
  const formattedDate = new Date(submissionDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div
      {...fadeIn('up', 0.3)}
      className="bg-white rounded-xl shadow-lg p-8 mb-8"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Application Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          className="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-full">
            <UserIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Customer Name</h3>
            <p className="mt-1 text-lg font-bold text-gray-900">{customerName}</p>
          </div>
        </motion.div>

        <motion.div
          className="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-full">
            <CalendarIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Submission Date</h3>
            <p className="mt-1 text-lg font-bold text-gray-900">{formattedDate}</p>
          </div>
        </motion.div>

        <motion.div
          className="flex items-start bg-gray-50 p-4 rounded-lg border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
        >
          <div className="flex-shrink-0 bg-yellow-100 p-3 rounded-full">
            <ClockIcon className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-sm font-medium text-gray-500">Current Status</h3>
            <div className="mt-1">
              <motion.span
                className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 0.5
                }}
              >
                <span className="mr-1 font-semibold">{currentStatus}</span>
                <span className="mx-0.5">-</span>
                {statusText}
              </motion.span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

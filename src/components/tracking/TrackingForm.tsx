'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/utils/animations';
import { getStatusByTrackingId } from '@/api/tracking';
import { StatusTrackingResponse } from '@/types/creditRepair';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface TrackingFormProps {
  setTrackingData: React.Dispatch<React.SetStateAction<StatusTrackingResponse | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const TrackingForm: React.FC<TrackingFormProps> = ({
  setTrackingData,
  setIsLoading,
  setError
}) => {
  const [trackingId, setTrackingId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateTrackingId = (id: string): boolean => {
    // Validate tracking ID format (CR-XXXXXXXX where X is a hexadecimal digit)
    const isValid = /^CR-[0-9A-F]{8}$/i.test(id);
    if (!isValid) {
      setValidationError('Please enter a valid tracking ID (format: CR-XXXXXXXX)');
    } else {
      setValidationError(null);
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trim the input
    const trimmedId = trackingId.trim();

    // Validate the tracking ID
    if (!validateTrackingId(trimmedId)) {
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    setError(null);

    try {
      const data = await getStatusByTrackingId(trimmedId);
      setTrackingData(data);
    } catch (error: any) {
      setError(error.message || 'Failed to retrieve tracking information');
      setTrackingData(null);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      {...fadeIn('up', 0.2)}
      className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="trackingId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tracking ID
          </label>
          <input
            id="trackingId"
            type="text"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
            placeholder="Enter your tracking ID (e.g., CR-12345678)"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-800"
            aria-describedby="trackingIdHelp"
          />
          <p id="trackingIdHelp" className="mt-1 text-sm text-gray-500">
            Your tracking ID was sent to your email when you submitted your application.
          </p>
          {validationError && (
            <p className="mt-2 text-sm text-red-600">{validationError}</p>
          )}
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting || !trackingId.trim()}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-md transition duration-300 ease-in-out flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" color="white" className="mr-2" />
                <span>Checking...</span>
              </>
            ) : (
              'Track Application'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

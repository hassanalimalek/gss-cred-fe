'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { TrackingForm } from '@/components/tracking/TrackingForm';
import type { StatusTrackingResponse } from '@/types/creditRepair';
import { SectionLoading } from '@/components/common/SectionLoading';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn } from '@/utils/animations';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { CustomApplicationTracking } from '@/components/tracking/CustomApplicationTracking';

function TrackPageContent() {
  const searchParams = useSearchParams();
  const [trackingData, setTrackingData] = useState<StatusTrackingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResearchForm, setShowResearchForm] = useState(false);
  const [currentTrackingId, setCurrentTrackingId] = useState<string>('');


  
  // Function to handle tracking search
  const handleTrackingSearch = React.useCallback(async (trackingId: string) => {
    if (!trackingId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Import dynamically to avoid circular dependencies
      const { getStatusByTrackingId } = await import('@/api/tracking');
      const data = await getStatusByTrackingId(trackingId);
      
      setTrackingData(data);
      setCurrentTrackingId(trackingId);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to retrieve tracking information';
      setError(errorMessage);
      setTrackingData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);  // Empty dependency array since this function doesn't depend on any props or state
  
  // Check for ID in URL parameters when component mounts
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      // Validate tracking ID format (CR-XXXXXXXX where X is a hexadecimal digit)
      if (/^CR-[0-9A-F]{8}$/i.test(id)) {
        handleTrackingSearch(id);
      } else {
        setError('Invalid tracking ID format. Please use format: CR-XXXXXXXX');
      }
    }
  }, [searchParams, handleTrackingSearch]);
  return (
    <main className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen py:14 md:py-16">
      <div className=" mx-auto px-4 max-w-7xl">
        {!trackingData && !isLoading && (
          <motion.div
            {...fadeIn('up', 0.1)}
            className="text-center mb-12"
          >
            <div className="inline-block bg-yellow-100 p-3 rounded-full mb-6">
              <MagnifyingGlassIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Track Your Application</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Enter your tracking ID below to check the status of your credit repair application.
            </p>
          </motion.div>
        )}

        {!trackingData && !isLoading && (
          <ErrorBoundary>
            <TrackingForm
              setTrackingData={(data) => {
                setTrackingData(data);
                // No need to set showResearchForm here as it's already false
              }}
              setIsLoading={setIsLoading}
              setError={setError}
              setCurrentTrackingId={setCurrentTrackingId}
              initialTrackingId={searchParams.get('id') || ''}
            />
          </ErrorBoundary>
        )}

        {isLoading && (
          <SectionLoading height="400px" message="Retrieving your application status..." />
        )}

        {error && !isLoading && (
          <motion.div
            {...fadeIn('up', 0.2)}
            className="bg-red-50 border border-red-200 text-red-700 px-8 py-10 rounded-xl shadow-md text-center my-12"
          >
            <div className="inline-block bg-red-100 p-3 rounded-full mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" aria-label="Error icon">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Error</h3>
            <p>{error}</p>
          </motion.div>
        )}

      {trackingData && !isLoading && (
          <motion.div>
            {!showResearchForm && (
              <motion.div
                className="mb-6 flex justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  type="button"
                  onClick={() => setShowResearchForm(true)}
                  className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors duration-200 text-sm font-medium"
                >
                  <MagnifyingGlassIcon className="h-4 w-4 mr-1" />
                  Research another application
                </button>
              </motion.div>
            )}

            <AnimatePresence>
            {showResearchForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <ErrorBoundary>
                  <TrackingForm
                    setTrackingData={(data) => {
                      setTrackingData(data);
                      setShowResearchForm(false); // Hide form after successful search
                    }}
                    setIsLoading={setIsLoading}
                    setError={setError}
                    setCurrentTrackingId={setCurrentTrackingId}
                    initialTrackingId=""
                  />
                </ErrorBoundary>
                <div className="text-right mt-2">
                  <button
                    type="button"
                    onClick={() => setShowResearchForm(false)}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
            </AnimatePresence>

            <CustomApplicationTracking
              trackingData={{
                ...trackingData,
                trackingId: currentTrackingId
              }}
            />

            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.0 }}
            >
              <p className="text-slate-400 text-sm">
                If you have any questions about your application status, please contact our support team.
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <SectionLoading height="400px" message="Loading tracking..." />
      </div>
    }>
      <TrackPageContent />
    </Suspense>
  );
}

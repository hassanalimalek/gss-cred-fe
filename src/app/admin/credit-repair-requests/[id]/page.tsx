'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  UserIcon,
  DocumentIcon,
  CheckIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { getCreditRepairRequestById, CreditRepairRequest, getCustomers } from '@/api/admin';
import { DetailPageSkeleton } from '@/components/common/Skeleton';
import { StatusUpdateModal } from '@/components/admin/StatusUpdateModal';
import { ECreditRepairStatus, CREDIT_REPAIR_STATUS_TEXT } from '@/types/creditRepair';

// Status badge component
const StatusBadge = ({ status }: { status: number }) => {
  let bgColor = 'bg-gray-100 text-gray-800';

  switch (status) {
    case ECreditRepairStatus.GET_STARTED:
      bgColor = 'bg-blue-100 text-blue-800';
      break;
    case ECreditRepairStatus.AUTHORIZE_CONNECT:
      bgColor = 'bg-purple-100 text-purple-800';
      break;
    case ECreditRepairStatus.PARTNER_PROCESSING:
      bgColor = 'bg-indigo-100 text-indigo-800';
      break;
    case ECreditRepairStatus.REPAIR_IN_PROGRESS:
      bgColor = 'bg-yellow-100 text-yellow-800';
      break;
    case ECreditRepairStatus.CONFIRM_DELIVER:
      bgColor = 'bg-green-100 text-green-800';
      break;
    case ECreditRepairStatus.REQUEST_DENIED:
      bgColor = 'bg-red-100 text-red-800';
      break;
    default:
      bgColor = 'bg-gray-100 text-gray-800';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${bgColor}`}>
      <span className="mr-1 font-semibold">{status}</span>
      <span className="mx-0.5">-</span>
      {CREDIT_REPAIR_STATUS_TEXT[status as ECreditRepairStatus]}
    </span>
  );
};

// Format date for display
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function CreditRepairRequestDetail() {
  const params = useParams();
  const id = params.id as string; // Extract 'id' from params. Cast to string.

  const [request, setRequest] = useState<CreditRepairRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const router = useRouter();

  // Function to copy tracking ID to clipboard
  const copyTrackingId = () => {
    if (request?.trackingId) {
      navigator.clipboard.writeText(request.trackingId)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        })
        .catch(() => {
          // Silently fail if clipboard copy doesn't work
        });
    }
  };

  // Function to find customer by email
  const findCustomerByEmail = async (email: string) => {
    try {
      // Search for customers with the email
      const response = await getCustomers(1, 1, 'createdAt', 'desc', email);

      // If we found a matching customer, set the customer ID
      if (response.data.length > 0 && response.data[0].email === email) {
        setCustomerId(response.data[0]._id);
      } else {
        setCustomerId(null);
      }
    } catch (error) {
      console.error('Error finding customer:', error);
      setCustomerId(null);
    }
  };

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) {
        setIsLoading(false);
        setRequest(null); // Ensure request is null if no ID
        return;
      }

      setIsLoading(true); // Set loading at the beginning of the fetch attempt
      try {
        const data = await getCreditRepairRequestById(id);
        setRequest(data);

        // After getting the request, find the customer by email
        if (data.email) {
          await findCustomerByEmail(data.email);
        }
      } catch (error) {
        setRequest(null); // Set request to null on error to show "Not Found"
        setCustomerId(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequest();
  }, [id]); // Depend on 'id' to refetch if it changes

  const handleBack = () => {
    router.back();
  };

  const handleUpdateStatus = async () => {
    setIsModalOpen(false);
    if (!id) return; // Should not happen if modal was opened, but good guard

    setIsLoading(true);
    try {
      const data = await getCreditRepairRequestById(id);
      setRequest(data);
    } catch (error) {
      // Keep the old data on error
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (!request) { // This covers both "not found" and initial state if ID was missing
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Request Not Found</h1>
        </div>
        <p className="text-gray-600">The requested credit repair request could not be found or the ID is invalid.</p>
      </div>
    );
  }

  // If we reach here, request is not null
  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Credit Repair Request Details</h1>
          </div>
          <div>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Purchased Package: ${request.packagePrice?.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
              Customer Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                {customerId ? (
                  <a
                    href={`/admin/customers/${customerId}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/admin/customers/${customerId}`);
                    }}
                  >
                    {request.fullName}
                  </a>
                ) : (
                  <p className="text-sm font-medium text-gray-900">{request.fullName}</p>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{request.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="text-sm font-medium text-gray-900">{request.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Social Security Number</p>
                <p className="text-sm font-medium text-gray-900">{request.socialSecurityNumber}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-500" />
              Request Information
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Tracking ID</p>
                <div className="flex items-center mt-1">
                  <p className="text-sm font-medium text-gray-900 mr-2">{request.trackingId}</p>
                  <button
                    onClick={copyTrackingId}
                    className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                    aria-label="Copy tracking ID"
                    title="Copy tracking ID"
                  >
                    {isCopied ? (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <DocumentDuplicateIcon className="h-4 w-4 text-primary" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Submission Date</p>
                <p className="text-sm font-medium text-gray-900">{formatDate(request.createdAt)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Current Status</p>
                <div className="mt-1">
                  <StatusBadge status={request.currentStatus} />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Record Expunction Requested</p>
                <p className="text-sm font-medium text-gray-900">{request.requestRecordExpunction ? 'Yes' : 'No'}</p>
              </div>
              <div className="flex space-x-6">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Utility Bill</p>
                  {request.utilityBill?.url ? (
                    <a
                      href={request.utilityBill.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-1 text-blue-600 hover:text-blue-800"
                      aria-label="View Utility Bill"
                    >
                      <DocumentIcon className="h-5 w-5 text-blue-600" /> <span className="ml-1">View</span>
                    </a>
                  ) : (
                    <p className="text-sm text-gray-400 mt-1">Not provided</p>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500">Driver's License</p>
                   {request.driverLicense?.url ? (
                    <a
                      href={request.driverLicense.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center mt-1 text-blue-600 hover:text-blue-800"
                      aria-label="View Driver's License"
                    >
                      <DocumentIcon className="h-5 w-5 text-blue-600" /> <span className="ml-1">View</span>
                    </a>
                   ) : (
                    <p className="text-sm text-gray-400 mt-1">Not provided</p>
                   )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status History */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Status History</h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Update Status
            </button>
          </div>
          <div className="space-y-4">
            {request.statusHistory && request.statusHistory.length > 0 ? (
              [...request.statusHistory].reverse().map((history, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-4 pb-4 relative"> {/* Added relative for absolute positioning of dot */}
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary absolute -left-[5.5px] top-1 border-2 border-white"></div> {/* Adjusted dot positioning */}
                    <p className="text-sm font-medium text-gray-900 ml-2"> {/* Added ml-2 for spacing from dot line */}
                      <StatusBadge status={history.status} />
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 ml-2">{formatDate(history.timestamp)}</p> {/* Added ml-2 */}
                  {history.userNotes ? (
                    <p className="text-sm text-gray-700 mt-2 bg-white p-2 rounded border border-gray-200 ml-2">
                      {history.userNotes}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400 mt-2 bg-white p-2 rounded border border-gray-200 ml-2 italic">
                      No notes added
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No status history available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Status Update Modal (request is already confirmed to be non-null here) */}
      <StatusUpdateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={request}
        onStatusUpdate={handleUpdateStatus}
      />
    </div>
  );
}
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeftIcon,
  UserIcon,
  DocumentIcon,
  CheckIcon,
  DocumentDuplicateIcon,
  CreditCardIcon,
  UsersIcon,
  ClipboardDocumentIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { getCustomerById, Customer } from '@/api/admin';
import { getCustomerReferrals } from '@/api';
import { DetailPageSkeleton } from '@/components/common/Skeleton';
import { StatusUpdateModal } from '@/components/admin/StatusUpdateModal';
import { CreditRepairRequest } from '@/types/creditRepair';
import StatusBadge from '@/components/common/StatusBadge';

export default function CustomerDetail() {
  const params = useParams();
  const id = params.id as string; // Extract 'id' from params. Cast to string.

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'credit-repair' | 'payments' | 'referrals'>('credit-repair');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();

  // Define a type that extends the simplified CreditRepairRequest from Customer
  type CustomerCreditRepairRequest = Customer['creditRepairRequests'][0] & {
    utilityBill?: {
      _id: string;
      url: string;
      s3Key: string;
      mediaType: string;
      fileType: string;
    };
    driverLicense?: {
      _id: string;
      url: string;
      s3Key: string;
      mediaType: string;
      fileType: string;
    };
    statusHistory?: Array<{
      status: number;
      statusText: string;
      timestamp: string;
      updatedBy: string;
      userNotes?: string;
    }>;
  };

  // Function to copy tracking ID to clipboard
  const copyTrackingId = (trackingId: string) => {
    if (trackingId) {
      navigator.clipboard.writeText(trackingId)
        .then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
        })
        .catch(() => {
          // Silently fail if clipboard copy doesn't work
        });
    }
  };

  // Fetch customer data
  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) {
        setIsLoading(false);
        setCustomer(null); // Ensure customer is null if no ID
        return;
      }

      setIsLoading(true); // Set loading at the beginning of the fetch attempt
      try {
        const data = await getCustomerById(id);
        setCustomer(data);

        // If there are credit repair requests, select the first one by default
        if (data.creditRepairRequests && data.creditRepairRequests.length > 0) {
          setSelectedRequestId(data.creditRepairRequests[0]._id);
        }
      } catch (error) {
        setCustomer(null); // Set customer to null on error to show "Not Found"
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomer();
  }, [id]); // Depend on 'id' to refetch if it changes

  const handleBack = () => {
    router.back();
  };

  const handleUpdateStatus = async () => {
    setIsModalOpen(false);
    if (!id) return; // Should not happen if modal was opened, but good guard

    setIsLoading(true);
    try {
      const data = await getCustomerById(id);
      setCustomer(data);
    } catch (error) {
      // Keep the old data on error
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (!customer) { // This covers both "not found" and initial state if ID was missing
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
          <h1 className="text-2xl font-bold text-gray-900">Customer Not Found</h1>
        </div>
        <p className="text-gray-600">The requested customer could not be found or the ID is invalid.</p>
      </div>
    );
  }

  // If we reach here, customer is not null
  // Find the selected credit repair request if any exist
  const hasRequests = customer.creditRepairRequests && customer.creditRepairRequests.length > 0;
  const selectedRequest = hasRequests
    ? (customer.creditRepairRequests.find(req => req._id === selectedRequestId) || customer.creditRepairRequests[0]) as CustomerCreditRepairRequest
    : null;

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
          </button>
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
              <UserIcon className="h-7 w-7 text-gray-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{customer.fullName}</h1>
              <div className="text-sm text-gray-500">
                Customer since {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <UserIcon className="h-5 w-5 mr-2 text-gray-500" />
            <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Full Name</p>
              <p className="text-sm font-medium text-gray-900">{customer.fullName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">{customer.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-sm font-medium text-gray-900">{customer.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Address</p>
              <p className="text-sm font-medium text-gray-900">{customer.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Social Security Number</p>
              <p className="text-sm font-medium text-gray-900">{customer.socialSecurityNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date of Birth</p>
              <p className="text-sm font-medium text-gray-900">{customer.dateOfBirth}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('credit-repair')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'credit-repair'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors`}
            >
              <DocumentIcon className="h-5 w-5 inline mr-2 -mt-0.5" />
              Credit Repair Requests
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'payments'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors`}
            >
              <CreditCardIcon className="h-5 w-5 inline mr-2 -mt-0.5" />
              Payment History
            </button>
            <button
              onClick={() => setActiveTab('referrals')}
              className={`py-4 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'referrals'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } transition-colors`}
            >
              <UserGroupIcon className="h-5 w-5 inline mr-2 -mt-0.5" />
              Referrals
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {/* Credit Repair Requests Tab */}
        {activeTab === 'credit-repair' && hasRequests && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <DocumentIcon className="h-5 w-5 mr-2 text-gray-500" />
                <h2 className="text-lg font-medium text-gray-900">Credit Repair Requests</h2>
              </div>

              {/* Request selector if there are multiple requests */}
              {customer.creditRepairRequests.length > 1 && (
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Select request:</span>
                  <select
                    className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary text-black sm:text-sm rounded-md"
                    value={selectedRequestId || ''}
                    onChange={(e) => setSelectedRequestId(e.target.value)}
                  >
                    {customer.creditRepairRequests.map((req) => (
                      <option key={req._id} value={req._id}>
                        {req.trackingId} - {new Date(req.createdAt).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {selectedRequest && (
              <>
                {/* Request Information */}
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
                  <h3 className="text-md font-medium text-gray-800 mb-3">Request Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tracking ID</p>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-900">{selectedRequest.trackingId}</p>
                        <button
                          onClick={() => copyTrackingId(selectedRequest.trackingId)}
                          className="ml-2 text-gray-400 hover:text-gray-600"
                          title="Copy tracking ID"
                        >
                          {isCopied ? (
                            <CheckIcon className="h-4 w-4 text-green-500" />
                          ) : (
                            <DocumentDuplicateIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Transaction ID</p>
                      <p className="text-sm font-medium text-gray-900">{selectedRequest.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Current Status</p>
                      <div className="mt-1">
                        <StatusBadge status={selectedRequest.currentStatus} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Submission Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(selectedRequest.createdAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Record Expunction Requested</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedRequest.requestRecordExpunction ? 'Yes' : 'No'}
                      </p>
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Update Status
                      </button>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-white">
                  <h3 className="text-md font-medium text-gray-800 mb-3">Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Utility Bill</h4>
                      <div className="flex items-center">
                        <DocumentIcon className="h-5 w-5 text-blue-500 mr-2" />
                        {selectedRequest.utilityBill ? (
                          <a
                            href={selectedRequest.utilityBill.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">Not available</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Driver's License</h4>
                      <div className="flex items-center">
                        <DocumentIcon className="h-5 w-5 text-blue-500 mr-2" />
                        {selectedRequest.driverLicense ? (
                          <a
                            href={selectedRequest.driverLicense.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">Not available</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status History */}
                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                  <h3 className="text-md font-medium text-gray-800 mb-3">Status History</h3>
                  <div className="space-y-4">
                    {selectedRequest.statusHistory && selectedRequest.statusHistory.length > 0 ? (
                      selectedRequest.statusHistory.slice().reverse().map((historyItem, index: number) => (
                        <div key={index} className="border-l-2 border-gray-200 pl-4 pb-4">
                          <div className="flex items-center">
                            <StatusBadge status={historyItem.status} />
                            <span className="ml-2 text-sm text-gray-500">
                              {new Date(historyItem.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">Updated by: {historyItem.updatedBy}</p>
                          {historyItem.userNotes && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                              <p className="text-sm text-gray-700">{historyItem.userNotes}</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">No status history available</p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Payment History Tab */}
        {activeTab === 'payments' && (
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <CreditCardIcon className="h-5 w-5 mr-2 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">Payment History</h2>
            </div>

          {hasRequests ? (
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Package
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customer.creditRepairRequests.map((request) => (
                    <tr key={request._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">Credit Repair Service</span>
                        {request.requestRecordExpunction && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            + Record Expunction
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ${request.packagePrice}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.transactionId}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-gray-500">No purchase history available</p>
            </div>
          )}
          </div>
        )}

        {/* Referrals Tab */}
        {activeTab === 'referrals' && (
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <UserGroupIcon className="h-5 w-5 mr-2 text-gray-500" />
              <h2 className="text-lg font-medium text-gray-900">Referral Information</h2>
            </div>

            {/* Referral Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Customer's Referral Code */}
              <div className="p-4 border border-gray-200 rounded-lg bg-white">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Referral Code</h3>
                {customer.referralCode ? (
                  <div className="flex items-center">
                    <span className="text-lg font-mono font-bold text-gray-900">{customer.referralCode}</span>
                    <button
                      onClick={() => copyTrackingId(customer.referralCode!)}
                      className="ml-2 p-1 text-gray-400 hover:text-gray-600"
                      title="Copy referral code"
                    >
                      {isCopied ? (
                        <CheckIcon className="h-4 w-4 text-green-500" />
                      ) : (
                        <DocumentDuplicateIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">No referral code assigned</span>
                )}
              </div>

              {/* Total Referrals */}
              <div className="p-4 border border-gray-200 rounded-lg bg-white">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Referrals</h3>
                <span className="text-2xl font-bold text-blue-600">
                  {customer.referrals ? customer.referrals.length : 0}
                </span>
              </div>

              {/* Referral Value */}
              <div className="p-4 border border-gray-200 rounded-lg bg-white">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Referral Value</h3>
                <ReferralValue customerId={customer._id} />
              </div>
            </div>

            {/* Referred By Information */}
            {(customer.referredBy || (customer.creditRepairRequests && customer.creditRepairRequests.length > 0 && customer.creditRepairRequests[0].appliedReferralCode)) && (
              <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-blue-50">
                <h3 className="text-md font-medium text-gray-800 mb-3">This Customer Was Referred</h3>
                <div className="flex items-center">
                  <UsersIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-sm text-gray-900">This customer was referred by another user</span>
                </div>
                {customer.creditRepairRequests && customer.creditRepairRequests.length > 0 && customer.creditRepairRequests[0].appliedReferralCode && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Used Code: {customer.creditRepairRequests[0].appliedReferralCode}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Customers Referred List */}
            <div className="p-4 border border-gray-200 rounded-lg bg-white">
              <h3 className="text-md font-medium text-gray-800 mb-4">Customers Referred</h3>
              {customer.referrals && customer.referrals.length > 0 ? (
                <ReferralsList customerId={customer._id} />
              ) : (
                <div className="text-center py-8">
                  <UsersIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No referrals yet</h3>
                  <p className="text-gray-500">This customer hasn't referred anyone yet.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {selectedRequest && (
        <StatusUpdateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          request={{
            ...selectedRequest,
            // Add customer information
            fullName: customer.fullName,
            email: customer.email,
            phoneNumber: customer.phoneNumber,
            socialSecurityNumber: customer.socialSecurityNumber,
            // Ensure all required properties are present
            utilityBill: selectedRequest.utilityBill || { _id: '', url: '', s3Key: '', mediaType: '', fileType: '' },
            driverLicense: selectedRequest.driverLicense || { _id: '', url: '', s3Key: '', mediaType: '', fileType: '' },
            statusHistory: selectedRequest.statusHistory || []
          } as unknown as CreditRepairRequest}
          onStatusUpdate={handleUpdateStatus}
        />
      )}
    </div>
  );
}

// Add the ReferralsList component before the export
interface ReferralsListProps {
  customerId: string;
}

const ReferralsList: React.FC<ReferralsListProps> = ({ customerId }) => {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCustomerReferrals(customerId, '', 1, 100);
        setReferrals(data.referrals || []);
      } catch (error) {
        setError('Failed to load referrals');
        setReferrals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferrals();
  }, [customerId]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex items-center space-x-3">
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-1">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        {error}
      </div>
    );
  }

  if (referrals.length === 0) {
    return (
      <div className="text-gray-500 text-sm">
        No referrals found
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {referrals.map((referral) => (
        <div key={referral._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <UserIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">{referral.fullName}</div>
              <div className="text-xs text-gray-500">{referral.email}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">
              Joined {new Date(referral.signupDate).toLocaleDateString()}
            </div>
            {referral.totalPackageAmount && referral.totalPackageAmount > 0 && (
              <div className="text-sm font-medium text-green-600">
                ${referral.totalPackageAmount.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Add the ReferralValue component before ReferralsList
interface ReferralValueProps {
  customerId: string;
}

const ReferralValue: React.FC<ReferralValueProps> = ({ customerId }) => {
  const [totalValue, setTotalValue] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReferralValue = async () => {
      try {
        setIsLoading(true);
        const data = await getCustomerReferrals(customerId, '', 1, 100); // Get all referrals
        
        // Calculate total value from all packages purchased by referred customers
        let total = 0;
        data.referrals.forEach(referral => {
          if (referral.allPackages && referral.allPackages.length > 0) {
            referral.allPackages.forEach((pkg: any) => {
              total += pkg.packagePrice || 0;
            });
          }
        });
        
        setTotalValue(total);
      } catch (error) {
        setTotalValue(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferralValue();
  }, [customerId]);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 w-16 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <span className="text-2xl font-bold text-green-600">
      ${totalValue.toFixed(2)}
    </span>
  );
};



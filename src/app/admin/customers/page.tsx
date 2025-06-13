'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
  DocumentDuplicateIcon,
  CheckIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { getCustomers, Customer, exportCustomersToCsv } from '@/api/admin';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { TableRowSkeleton } from '@/components/common/Skeleton';
import StatusBadge from '@/components/common/StatusBadge';
import CountBadge from '@/components/common/CountBadge';
import { showErrorToast, showSuccessToast } from '@/utils/toast';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  // These state variables are used in the API call but not modified in the UI currently
  const [sortBy] = useState('createdAt');
  const [sortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [copiedReferralCode, setCopiedReferralCode] = useState<string | null>(null);

  const router = useRouter();

  // Helper function to format numbers with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // Handle CSV export
  const handleExportToCsv = async () => {
    setIsExporting(true);
    try {
      const blob = await exportCustomersToCsv(debouncedSearchQuery);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `customers_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showSuccessToast('CSV export completed successfully!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      showErrorToast('Failed to export CSV. Please try again or use date filters to reduce the dataset size.');
    } finally {
      setIsExporting(false);
    }
  };

  // Fetch customers
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await getCustomers(page, limit, sortBy, sortOrder, debouncedSearchQuery);
      console.log('Customers response:', response);
      console.log('Customers pagination calculations:', {
        total: response.total,
        limit: limit,
        currentPage: page,
        calculatedTotalPages: Math.ceil(response.total / limit)
      });
      setCustomers(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Error fetching customers:', error);
      showErrorToast('Failed to fetch customers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search query
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1); // Reset to first page when search changes
    }, 500);

    debouncedSearch();

    // Cleanup
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery]);

  // Fetch customers when dependencies change
  useEffect(() => {
    fetchCustomers();
  }, [page, limit, sortBy, sortOrder, debouncedSearchQuery]);

  // Handle row click to navigate to detail page
  const handleRowClick = (id: string) => {
    router.push(`/admin/customers/${id}`);
  };

  // Handle pagination
  const totalPages = Math.max(1, Math.ceil(total / limit));
  
  // Ensure current page is within valid range
  const validatedPage = Math.max(1, Math.min(page, totalPages));
  
  // Update page if it's out of range
  useEffect(() => {
    if (page !== validatedPage && total > 0) {
      setPage(validatedPage);
    }
  }, [page, validatedPage, total]);

  const handlePreviousPage = () => {
    if (validatedPage > 1) {
      setPage(validatedPage - 1);
    }
  };

  const handleNextPage = () => {
    if (validatedPage < totalPages) {
      setPage(validatedPage + 1);
    }
  };

  // Copy referral code to clipboard
  const copyReferralCode = (e: React.MouseEvent, referralCode: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopiedReferralCode(referralCode);
      showSuccessToast('Referral code copied to clipboard!');
      setTimeout(() => setCopiedReferralCode(null), 2000);
    }).catch(() => {
      showErrorToast('Failed to copy referral code');
    });
  };

  // Removed unused commented-out code for:
  // - handleSort
  // - getStatusText
  // - copyTrackingId
  // - StatusBadge

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and view all customer profiles</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Total:</span>
            <CountBadge count={total} />
          </div>
          {/* <button
            onClick={handleExportToCsv}
            disabled={isExporting}
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <LoadingSpinner size="sm" color="white" className="mr-2" />
            ) : (
              <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            )}
            {isExporting ? 'Exporting' : 'Export CSV'}
          </button> */}
          <button
            onClick={fetchCustomers}
            className="flex items-center px-3 py-2 text-sm font-medium text-primary bg-white rounded-md border border-gray-300 hover:bg-gray-50"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search customers by name, email, or phone number..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary text-black sm:text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Referral Code
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Package
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.from({ length: 5 }).map((_, index) => (
                  <TableRowSkeleton key={index} columns={6} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact Info
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referral Code
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Package
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.length > 0 ? (
                    customers.map((customer) => (
                      <tr
                        key={customer._id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleRowClick(customer._id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <UserGroupIcon className="h-6 w-6 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{customer.fullName}</div>
                              <div className="text-sm text-gray-500">ID: {customer._id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{customer.email}</div>
                          <div className="text-sm text-gray-500">{customer.phoneNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {customer.referralCode ? (
                              <>
                                <div className="text-sm text-gray-900 mr-2">{customer.referralCode}</div>
                                <button
                                  type="button"
                                  onClick={(e) => copyReferralCode(e, customer.referralCode!)}
                                  className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                                  aria-label="Copy referral code"
                                  title="Copy referral code"
                                >
                                  {copiedReferralCode === customer.referralCode ? (
                                    <CheckIcon className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <DocumentDuplicateIcon className="h-4 w-4 text-primary" />
                                  )}
                                </button>
                              </>
                            ) : (
                              <span className="text-sm text-gray-400 italic">No Referral Code</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {customer.creditRepairRequests && customer.creditRepairRequests.length > 0 ? (
                            <>
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ${customer.creditRepairRequests[0].packagePrice?.toLocaleString() || 'N/A'}
                              </span>
                              <div className="text-xs text-gray-500 mt-1">
                                {customer.creditRepairRequests[0].requestRecordExpunction ? '+ Record Expunction' : ''}
                              </div>
                            </>
                          ) : (
                            <span className="text-sm text-gray-500">No package</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(customer.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(customer._id);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12">
                        <div className="flex flex-col items-center justify-center">
                          <div className="text-gray-300 mb-4">
                            <UserGroupIcon className="h-16 w-16" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900">No customers found</h3>
                          <p className="text-gray-500 mt-1">There are no customers available at this time.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {customers.length > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between items-center sm:hidden">
                  <button
                    onClick={handlePreviousPage}
                    disabled={validatedPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      validatedPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {validatedPage} of {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={validatedPage === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      validatedPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{formatNumber((validatedPage - 1) * limit + 1)}</span> to{' '}
                      <span className="font-medium">{formatNumber(Math.min(validatedPage * limit, total))}</span> of{' '}
                      <span className="font-medium">{formatNumber(total)}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={handlePreviousPage}
                        disabled={validatedPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          validatedPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                      {/* Current page number */}
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        Page {validatedPage} of {totalPages}
                      </span>
                      
                      {/* Quick page jump for large datasets */}
                      {totalPages > 100 && (
                        <>
                          <span className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            |
                          </span>
                          <div className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white">
                            <label htmlFor="customerPageJump" className="text-xs text-gray-700 mr-1">Go to:</label>
                            <input
                              id="customerPageJump"
                              type="number"
                              min="1"
                              max={totalPages}
                              className="w-20 px-1 py-1 text-xs border border-gray-200 rounded text-center text-gray-900"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  const newPage = parseInt((e.target as HTMLInputElement).value, 10);
                                  if (newPage >= 1 && newPage <= totalPages) {
                                    setPage(newPage);
                                  }
                                }
                              }}
                            />
                          </div>
                        </>
                      )}
                      <button
                        onClick={handleNextPage}
                        disabled={validatedPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          validatedPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

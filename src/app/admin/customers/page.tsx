'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { getCustomers, Customer } from '@/api/admin';
import { TableRowSkeleton } from '@/components/common/Skeleton';
import { UserGroupIcon } from '@heroicons/react/24/solid';
import CountBadge from '@/components/common/CountBadge';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  // These state variables are used in the API call but not modified in the UI currently
  const [sortBy] = useState('createdAt');
  const [sortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const router = useRouter();

  // Fetch customers
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const response = await getCustomers(
        page,
        limit,
        sortBy,
        sortOrder,
        debouncedSearchQuery
      );
      setCustomers(response.data);
      setTotal(response.total);
    } catch (error) {
      // Silently handle error
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
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page * limit < total) {
      setPage(page + 1);
    }
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
                  <TableRowSkeleton key={index} columns={5} />
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
                              <UserIcon className="h-6 w-6 text-gray-500" />
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
                          {customer.creditRepairRequests && customer.creditRepairRequests.length > 0 ? (
                            <>
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                ${customer.creditRepairRequests[0].packagePrice}
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
                      <td colSpan={5} className="py-12">
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
                    disabled={page === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {page} of {Math.ceil(total / limit) || 1}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={page * limit >= total}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      page * limit >= total ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing <span className="font-medium">{(page - 1) * limit + 1}</span> to{' '}
                      <span className="font-medium">{Math.min(page * limit, total)}</span> of{' '}
                      <span className="font-medium">{total}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={handlePreviousPage}
                        disabled={page === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                          page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                      {/* Current page number */}
                      <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        Page {page} of {Math.ceil(total / limit) || 1}
                      </span>
                      <button
                        onClick={handleNextPage}
                        disabled={page * limit >= total}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                          page * limit >= total ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
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

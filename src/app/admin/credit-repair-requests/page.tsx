'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { debounce } from 'lodash';
import {
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FunnelIcon,
  ArrowPathIcon,
  CurrencyDollarIcon,
  CheckIcon,
  ClipboardDocumentListIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';
import { getCreditRepairRequests, CreditRepairRequest } from '@/api/admin';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { TableRowSkeleton } from '@/components/common/Skeleton';
import { StatusUpdateModal } from '@/components/admin/StatusUpdateModal';
import {
  ECreditRepairStatus,
  CREDIT_REPAIR_STATUS_TEXT
} from '@/types/creditRepair';

export default function CreditRepairRequestsPage() {
  const [requests, setRequests] = useState<CreditRepairRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState<number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<CreditRepairRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const router = useRouter();

  // Fetch requests
  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await getCreditRepairRequests(
        page,
        limit,
        sortBy,
        sortOrder,
        filterStatus,
        debouncedSearchQuery
      );
      setRequests(response.data);
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

  // Fetch requests on mount and when dependencies change
  useEffect(() => {
    fetchRequests();
  }, [page, limit, sortBy, sortOrder, filterStatus, debouncedSearchQuery]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Immediately apply the search without waiting for debounce
    setDebouncedSearchQuery(searchQuery);
    setPage(1);
  };

  // Handle pagination
  const totalPages = Math.ceil(total / limit);

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  // Handle filtering
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFilterStatus(value === '' ? undefined : parseInt(value));
    setPage(1); // Reset to first page when filter changes
  };

  // Handle row click to navigate to detail page
  const handleRowClick = (id: string) => {
    router.push(`/admin/credit-repair-requests/${id}`);
  };

  // Handle update status button click
  const handleUpdateStatusClick = (e: React.MouseEvent, request: CreditRepairRequest) => {
    e.stopPropagation(); // Prevent row click from triggering
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  // Handle copy tracking ID
  const copyTrackingId = (e: React.MouseEvent, trackingId: string) => {
    e.stopPropagation(); // Prevent row click from triggering
    navigator.clipboard.writeText(trackingId)
      .then(() => {
        setCopiedId(trackingId);
        setTimeout(() => setCopiedId(null), 2000); // Reset after 2 seconds
      })
      .catch(() => {
        // Silently fail if clipboard copy doesn't work
      });
  };

  // Handle status update
  const handleStatusUpdate = async () => {
    // Close modal and refresh data
    setIsModalOpen(false);
    setSelectedRequest(null);
    fetchRequests();
  };

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Credit Repair Requests</h1>
        <button
          onClick={fetchRequests}
          className="flex items-center px-3 py-2 text-sm font-medium text-primary bg-white rounded-md border border-gray-300 hover:bg-gray-50"
        >
          <ArrowPathIcon className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Search by name, email, or tracking ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>

        <div className="flex items-center">
          <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
          <select
            className="block w-full pl-3 pr-10 py-2 text-base text-black border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            value={filterStatus || ''}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            {Object.entries(CREDIT_REPAIR_STATUS_TEXT).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Requests Table */}
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
                    Tracking ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchased Package
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.from({ length: 10 }).map((_, index) => (
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
                      Tracking ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purchased Package
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.length > 0 ? (
                    requests.map((request) => (
                      <tr
                        key={request._id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleRowClick(request._id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{request.fullName}</div>
                          <div className="text-sm text-gray-500">{request.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm text-gray-900 mr-2">{request.trackingId}</div>
                            <button
                              onClick={(e) => copyTrackingId(e, request.trackingId)}
                              className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                              aria-label="Copy tracking ID"
                              title="Copy tracking ID"
                            >
                              {copiedId === request.trackingId ? (
                                <CheckIcon className="h-4 w-4 text-green-500" />
                              ) : (
                                <DocumentDuplicateIcon className="h-4 w-4 text-primary" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ${request.packagePrice || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={request.currentStatus} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => handleUpdateStatusClick(e, request)}
                            className="text-primary hover:text-primary-hover px-3 py-1 border border-primary rounded-md hover:bg-primary hover:bg-opacity-10 transition-colors"
                          >
                            Update Status
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <ClipboardDocumentListIcon className="h-12 w-12 text-gray-300 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-1">No requests found</h3>
                          <p className="text-sm text-gray-500 mb-4">
                            {searchQuery ?
                              "No results match your search criteria. Try adjusting your filters or search terms." :
                              "There are no credit repair requests available at this time."}
                          </p>
                          {searchQuery && (
                            <button
                              onClick={() => {
                                setSearchQuery('');
                                setDebouncedSearchQuery('');
                                setFilterStatus(undefined);
                              }}
                              className="px-4 py-2 text-sm font-medium text-primary bg-white rounded-md border border-primary hover:bg-primary hover:bg-opacity-10"
                            >
                              Clear filters
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={handlePreviousPage}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={page >= totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    page >= totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
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
                    {/* Page numbers would go here */}
                    <button
                      onClick={handleNextPage}
                      disabled={page >= totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        page >= totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Status Update Modal */}
      {selectedRequest && (
        <StatusUpdateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          request={selectedRequest}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}

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
import { CREDIT_REPAIR_STATUS_TEXT } from '@/types/creditRepair';
import StatusBadge from '@/components/common/StatusBadge';
import CountBadge from '@/components/common/CountBadge';

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
      console.log('Fetching with filterStatus:', filterStatus, 'Type:', typeof filterStatus);
      const response = await getCreditRepairRequests(
        page,
        limit,
        sortBy,
        sortOrder,
        filterStatus,
        debouncedSearchQuery
      );
      console.log('Response received:', response);
      setRequests(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Error fetching requests:', error);
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
    
    // Only set a filter value if something is selected
    if (value === "") {
      setFilterStatus(undefined);
      console.log('Filter status cleared');
    } else {
      // Convert to number for proper comparison
      const numValue = Number(value);
      setFilterStatus(numValue);
      console.log('Filter status set to:', numValue, 'Type:', typeof numValue);
      
      // Direct API call for debugging
      fetch(`http://localhost:3005/admin/credit-repair-requests?filterStatus=${value}`)
        .then(res => res.json())
        .then(data => {
          console.log('Direct API call result:', data);
        })
        .catch(err => {
          console.error('Direct API call error:', err);
        });
    }
    
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



  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Credit Repair Requests</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Total:</span>
            <CountBadge count={total} />
          </div>
          <button
            onClick={fetchRequests}
            className="flex items-center px-3 py-2 text-sm font-medium text-primary bg-white rounded-md border border-gray-300 hover:bg-gray-50"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
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
            value={filterStatus !== undefined ? filterStatus.toString() : ''}
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            {Object.entries(CREDIT_REPAIR_STATUS_TEXT).map(([value, label]) => (
              <option key={value} value={value}>
                {value} - {label}
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
                            {request.trackingId ? (
                              <>
                                <div className="text-sm text-gray-900 mr-2">{request.trackingId}</div>
                                <button
                                  type="button"
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
                              </>
                            ) : (
                              <span className="text-sm text-gray-400 italic">No Tracking ID</span>
                            )}
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
                          {new Date(request.createdAt).toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="relative inline-block group">
                            <button
                              type="button"
                              onClick={(e) => handleUpdateStatusClick(e, request)}
                              disabled={!request.trackingId}
                              className={`px-3 py-1 border rounded-md transition-colors ${
                                !request.trackingId
                                  ? 'text-gray-400 border-gray-300 cursor-not-allowed group-hover:relative'
                                  : 'text-primary border-primary hover:text-primary-hover hover:bg-primary hover:bg-opacity-10'
                              }`}
                              onMouseEnter={(e) => {
                                if (!request.trackingId) {
                                  const buttonRect = e.currentTarget.getBoundingClientRect();
                                  const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                                  if (tooltip) {
                                    tooltip.style.display = 'block';
                                    tooltip.style.top = `${window.scrollY + buttonRect.top - 10}px`;
                                    tooltip.style.left = `${buttonRect.left + buttonRect.width / 2}px`;
                                    tooltip.style.transform = 'translateX(-50%) translateY(-100%)';
                                  }
                                }
                              }}
                              onMouseLeave={() => {
                                const tooltip = document.querySelector('.status-tooltip') as HTMLElement | null;
                                if (tooltip) {
                                  tooltip.style.display = 'none';
                                }
                              }}
                            >
                              Update Status
                            </button>
                            {!request.trackingId && (
                              <div 
                                className="fixed z-50 hidden status-tooltip w-64 p-3 text-sm text-white bg-gray-900 rounded shadow-lg"
                                style={{
                                  display: 'none',
                                  transform: 'translateX(-50%) translateY(-100%)',
                                  pointerEvents: 'none'
                                }}
                              >
                                <div className="relative">
                                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45" />
                                  <p>Cannot update status without a tracking ID. Please add a tracking ID first.</p>
                                </div>
                              </div>
                            )}
                          </div>
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
                  Page {page} of {totalPages || 1}
                </span>
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
                    {/* Current page number */}
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      Page {page} of {totalPages || 1}
                    </span>
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

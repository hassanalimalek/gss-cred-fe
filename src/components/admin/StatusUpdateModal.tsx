'use client';

import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import type { CreditRepairRequest } from '@/api/admin';
import { updateCreditRepairStatus } from '@/api/admin';
import {
  ECreditRepairStatus,
  CREDIT_REPAIR_STATUS_TEXT,
  CREDIT_REPAIR_STATUS_DESCRIPTIONS
} from '@/types/creditRepair';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { showSuccessToast, showErrorToast } from '@/utils/toast';
import StatusBadge from '@/components/common/StatusBadge';

interface StatusUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: CreditRepairRequest;
  onStatusUpdate: () => void;
}

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  isOpen,
  onClose,
  request,
  onStatusUpdate,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<number>(request.currentStatus);
  const [userNotes, setUserNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState<boolean>(false);
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState<boolean>(false);

  // Reset form when request changes
  React.useEffect(() => {
    if (request) {
      setSelectedStatus(request.currentStatus);
      setUserNotes('');
    }
  }, [request]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(Number.parseInt(e.target.value, 10));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedStatus === request.currentStatus) {
      showErrorToast('Please select a different status');
      return;
    }

    // If the selected status is REQUEST_DENIED, show the confirmation modal
    if (selectedStatus === ECreditRepairStatus.REQUEST_DENIED) {
      setIsRejectConfirmOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const updateData: { newStatus: number; userNotes?: string } = {
        newStatus: selectedStatus,
      };

      // Only include userNotes if it's not empty
      const trimmedNotes = userNotes.trim();
      if (trimmedNotes) {
        updateData.userNotes = trimmedNotes;
      }

      await updateCreditRepairStatus(request._id, updateData);

      showSuccessToast('Status updated successfully');
      onStatusUpdate();
    } catch (error) {
      showErrorToast((error as Error).message || 'Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);

    try {
      const updateData: { newStatus: number; userNotes?: string } = {
        newStatus: ECreditRepairStatus.REQUEST_DENIED,
      };

      // Only include userNotes if it's not empty
      const trimmedNotes = userNotes.trim();
      if (trimmedNotes) {
        updateData.userNotes = trimmedNotes;
      } else {
        // Require notes for rejections
        showErrorToast('Please provide a reason for rejection in the notes field');
        setIsSubmitting(false);
        return;
      }

      await updateCreditRepairStatus(request._id, updateData);

      showSuccessToast('Request has been rejected');
      setIsRejectConfirmOpen(false);
      onStatusUpdate();
    } catch (error) {
      showErrorToast((error as Error).message || 'Failed to reject request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Update Status
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Customer Information */}
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-500">Customer Information</h4>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Name</p>
                      <p className="text-sm text-gray-900">{request.fullName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">{request.email}</p>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-500">Tracking ID</p>
                        {!request.trackingId && (
                          <InformationCircleIcon 
                            className="ml-1 h-4 w-4 text-yellow-500" 
                            title="A tracking ID is required to update status"
                          />
                        )}
                      </div>
                      <p className="text-sm text-gray-900">
                        {request.trackingId || 'Not assigned'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Current Status</p>
                      <div className="mt-1">
                        <StatusBadge status={request.currentStatus} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Submission Date</p>
                      <p className="text-sm text-gray-900">{formatDate(request.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Status Update Form */}
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                        New Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-gray-900 border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        disabled={isSubmitting}
                      >
                        {Object.entries(CREDIT_REPAIR_STATUS_TEXT)
                          .map(([value, label]) => (
                            <option key={value} value={value}>
                              {value} - {label}
                            </option>
                          ))}
                      </select>
                      {selectedStatus !== request.currentStatus &&
                        selectedStatus !== ECreditRepairStatus.REQUEST_DENIED && (
                        <p className="mt-1 text-sm text-gray-500">
                          {CREDIT_REPAIR_STATUS_DESCRIPTIONS[selectedStatus as ECreditRepairStatus]}
                        </p>
                      )}
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg mt-4">
                      <label htmlFor="userNotes" className="block text-sm font-medium text-gray-700">
                        Notes for Customer
                      </label>
                      <div className="mt-2">
                        <textarea
                          id="userNotes"
                          name="userNotes"
                          rows={4}
                          className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm text-gray-900 border border-gray-300 rounded-md p-3"
                          placeholder={selectedStatus === ECreditRepairStatus.REQUEST_DENIED
                            ? "Enter rejection reason (required) - this will be visible to the customer"
                            : "Enter notes that will be visible to the customer about this status update"}
                          value={userNotes}
                          onChange={(e) => setUserNotes(e.target.value)}
                          disabled={isSubmitting}
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        These notes will be visible to the customer when they check their application status.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-primary bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        onClick={() => setIsHistoryModalOpen(true)}
                        disabled={isSubmitting}
                      >
                        View Status History
                      </button>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        onClick={onClose}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <div className="relative group">
                        <button
                          type="submit"
                          className={`px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                            !request.trackingId 
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : 'bg-primary hover:bg-primary-hover'
                          }`}
                          disabled={isSubmitting || selectedStatus === request.currentStatus || !request.trackingId}
                        >
                          {isSubmitting ? (
                            <LoadingSpinner size="sm" color="white" />
                          ) : (
                            'Update Status'
                          )}
                        </button>
                        {!request.trackingId && (
                          <div className="absolute z-50 invisible group-hover:visible w-64 p-3 text-sm text-white bg-gray-900 rounded shadow-lg left-1/2 -translate-x-1/2 -top-2 -translate-y-full">
                            <div className="relative">
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-gray-900 rotate-45" />
                              <p>Cannot update status without a tracking ID.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>

    {/* Status History Modal */}
    <Transition appear show={isHistoryModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsHistoryModalOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Status History
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setIsHistoryModalOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Status History Content */}
                <div className="mt-4">
                  <div className="flow-root">
                    <ul className="-mb-8">
                        {request.statusHistory.map((historyItem, index) => (
                        <li key={`${historyItem.status}-${historyItem.timestamp}-${index}`}>
                          <div className="relative pb-8">
                            {index !== request.statusHistory.length - 1 ? (
                              <span
                                className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3">
                              <div>
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ring-8 ring-white">
                                  <span className="text-xs font-medium text-gray-500">{historyItem.status}</span>
                                </div>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                <div>
                                  <p className="text-sm text-gray-900">{historyItem.statusText}</p>
                                  {historyItem.userNotes ? (
                                    <p className="text-sm text-gray-500 mt-1">{historyItem.userNotes}</p>
                                  ) : (
                                    <p className="text-sm text-gray-400 mt-1 italic">No notes added</p>
                                  )}
                                </div>
                                <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                  {formatDate(historyItem.timestamp)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    onClick={() => setIsHistoryModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>

    {/* Reject Confirmation Modal */}
    <Transition appear show={isRejectConfirmOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => setIsRejectConfirmOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Confirm Rejection
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setIsRejectConfirmOpen(false)}
                    disabled={isSubmitting}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-4">
                  <div className="bg-red-50 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Are you sure you want to reject this request?</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>This action will mark the request as "Request Denied" and notify the customer. The notes you provide will be sent to the customer as the rejection reason.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    onClick={() => setIsRejectConfirmOpen(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={handleReject}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <LoadingSpinner size="sm" color="white" />
                    ) : (
                      'Confirm Rejection'
                    )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
    </>
  );
};

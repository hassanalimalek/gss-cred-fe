import React from 'react';
import { ECreditRepairStatus, CREDIT_REPAIR_STATUS_TEXT } from '@/types/creditRepair';

interface StatusBadgeProps {
  status: number;
  className?: string;
}

/**
 * StatusBadge component for displaying credit repair status
 * 
 * This is a shared component used across the application to ensure
 * consistent styling and behavior for status badges.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
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
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${bgColor} ${className}`}>
      <span className="mr-1 font-semibold">{status}</span>
      <span className="mx-0.5">-</span>
      {CREDIT_REPAIR_STATUS_TEXT[status as ECreditRepairStatus]}
    </span>
  );
};

export default StatusBadge;

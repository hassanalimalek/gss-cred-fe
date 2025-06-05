'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { getCreditRepairRequests, getCreditRepairStatistics, CreditRepairRequest } from '@/api/admin';
import { CardSkeleton, TableRowSkeleton } from '@/components/common/Skeleton';
import { ECreditRepairStatus, CREDIT_REPAIR_STATUS_TEXT } from '@/types/creditRepair';
import { ReferralStats } from '@/components/admin/ReferralStats';

// Dashboard stat card component
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-black mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-opacity-10 ${color.replace('border-', 'bg-')}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Recent requests table component
interface RecentRequestsProps {
  requests: CreditRepairRequest[];
  isLoading: boolean;
}

const RecentRequests: React.FC<RecentRequestsProps> = ({ requests, isLoading }) => {
  const router = useRouter();

  const handleRowClick = (id: string) => {
    router.push(`/admin/credit-repair-requests/${id}`);
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

  if (isLoading) {
    return (
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRowSkeleton key={index} columns={5} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
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
                  <div className="text-sm text-gray-900">{request.trackingId}</div>
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
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-12">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-gray-300 mb-4">
                    <ClipboardDocumentListIcon className="h-16 w-16" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No requests found</h3>
                  <p className="text-gray-500 mt-1">There are no credit repair requests available at this time.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default function AdminDashboard() {
  const [requests, setRequests] = useState<CreditRepairRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    cancelled: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recent requests for display (limit to 5)
        const recentResponse = await getCreditRepairRequests(1, 5);

        // If we got an empty response due to auth error, don't update state
        if (!recentResponse.data || (recentResponse.data.length === 0 && recentResponse.total === 0)) {
          setIsLoading(false);
          return;
        }

        // Set recent requests for display
        setRequests(recentResponse.data);

        // Fetch statistics from the backend
        const statistics = await getCreditRepairStatistics();

        // Update stats state with data from the backend
        setStats(statistics);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Silently handle error for UI
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewAllRequests = () => {
    router.push('/admin/credit-repair-requests');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Requests"
              value={stats.total}
              icon={<ClipboardDocumentListIcon className="h-6 w-6 text-primary" />}
              color="border-primary"
            />
            <StatCard
              title="In Progress"
              value={stats.inProgress}
              icon={<ClockIcon className="h-6 w-6 text-yellow-500" />}
              color="border-yellow-500"
            />
            <StatCard
              title="Completed"
              value={stats.completed}
              icon={<CheckCircleIcon className="h-6 w-6 text-green-500" />}
              color="border-green-500"
            />
            <StatCard
              title="Cancelled"
              value={stats.cancelled}
              icon={<XMarkIcon className="h-6 w-6 text-red-500" />}
              color="border-red-500"
            />
          </>
        )}
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Recent Requests</h2>
          <button
            onClick={handleViewAllRequests}
            className="text-sm font-medium text-primary hover:text-primary-hover"
          >
            View all
          </button>
        </div>
        <RecentRequests requests={requests} isLoading={isLoading} />
      </div>

      {/* Referral Statistics */}
      <ReferralStats className="mt-6" />
    </div>
  );
}

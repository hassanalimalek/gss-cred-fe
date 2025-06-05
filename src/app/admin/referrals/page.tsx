'use client';

import React, { useState, useEffect } from 'react';
import { UsersIcon, UserGroupIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getReferralStatistics } from '@/api';
import { CardSkeleton, TableRowSkeleton } from '@/components/common/Skeleton';
import { useRouter } from 'next/navigation';

interface TopReferrer {
  _id: string;
  fullName: string;
  email: string;
  referralCount: number;
  totalReferralAmount?: number;
}

interface ReferralStatsData {
  totalReferrals: number;
  activeReferrers: number;
  topReferrers: TopReferrer[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function ReferralsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState<ReferralStatsData>({
    totalReferrals: 0,
    activeReferrers: 0,
    topReferrers: [],
  });

  const handleViewCustomer = (customerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/admin/customers/${customerId}`);
  };

  const fetchReferralStats = async (search: string = '', page: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getReferralStatistics(search, page, 10);

      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data received from server');
      }

      if (!Array.isArray(data.topReferrers)) {
        data.topReferrers = [];
      }

      data.totalReferrals = Number(data.totalReferrals) || 0;
      data.activeReferrers = Number(data.activeReferrers) || 0;

      data.topReferrers = data.topReferrers.map(referrer => ({
        ...referrer,
        referralCount: Number(referrer.referralCount) || 0,
        totalReferralAmount: Number(referrer.totalReferralAmount) || 0
      }));

      setStats(data);
    } catch (error) {
      console.error('Error fetching referral statistics:', error);
      setError(error instanceof Error ? error.message : 'Failed to load referral statistics');
      setStats({
        totalReferrals: 0,
        activeReferrers: 0,
        topReferrers: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReferralStats(searchTerm, currentPage);
  }, [searchTerm, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchReferralStats(searchTerm, 1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchReferralStats(searchTerm, page);
  };

  // Stat card component
  const StatCard = ({ title, value, icon, color }: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
  }) => (
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

  // Pagination component
  const Pagination = () => {
    if (!stats.pagination || stats.pagination.totalPages <= 1) return null;

    const { page, totalPages } = stats.pagination;
    const pages = [];
    
    for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing page <span className="font-medium">{page}</span> of{' '}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div>
            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                Previous
              </button>
              {pages.map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    p === page
                      ? 'z-10 bg-primary text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'
                      : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <UserGroupIcon className="h-6 w-6 text-gray-500 mr-2" />
          <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Referrals"
              value={stats.totalReferrals}
              icon={<UserGroupIcon className="h-6 w-6 text-blue-500" />}
              color="border-blue-500"
            />
            <StatCard
              title="Active Referrers"
              value={stats.activeReferrers}
              icon={<UsersIcon className="h-6 w-6 text-green-500" />}
              color="border-green-500"
            />
          </>
        )}
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-base font-medium text-gray-900 mb-4 sm:mb-0">Top Referrers</h3>
            <form onSubmit={handleSearch} className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search referrers..."
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <TableRowSkeleton key={i} columns={4} />
              ))}
            </div>
          ) : stats.topReferrers.length > 0 ? (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referrals
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.topReferrers.map((referrer) => (
                    <tr key={referrer._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={(e) => handleViewCustomer(referrer._id, e)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {referrer.fullName}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{referrer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {referrer.referralCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ${typeof referrer.totalReferralAmount === 'number'
                            ? referrer.totalReferralAmount.toFixed(2)
                            : '0.00'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination />
            </>
          ) : (
            <div className="p-8 text-center">
              <UsersIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No referrals found</h3>
              <p className="text-gray-500">
                {searchTerm ? `No referrers match "${searchTerm}"` : 'There are no active referrers in the system yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

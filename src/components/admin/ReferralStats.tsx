import React, { useState, useEffect } from 'react';
import { UsersIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { getReferralStatistics } from '@/api';
import { CardSkeleton } from '@/components/common/Skeleton';
import { useRouter } from 'next/navigation';

interface ReferralStatsProps {
  className?: string;
}

interface TopReferrer {
  _id: string;
  fullName: string;
  email: string;
  referralCount: number;
  totalReferralAmount?: number;
}

export const ReferralStats: React.FC<ReferralStatsProps> = ({ className = '' }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    activeReferrers: 0,
    topReferrers: [] as TopReferrer[],
  });

  const handleViewCustomer = (customerId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any parent click handlers from firing
    router.push(`/admin/customers/${customerId}`);
  };

  useEffect(() => {
    const fetchReferralStats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getReferralStatistics();

        // Validate the data structure
        if (!data || typeof data !== 'object') {
          throw new Error('Invalid data received from server');
        }

        // Ensure topReferrers is an array
        if (!Array.isArray(data.topReferrers)) {
          data.topReferrers = [];
        }

        // Ensure numeric values are valid numbers
        data.totalReferrals = Number(data.totalReferrals) || 0;
        data.activeReferrers = Number(data.activeReferrers) || 0;

        // Process topReferrers to ensure totalReferralAmount is a valid number
        data.topReferrers = data.topReferrers.map(referrer => ({
          ...referrer,
          referralCount: Number(referrer.referralCount) || 0,
          totalReferralAmount: Number(referrer.totalReferralAmount) || 0
        }));

        setStats(data);
      } catch (error) {
        console.error('Error fetching referral statistics:', error);
        setError(error instanceof Error ? error.message : 'Failed to load referral statistics');
        // Set default values on error
        setStats({
          totalReferrals: 0,
          activeReferrers: 0,
          topReferrers: []
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferralStats();
  }, []);

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

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center mb-4">
        <UsersIcon className="h-5 w-5 text-gray-500 mr-2" />
        <h2 className="text-lg font-medium text-gray-900">Referral Statistics</h2>
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
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <CardSkeleton />
        ) : (
          <StatCard
            title="Total Referrals"
            value={stats.totalReferrals}
            icon={<UserGroupIcon className="h-6 w-6 text-blue-500" />}
            color="border-blue-500"
          />
        )}
      </div>

      {/* Top Referrers */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-900">Top Referrers</h3>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : stats.topReferrers.length > 0 ? (
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
                  <tr key={referrer._id}>
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
          ) : (
            <div className="p-8 text-center">
              <UsersIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No referrals yet</h3>
              <p className="text-gray-500">
                There are no active referrers in the system yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

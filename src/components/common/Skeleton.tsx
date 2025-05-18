'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4' 
}) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 rounded ${width} ${height} ${className}`}
      aria-hidden="true"
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-gray-200 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/4 mt-1"></div>
        </div>
        <div className="p-3 rounded-full bg-gray-200 h-10 w-10"></div>
      </div>
    </div>
  );
};

export const TableRowSkeleton: React.FC<{ columns: number }> = ({ columns }) => {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          {index === 0 && <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>}
        </td>
      ))}
    </tr>
  );
};

export const DetailPageSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="mr-4 p-2 rounded-full bg-gray-200 h-8 w-8"></div>
            <div className="h-6 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded-full w-32"></div>
        </div>

        {/* Customer and Request Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="h-5 bg-gray-200 rounded w-40 mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="h-5 bg-gray-200 rounded w-40 mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>
                  <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Status History */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 bg-gray-200 rounded w-32"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="border-l-2 border-gray-200 pl-4 pb-4">
                <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-16 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

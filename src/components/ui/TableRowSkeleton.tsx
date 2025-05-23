import React from 'react';

interface TableRowSkeletonProps {
  columns: number;
}

export default function TableRowSkeleton({ columns }: TableRowSkeletonProps) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-4 whitespace-nowrap">
          <div className="animate-pulse bg-gray-200 rounded h-4 w-24"></div>
        </td>
      ))}
    </tr>
  );
}

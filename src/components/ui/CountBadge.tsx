import React from 'react';

interface CountBadgeProps {
  count: number;
}

export default function CountBadge({ count }: CountBadgeProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      {count}
    </span>
  );
}

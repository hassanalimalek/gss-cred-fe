import React from 'react';

interface CountBadgeProps {
  count: number;
  className?: string;
}

/**
 * A reusable count badge component for displaying item counts
 * Used across the application for consistent styling
 */
export const CountBadge: React.FC<CountBadgeProps> = ({ count, className = '' }) => {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ${className}`}>
      {count}
    </span>
  );
};

export default CountBadge;

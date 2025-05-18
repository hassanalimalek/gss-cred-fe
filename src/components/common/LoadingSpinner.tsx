"use client";
import React from "react";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'yellow' | 'blue' | 'gray' | 'white' | 'primary' | 'accent';
  className?: string;
}

export const LoadingSpinner = React.memo(({
  size = 'md',
  color = 'yellow',
  className = ''
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  const colorClasses = {
    yellow: 'border-yellow-600 border-t-transparent',
    blue: 'border-sky-600 border-t-transparent',
    gray: 'border-gray-600 border-t-transparent',
    white: 'border-white border-t-transparent',
    primary: 'border-primary border-t-transparent',
    accent: 'border-accent border-t-transparent'
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`} aria-live="polite">
      <div
        role="progressbar"
        aria-label="Loading"
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
      />
      <span className="sr-only">Loading...</span>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

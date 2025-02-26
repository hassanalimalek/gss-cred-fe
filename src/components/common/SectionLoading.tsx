"use client";
import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";

interface SectionLoadingProps {
  height?: string;
  message?: string;
}

export const SectionLoading = React.memo(({ 
  height = "300px", 
  message = "Loading section..." 
}: SectionLoadingProps) => {
  return (
    <div 
      className="flex flex-col items-center justify-center w-full bg-gray-50"
      style={{ height }}
      aria-live="polite"
      aria-busy="true"
    >
      <LoadingSpinner size="lg" color="yellow" />
      <p className="mt-4 text-gray-600 font-montserrat">{message}</p>
    </div>
  );
});

SectionLoading.displayName = 'SectionLoading';

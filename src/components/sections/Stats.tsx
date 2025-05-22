"use client";

import { useRef } from "react";
import { stats } from "@/data/stats";
import React from 'react'

/**
 * Props for the StatItem component
 */
interface StatItemProps {
  number: string;  // The number to display
  text: string;    // Description text for the stat
  symbol?: string; // Optional symbol to display after the number (e.g., '%', '+')
}

// Animation functions removed

/**
 * Individual stat item component with static display
 */
const StatItem = ({ number, text, symbol = "+" }: StatItemProps) => {
  const ref = useRef<HTMLDivElement>(null);

  // Parse the numeric value correctly
  const numericValue = parseFloat(number.replace(/,/g, ""));

  // Check if we need to show decimals and how many
  const decimalPlaces = (() => {
    const parts = number.split('.');
    return parts.length > 1 ? parts[1].length : 0;
  })();

  // Format the value with the correct number of decimal places
  const formattedValue = decimalPlaces > 0
    ? numericValue.toFixed(decimalPlaces)
    : Math.round(numericValue).toLocaleString();

  return (
    <div
      ref={ref}
      className="flex flex-col items-center w-full"
      role="group"
      aria-label={`${text}: ${formattedValue}${symbol}`}
    >
      <div className="flex items-center gap-1 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0A173B] font-['PT_Serif']">
        <span aria-hidden="true">{formattedValue}</span>
        <span aria-hidden="true">{symbol}</span>
      </div>
      <p className="mt-2 sm:mt-3 text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-[#051D4B] font-['PT_Serif'] text-center">{text}</p>
    </div>
  );
};

/**
 * Stats section component displaying company statistics
 */
export const Stats = () => {
  return (
    <section
      id="stats"
      className="px-4 sm:px-5 py-12 sm:py-16 bg-[#F5F5F5] w-full"
      aria-label="Company Statistics"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 md:flex md:items-center md:justify-between gap-6 sm:gap-8 w-full sm:w-[98%] mx-auto">
          {stats.map((stat, index) => (
            <React.Fragment key={`stat-fragment-${index}`}>
              {index > 0 && (
                <div className="hidden md:block h-16 w-px bg-[#D09C01]" role="separator" aria-hidden="true" key={`separator-${index}`} />
              )}
              <StatItem
                key={`stat-${index}`}
                number={stat.number}
                text={stat.text}
                symbol={stat.symbol || "+"}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

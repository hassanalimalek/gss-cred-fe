"use client";

import { motion, useInView, UseInViewOptions } from "framer-motion";
import { useRef } from "react";
import { useCountAnimation } from "@/hooks/useCountAnimation";
import { stats } from "@/data/stats";

/**
 * Props for the StatItem component
 */
interface StatItemProps {
  number: string;  // The target number to animate to
  text: string;    // Description text for the stat
  symbol?: string; // Optional symbol to display after the number (e.g., '%', '+')
  delay?: number;  // Animation delay in seconds
}

/**
 * Creates a fade-in animation with customizable direction and delay
 */
const fadeIn = (direction: "up" | "down" = "up", delay: number = 0) => ({
  initial: { y: direction === "up" ? 20 : -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: {
    duration: 0.6,
    ease: [0.43, 0.13, 0.23, 0.96],
    delay,
  },
});

/**
 * Individual stat item component with animated counter
 */
const StatItem = ({ number, text, symbol = "+", delay = 0 }: StatItemProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inViewOptions: UseInViewOptions = { once: true, amount: 0.3 };
  const isInView = useInView(ref, inViewOptions);
  
  // Parse the numeric value correctly
  const numericValue = parseFloat(number.replace(/,/g, ""));
  
  // Check if we need to show decimals and how many
  const decimalPlaces = (() => {
    const parts = number.split('.');
    return parts.length > 1 ? parts[1].length : 0;
  })();
  
  // Use the animated value with proper decimal precision
  const animatedValue = useCountAnimation(
    numericValue,
    2000,
    delay,
    isInView,
    decimalPlaces // Pass the decimal precision to the hook
  );
  
  // Format the value with the correct number of decimal places
  const formattedValue = decimalPlaces > 0 
    ? animatedValue.toFixed(decimalPlaces) 
    : Math.round(animatedValue).toLocaleString();

  return (
    <motion.div 
      ref={ref} 
      {...fadeIn("up", delay)} 
      className="flex flex-col items-center w-full"
      role="group"
      aria-label={`${text}: ${formattedValue}${symbol}`}
    >
      <div className="flex items-center gap-1 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0A173B] font-['PT_Serif']">
        <span aria-hidden="true">{formattedValue}</span>
        <span aria-hidden="true">{symbol}</span>
      </div>
      <p className="mt-2 sm:mt-3 text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-[#051D4B] font-['PT_Serif'] text-center">{text}</p>
    </motion.div>
  );
};

/**
 * Stats section component displaying company statistics with animated counters
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
            <>
              {index > 0 && (
                <div className="hidden md:block h-16 w-px bg-[#D09C01]" role="separator" aria-hidden="true" key={`separator-${index}`} />
              )}
              <StatItem 
                key={`stat-${index}`}
                number={stat.number} 
                text={stat.text} 
                symbol={stat.symbol || "+"} 
                delay={0.1 + (index * 0.2)} 
              />
            </>
          ))}
        </div>
      </div>
    </section>
  );
};

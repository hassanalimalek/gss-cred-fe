import { useState, useRef, useCallback, useEffect } from "react";

/**
 * Custom hook for animating a number from 0 to a target value
 * @param end - Target number to animate to
 * @param duration - Animation duration in milliseconds
 * @param delay - Delay before starting animation in seconds
 * @param isInView - Whether the element is in viewport
 * @param precision - Number of decimal places to preserve (default: 0)
 */
export const useCountAnimation = (
  end: number, 
  duration: number = 2000, 
  delay: number = 0, 
  isInView: boolean,
  precision: number = 0
) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const frameRef = useRef<number | undefined>(undefined);

  // Memoized animation function to prevent unnecessary re-renders
  const animate = useCallback(() => {
    const startTime = Date.now() + delay * 1000;
    const endValue = end;

    // Frame-by-frame update function for smooth animation
    const updateCount = () => {
      const now = Date.now();
      if (now < startTime) {
        frameRef.current = requestAnimationFrame(updateCount);
        return;
      }

      // Calculate progress and current value
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Use precision-aware calculation for decimal values
      const factor = Math.pow(10, precision);
      let currentValue;
      
      if (precision > 0) {
        // For decimal values (preserve precision)
        currentValue = Math.round(endValue * progress * factor) / factor;
      } else {
        // For integers (floor to avoid jumping ahead)
        currentValue = Math.floor(endValue * progress);
      }

      setCount(currentValue);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(updateCount);
      } else {
        // Ensure we end exactly at the target value
        setCount(endValue);
        setHasAnimated(true);
      }
    };

    frameRef.current = requestAnimationFrame(updateCount);
  }, [end, duration, delay, precision]);

  useEffect(() => {
    // Only animate if element is in view and hasn't animated yet
    if (!isInView || hasAnimated) return;

    animate();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [isInView, hasAnimated, animate]);

  return count;
};
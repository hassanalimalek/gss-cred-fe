'use client';

import { useEffect } from 'react';

export const useHashNavigation = () => {
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const scrollToElement = (element: Element, retryCount = 0) => {
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Verify scroll position after animation
          setTimeout(() => {
            const currentPosition = window.scrollY;
            if (Math.abs(currentPosition - offsetPosition) > 50 && retryCount < 3) {
              scrollToElement(element, retryCount + 1);
            }
          }, 500);
        };

        // Special handling for process-steps section
        if (hash === '#process-steps') {
          const processSteps = document.querySelector('#process-steps');
          if (processSteps) {
            scrollToElement(processSteps);
            return;
          }
        }

        // Handle other hash navigation
        const element = document.querySelector(hash);
        if (element) {
          // Add a longer delay for initial scroll to ensure content is fully rendered
          setTimeout(() => {
            scrollToElement(element);
          }, 800);
        }
      }
    };

    // Handle hash navigation on initial load with an even longer delay
    if (window.location.hash) {
      setTimeout(handleHashChange, 1000);
    }

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
};
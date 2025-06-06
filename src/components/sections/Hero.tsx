"use client";
import { motion, TargetAndTransition, Transition } from "framer-motion";

// Interface for animation properties using Framer Motion types
interface AnimationProps {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  transition: Transition;
}

// Animation utility for fade-in effect
const fadeIn = (direction: "up" | "down" = "up", delay: number = 0): AnimationProps => ({
  initial: { y: direction === "up" ? 40 : -40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: {
    duration: 0.8,
    ease: [0.43, 0.13, 0.23, 0.96],
    delay,
  },
});

// Hero section component with animated elements
export const Hero = () => {
  return (
    <section 
      id="home"
      className=" bg-white flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16"
      aria-labelledby="hero-heading"
    >
      <h1 
        id="hero-heading"
        className="self-center mt-12 sm:mt-16 lg:mt-24 text-4xl sm:text-5xl lg:text-7xl leading-tight text-center text-sky-950 font-['PT_Serif'] px-4 max-w-[1200px]"
      >
        Mulligan Credit Repair
      </h1>
      
      <motion.p 
        {...fadeIn("up", 0.2)}
        className="mt-7 text-base sm:text-lg lg:text-xl font-light leading-relaxed text-center text-sky-950 max-w-3xl px-4 w-full"
      >
        Restore your credit score with our expert services. We remove 
        repossessions, foreclosures, bankruptcies, medical bills, inquiries, 
        late payments, and collections. Let us help you achieve financial freedom.
      </motion.p>

      <motion.div 
        {...fadeIn("up", 0.4)}
        className="flex gap-4 mt-7"
      >
        <a
          href="#onboarding"
          className="inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 transition-all rounded-md min-h-[44px] min-w-[44px]"
          role="button"
          aria-label="Get started with credit repair services"
        >
          Get Started
        </a>
      </motion.div>

      {/* What we do section */}
      <motion.h2 
        {...fadeIn("up", 0.5)}
        className="mt-20 text-2xl sm:text-3xl lg:text-4xl text-center text-sky-950 font-['PT_Serif'] px-4"
      >
        What we do
      </motion.h2>

      <motion.div 
        {...fadeIn("up", 0.6)}
        className="relative overflow-hidden mt-8 w-full max-w-[1440px] rounded-lg shadow-xl bg-gray-100"
      >
        <div className="aspect-video">
          <iframe
            src="https://www.youtube.com/embed/-jSsTxL9at0"
            title="What we do - Mulligan Credit Repair Services"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="w-full h-full"
            aria-label="Video explaining what Mulligan Credit Repair does"
          />
        </div>
      </motion.div>

      {/* How to enroll section */}
      <motion.h2 
        {...fadeIn("up", 0.7)}
        className="mt-16 text-2xl sm:text-3xl lg:text-4xl text-center text-sky-950 font-['PT_Serif'] px-4"
      >
        How to enroll
      </motion.h2>

      <motion.div 
        {...fadeIn("up", 0.8)}
        className="relative overflow-hidden mt-8 w-full max-w-[1440px] rounded-lg shadow-xl bg-gray-100"
      >
        <div className="aspect-video">
          <iframe
            src="https://www.youtube.com/embed/ZSTM0aj4z48"
            title="How to enroll - Mulligan Credit Repair Process"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="w-full h-full"
            aria-label="Video explaining how to enroll with Mulligan Credit Repair"
          />
        </div>
      </motion.div>

      {/* Phone number and booking section */}
      <motion.div 
        {...fadeIn("up", 0.9)}
        className="mt-12 flex flex-col items-center space-y-6"
      >
        {/* Phone number visual indicator */}
        <div className="flex items-center justify-center space-x-3 text-sky-950">
          <svg 
            className="h-6 w-6 text-yellow-600" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
            />
          </svg>
          <span className="text-lg sm:text-xl font-medium">
            More Questions?
          </span>
        </div>

        {/* Book Next Meeting Button */}
        <a
          href="https://calendly.com/gznitellc/wow"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-10 py-4 text-lg font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 transition-all rounded-md shadow-lg hover:shadow-xl transform hover:scale-105 min-h-[44px] min-w-[44px]"
          role="button"
          aria-label="Book your next meeting with Mulligan Credit Repair"
        >
          <svg 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
            />
          </svg>
          Book a Meeting
        </a>
      </motion.div>
    </section>
  );
};

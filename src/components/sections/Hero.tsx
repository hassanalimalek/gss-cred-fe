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

      <motion.div 
        {...fadeIn("up", 0.6)}
        className="relative overflow-hidden mt-12 w-full max-w-[1440px] rounded-lg shadow-xl bg-gray-100"
      >
        <div className="aspect-video">
          <iframe
            src="https://www.youtube.com/embed/0R15KA3jg4c"
            title="Mulligan Credit Repair - Give your credit game a redo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="w-full h-full"
            aria-label="Introduction video about Mulligan Credit Repair services"
          />
        </div>
      </motion.div>
    </section>
  );
};

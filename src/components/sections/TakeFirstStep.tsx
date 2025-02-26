"use client";
import { motion } from "framer-motion";

/**
 * Creates a fade-in animation with customizable direction and delay
 * @param direction - The direction to fade in from ("up" or "down")
 * @param delay - The delay before starting the animation (in seconds)
 */
const fadeIn = (direction: "up" | "down" = "up", delay: number = 0) => ({
  initial: { y: direction === "up" ? 40 : -40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: {
    duration: 0.8,
    ease: [0.43, 0.13, 0.23, 0.96],
    delay,
  },
});

export const TakeFirstStep = () => {
  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white">
      <div className="w-[95%] sm:w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div {...fadeIn("up", 0)} className="w-full lg:max-w-[45%]">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0A173B] leading-tight mb-6 lg:mb-8 font-['PT_Serif'] text-center lg:text-left">
              Take The First Step <br className="hidden sm:block" /> Towards Financial Freedom
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-montserrat text-center lg:text-left mb-8">
              Join thousands of satisfied clients who have transformed their financial future with Mulligan Credit Repair. 
              Our proven process and dedicated team are ready to help you achieve the credit score you deserve.
            </p>
            <div className="text-center lg:text-left">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-yellow-600 hover:bg-yellow-700 rounded-md transition-colors duration-300 min-h-[44px] min-w-[44px]"
                role="button"
                aria-label="Start your credit repair journey"
              >
                Start Your Journey
              </a>
            </div>
          </motion.div>

          {/* Images */}
          <motion.div {...fadeIn("up", 0.2)} className="relative w-full lg:w-[50%] flex flex-col sm:flex-row justify-center items-center gap-6 lg:gap-8">
            <div className="w-full sm:w-[250px] h-[300px] sm:h-[320px] relative rounded-lg overflow-hidden shadow-lg sm:mt-72">
              <img
                src="/images/wall-outdoor.jpg"
                alt="Professional office environment representing our commitment"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full sm:w-[480px] h-[300px] sm:h-[420px] relative rounded-lg overflow-hidden shadow-lg">
              <img
                src="/images/handshake.webp"
                alt="Team collaboration representing our dedicated support"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
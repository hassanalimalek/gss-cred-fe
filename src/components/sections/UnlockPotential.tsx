"use client";
import { motion } from "framer-motion";
import { fadeIn } from "@/utils/animations";
import Image from "next/image";

export const UnlockPotential = () => {
  return (
    <section 
      className="py-16 sm:py-24 lg:py-32 bg-white"
      aria-labelledby="unlock-potential-heading"
    >
      <div className="w-[95%] sm:w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div {...fadeIn("up", 0)} className="w-full lg:max-w-[45%]">
            <h2 
              id="unlock-potential-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0A173B] leading-tight mb-6 lg:mb-8 font-['PT_Serif'] text-center lg:text-left"
            >
              Unlock Your <br className="hidden sm:block" /> Financial Potential
            </h2>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed font-montserrat text-center lg:text-left mb-8">
              Are you ready to take control of your financial future? At Mulligan Credit Repair, 
              we understand that life happens. Whether it&apos;s unexpected medical bills, job loss, 
              or any unforeseen circumstance, your credit score can take a hit. 
              But don&apos;t worry &ndash; a better financial future is within your reach.
            </p>
            <div className="text-center lg:text-left">
              <a 
                href="#onboarding"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 transition-all rounded-md"
                role="button"
                aria-label="Start your credit repair journey"
              >
                Get Started Today
              </a>
            </div>
          </motion.div>

          {/* Images */}
          <motion.div 
            {...fadeIn("up", 0.2)} 
            className="relative w-full lg:w-[50%] flex flex-col sm:flex-row justify-center items-center gap-6 lg:gap-8"
            role="presentation"
          >
            <div className="w-full sm:w-[250px] h-[300px] sm:h-[320px] relative rounded-lg overflow-hidden shadow-lg sm:mt-72">
              <Image
                src="/images/wall-outdoor.jpg"
                alt="Professional office building exterior representing stability and success"
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="w-full sm:w-[480px] h-[300px] sm:h-[420px] relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/handshake.webp"
                alt="Business handshake symbolizing trust and partnership in credit repair journey"
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

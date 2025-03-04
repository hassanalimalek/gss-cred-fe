'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const HowItWorksHero = () => {
  return (
    <section className="relative min-h-[80vh] flex flex-col bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="text-gray-600 text-lg mb-4 block">Our Process</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0A142F] mb-6 font-['PT_Serif']">
              How Mulligan Credit<br />Repair Works
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-8">
              At Mulligan Credit Repair, we make the credit restoration process simple and hassle-free. 
              Follow these easy steps to take control of your financial future and achieve the credit score you deserve.
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex gap-4 mt-7"
            >
              <a
                href="#process-steps"
                className="inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 transition-all rounded-md min-h-[44px] min-w-[44px]"
                role="button"
                aria-label="Learn about our credit repair process"
              >
                See How It Works
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] lg:h-[600px] w-full rounded-lg overflow-hidden shadow-xl"
          >
            <Image
              src="/images/improve-credit-score.webp"
              alt="Credit score improvement chart"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksHero;
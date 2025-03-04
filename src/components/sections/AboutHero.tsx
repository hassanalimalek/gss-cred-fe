'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export const AboutHero = () => {
  return (
    <section className="relative min-h-[90vh] flex flex-col bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="text-gray-600 text-lg mb-4 block">Learn About Us</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0A142F] mb-6 font-['PT_Serif']">
              Decades Of<br />Experience
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-8">
              Mulligan Credit Repair is dedicated to helping individuals and businesses unlock
              their financial potential. Our personalized plans, comprehensive services, and
              proven track record set us apart as a trusted partner in credit health.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[500px] lg:h-[600px] w-full rounded-lg overflow-hidden shadow-xl"
          >
            <Image
              src="/images/angel-wide.jpg"
              alt="Angel statue symbolizing guidance and protection"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

        </div>

        {/* Mission / Vision / Values Section */}
        <div className="flex flex-col md:flex-row justify-around items-start mt-28 gap-8 md:gap-12">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 max-w-sm bg-[#F7F7F7] rounded-lg shadow-sm"
          >
             <div className="p-10 py-16 flex items-stretch group hover:cursor-pointer">
              {/* Golden line with hover expansion */}
              <div className="my-2 w-[4px] bg-yellow-600 transition-all duration-300 group-hover:w-[8px]" />
              
              {/* Text content shifting to the right on hover */}
              <div className="ml-4 transition-all duration-300 group-hover:ml-4">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 font-['PT_Serif'] text-[#0A142F]">
                  Mission
                </h2>
                <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                  To empower our clients with the tools and knowledge needed to achieve and
                  maintain a healthy credit score.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Vision (with extra margin-top to align) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 max-w-sm bg-[#F7F7F7] rounded-lg shadow-sm mt-12"
          >
            <div className="p-10 py-16 flex items-stretch group hover:cursor-pointer">
            <div className="my-2 w-[5px] bg-yellow-600 transition-all duration-300 group-hover:w-[8px]" />
              <div className="ml-4 transition-all duration-300 group-hover:ml-4">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 font-['PT_Serif'] text-[#0A142F]">
                  Vision
                </h2>
                <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                  To become the most trusted name in credit repair through innovation,
                  education, and exceptional service.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-1 max-w-sm bg-[#F7F7F7] rounded-lg shadow-sm"
          >
            <div className="p-10 py-16 flex items-stretch group hover:cursor-pointer">
            <div className="my-2 w-[5px] bg-yellow-600 transition-all duration-300 group-hover:w-[8px]" />
              <div className="ml-4 transition-all duration-300 group-hover:ml-4">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 font-['PT_Serif'] text-[#0A142F]">
                  Values
                </h2>
                <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                  Integrity, transparency, personalized service, and ethical practices
                  guide everything we do.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

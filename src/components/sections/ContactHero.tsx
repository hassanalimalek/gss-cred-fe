'use client';
import { CircleArrowRight } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export const ContactHero = () => {
  return (
    <section className=" py-16 sm:py-24">
      <div className="container mx-auto px-8 sm:px-12 lg:px-16">
        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="relative pl-6">
            {/* Golden line spanning the entire content */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-yellow-600" />
            
            {/* Small Subheading */}
            <span className="block text-sm uppercase tracking-wider text-gray-600 mb-2 pl-4">
              Keep In Touch
            </span>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#0A142F] font-['PT_Serif'] pl-4 mb-6">
              Contact Us
            </h1>

            {/* Paragraph */}
            <motion.p 
              className="text-white/90 mb-8 text-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              We're here to help you take the next step toward achieving and
              maintaining excellent credit. Our friendly team is ready to answer your questions.
            </motion.p>

            {/* Smaller Image at the bottom-left */}
            <div className="mt-8 pl-4 relative h-[300px] max-w-sm">
              <Image
                src="/images/contact-1.jpg"
                alt="Team high-fiving to celebrate success"
                fill
                className="rounded-lg shadow object-cover"
              />
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Large Image (Woman at desk) */}
            <div className="mb-12 relative h-[400px]">
              <Image
                src="/images/contact-2.jpg"
                alt="Professional woman at her desk"
                fill
                className="rounded-lg shadow object-cover"
              />
            </div>

            {/* Why Contact Us? */}
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A142F] mb-4 font-['PT_Serif']">
              Why Contact Us?
            </h2>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-700">
                <CircleArrowRight className="mr-2 w-5 h-5 text-gray-700" />
                Expert advice tailored to your financial needs
              </li>
              <li className="flex items-center text-gray-700">
                <CircleArrowRight className="mr-2 w-5 h-5 text-gray-700" />
                Transparent and direct solutions
              </li>
              <li className="flex items-center text-gray-700">
                <CircleArrowRight className="mr-2 w-5 h-5 text-gray-700" />
                A dedicated team committed to your success
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

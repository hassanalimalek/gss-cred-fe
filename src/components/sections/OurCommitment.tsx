'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

/**
 * OurCommitment section component with parallax scrolling effects
 * Features two floating images that move in opposite directions based on scroll position
 * @returns React component with parallax scroll animations
 */
export const OurCommitment = () => {
  const ref = useRef<HTMLElement>(null);

  // Track scroll position and viewport
  const { scrollY } = useScroll({
    // Only trigger scroll updates when the section is in view
    target: useRef<HTMLElement>(null),
    offset: ["start end", "end start"]
  });

  // Create a more pronounced parallax effect for each image
  // Using a larger scroll range (0 to 1000) for smoother movement
  // Left image: moves DOWN from 0px → +100px
  const leftImageY = useTransform(scrollY, [0, 700], [0, 100]);

  // Right image: moves UP from 0px → -100px
  const rightImageY = useTransform(scrollY, [0, 700], [0, -100]);

  return (
    <section ref={ref} className="relative min-h-[100vh] overflow-hidden py-20 bg-[#F9F9FB]">
      {/* Floating Images */}
      <motion.div
        style={{ y: leftImageY }} /* Moves down as you scroll */
        className="absolute top-0 left-20 w-[200px] sm:w-[250px] lg:w-[300px] z-0"
      >
        <img
          src="/images/commitment-1.jpg"
          alt="Team discussing credit strategies"
          className="w-full h-auto"
        />
      </motion.div>

      <motion.div
        style={{ y: rightImageY }} /* Moves up as you scroll */
        className="absolute bottom-0 right-20 w-[200px] sm:w-[250px] lg:w-[300px] z-0"
      >
        <img
          src="/images/commitment-2.jpg"
          alt="Client reviewing credit reports"
          className="w-full h-auto"
        />
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Double quotation mark above the heading */}
          <div className="text-8xl text-gray-400 mb-1">&quot;</div>

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0A142F] font-['PT_Serif'] mb-4">
            Our Commitment To You
          </h2>

          {/* Golden Line below the heading (height increased 2x) */}
          <div className="flex justify-center mb-6">
            <div className="h-24 w-[3px] bg-yellow-600" />
          </div>

          {/* First Paragraph */}
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            At Mulligan Credit Repair, we believe in a client-first approach. Our team of dedicated professionals works tirelessly to ensure that you receive the highest quality of service. We understand that each client’s financial situation is unique, and we tailor our credit repair strategies to meet your specific needs.
          </p>

          {/* Centralized Golden Line (height increased 2x) */}
          <div className="flex justify-center mb-6">
            <div className="h-24 w-[3px] bg-yellow-600" />
          </div>

          {/* Second Paragraph */}
          <p className="text-gray-600 text-lg leading-relaxed">
            We pride ourselves on our ethical practices and commitment to transparency. You will receive regular updates on your progress and have access to your account at all times. Our goal is to not only improve your credit score but also to educate you on maintaining a healthy credit profile long-term.
          </p>
        </div>
      </div>
    </section>
  );
};

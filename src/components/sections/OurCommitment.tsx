'use client';

import { useRef } from 'react';
import Image from 'next/image';

export const OurCommitment = () => {
  const ref = useRef<HTMLElement>(null);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden py-20 bg-[#F9F9FB]">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-1/2 h-full">
          <Image
            src="/images/commitment-1.jpg"
            alt="Professional credit repair service"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full">
          <Image
            src="/images/commitment-2.jpg"
            alt="Credit repair consultation"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      </div>

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative">
        <div className="grid grid-cols-1 gap-8 items-center">
          {/* Main Content */}
          <div className="relative z-20 max-w-3xl mx-auto">
            <div className="text-center bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg">
              {/* Double quotation mark above the heading */}
              <div className="text-7xl sm:text-8xl text-gray-400 mb-2">&quot;</div>

              {/* Main Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A142F] font-['PT_Serif'] mb-6">
                Our Commitment To You
              </h2>

              {/* Golden Line below the heading */}
              <div className="flex justify-center mb-8">
                <div className="h-16 w-[2px] bg-yellow-600" />
              </div>

              {/* First Paragraph */}
              <p className="text-gray-600 text-lg sm:text-xl leading-relaxed mb-8 px-4 sm:px-6">
                At Mulligan Credit Repair, we believe in a client-first approach. Our team of dedicated professionals works tirelessly to ensure that you receive the highest quality of service. We understand that each client's financial situation is unique, and we tailor our credit repair strategies to meet your specific needs.
              </p>

              {/* Centralized Golden Line */}
              <div className="flex justify-center mb-8">
                <div className="h-16 w-[2px] bg-yellow-600" />
              </div>

              {/* Second Paragraph */}
              <p className="text-gray-600 text-lg sm:text-xl leading-relaxed px-4 sm:px-6">
                We pride ourselves on our ethical practices and commitment to transparency. You will receive regular updates on your progress and have access to your account at all times. Our goal is to not only improve your credit score but also to educate you on maintaining a healthy credit profile long-term.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

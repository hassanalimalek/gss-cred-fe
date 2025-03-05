"use client";

import { testimonials } from '@/data/testimonials';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fadeIn } from '@/utils/animations';
import Link from 'next/link';

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#0A142F] mb-6 font-['PT_Serif']">
            Client Success Stories
          </h1>
          <p className="text-lg sm:text-xl text-[#525A6D] max-w-3xl mx-auto">
            Discover how we&apos;ve helped our clients improve their credit scores and achieve financial freedom.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                {...fadeIn("up", index * 0.1)}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col h-full"
              >
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4 relative flex-shrink-0">
                      <Image
                        src={testimonial.image}
                        alt={`${testimonial.name}&apos;s profile picture`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-[#0A142F] font-['PT_Serif']">
                      {testimonial.name}
                    </h3>
                  </div>
                  <div className="mt-2 flex-grow">
                    <p className="text-[#525A6D] leading-relaxed">
                      &quot;{testimonial.text}&quot;
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0A142F] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 font-['PT_Serif']">
            Ready to Start Your Credit Repair Journey?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join our satisfied clients and take the first step toward financial freedom today.
          </p>
          <Link
            href="/#onboarding"
            className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </main>
  );
}
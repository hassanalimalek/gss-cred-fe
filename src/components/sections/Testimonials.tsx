"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeIn } from "@/utils/animations";
import Image from "next/image";
import { testimonials } from "@/data/testimonials";

export interface Testimonial {
  image: string;
  name: string;
  text: string;
}

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const indexRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const newIndex = indexRef.current === testimonials.length - 1 ? 0 : indexRef.current + 1;
      indexRef.current = newIndex;
      setCurrentIndex(newIndex);
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          {...fadeIn("up", 0)}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-[#0A142F] mb-4 font-['PT_Serif']">
            What Our Clients Say
          </h2>
        </motion.div>

        <div className="max-w-6xl mx-auto relative ">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 bg-white rounded-xl p-8 shadow-sm"
            >
              <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 flex-shrink-0 overflow-hidden rounded-lg shadow-lg relative">
                <Image
                  src={testimonials[currentIndex].image}
                  alt={`${testimonials[currentIndex].name}'s testimonial`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center md:py-4">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0A142F] mb-4 font-['PT_Serif'] text-center md:text-left">
                  {testimonials[currentIndex].name}
                </h3>
                <p className="text-base sm:text-lg md:text-xl text-[#525A6D] max-w-2xl leading-relaxed text-center md:text-left">
                  {testimonials[currentIndex].text}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-8 space-x-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${index === currentIndex ? 'bg-yellow-600' : 'bg-gray-500'} min-h-[24px] min-w-[24px] flex items-center justify-center p-2`}
                aria-label={`Go to testimonial ${index + 1}`}
                style={{ touchAction: 'manipulation' }}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center mt-12"
        >
          <a
            href="/testimonials"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 transition-all rounded-md"
            role="button"
          >
            View All Testimonials
          </a>
        </motion.div>
      </div>
    </section>
  );
};
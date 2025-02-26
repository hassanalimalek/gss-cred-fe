"use client";
import { motion } from "framer-motion";
import Image from "next/image";

/**
 * Animation utility for fade-in effect
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

/**
 * Contact section component with animated form and image
 */
export const ContactSection = () => {
  return (
    <section className=" lg:py-0 bg-white">
      <div className="">
        <div className="flex flex-col lg:flex-row">
          {/* Animated image section */}
          <motion.div 
            {...fadeIn("up", 0)} 
            className="w-full lg:w-[40%] h-full lg:h-[700px] relative overflow-hidden"
          >
            <Image
              src="/images/generic-building.jpg"
              alt="Modern office building"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Animated contact form section */}
          <motion.div 
            {...fadeIn("up", 0.2)} 
            className="w-full lg:w-[60%] px-4 sm:px-12 lg:px-24 py-16 lg:py-24 bg-white"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0A173B] mb-6 font-['PT_Serif']">
              Ask Us Anything, Anytime.
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Collect visitor's submissions and store them directly in your Elementor account, or integrate your favorite marketing & CRM tools.
            </p>

            {/* Contact form with responsive grid layout */}
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <input
                    type="tel"
                    placeholder="Phone"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Subject"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <textarea
                  placeholder="Tell Us More"
                  rows={4}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-md transition-colors duration-300"
              >
                Send →
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
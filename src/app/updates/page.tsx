"use client";
import { motion } from "framer-motion";
import { blogPosts } from "@/data/blogs";
import { BlogCard } from "@/components/common/BlogCard";
import { ContactSection } from "@/components/sections/ContactSection";

/**
 * Animation utility for fade-in effect with customizable direction and delay
 * @param direction - The direction to fade in from ("up" or "down")
 * @param delay - The delay before starting the animation in seconds
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
 * BlogPage component that displays a grid of blog posts with animation effects
 * Includes a contact section at the bottom
 */
export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="w-[95%] sm:w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Animated header section */}
          <motion.div {...fadeIn("up", 0)} className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0A173B] mb-4 font-['PT_Serif']">
              Our Blogs
            </h1>
          </motion.div>

          {/* Responsive grid layout for blog posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <BlogCard key={post.id} {...post} index={index} />
            ))}
          </div>
         
        </div>
      </section>
      <ContactSection />
    </main>
  );
}
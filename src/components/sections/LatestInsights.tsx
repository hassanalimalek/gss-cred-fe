"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BlogCard } from "@/components/common/BlogCard";
import { fadeIn } from "@/utils/animations";
import { useBlogs } from "@/hooks/useBlogs";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export const LatestInsights = React.memo(() => {
  // Use useState and useEffect to ensure consistent rendering between server and client
  const [isMounted, setIsMounted] = useState(false);
  const { blogs, isLoading, isError } = useBlogs();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Return null during server-side rendering to prevent hydration mismatch
  if (!isMounted) {
    return (
      <section className="py-16 sm:py-24 lg:py-32 bg-gray-50">
        <div className="w-[95%] sm:w-[90%] mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <LoadingSpinner size="lg" color="yellow" />
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="py-16 sm:py-24 lg:py-32 bg-gray-50">
        <div className="w-[95%] sm:w-[90%] mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <LoadingSpinner size="lg" color="yellow" />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-16 sm:py-24 lg:py-32 bg-gray-50">
        <div className="w-[95%] sm:w-[90%] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-500">Failed to load blog posts. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-gray-50">
      <div className="w-[95%] sm:w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...fadeIn("up", 0)} className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#0A173B] mb-4 font-['PT_Serif']">
            Latest Insights
          </h2>
          <p className="text-lg text-gray-600 font-montserrat">
            Stay informed with our latest articles and expert advice
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post, index) => (
            <BlogCard key={post.id} {...post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
});

LatestInsights.displayName = 'LatestInsights';
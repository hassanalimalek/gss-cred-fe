"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { fadeIn } from "@/utils/animations";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  slug: string;
  index?: number;
}

export const BlogCard = React.memo(({ id, title, excerpt, date, category, image, slug, index = 0 }: BlogCardProps) => {
  return (
    <motion.article
      key={id}
      {...fadeIn("up", 0.1 * index)}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <a href={`/blog/${slug}`} className="block">
        <div className="relative h-72 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300 will-change-transform"
            quality={85}
            priority={index < 3}
          />
          <div className="absolute top-4 left-4">
            <span className="bg-yellow-600 text-white text-xs font-semibold px-3 py-1 rounded">
              {category}
            </span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-[#0A173B] mb-2 font-['PT_Serif'] line-clamp-2">
            {title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3 font-montserrat">
            {excerpt}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-montserrat">
              {date}
            </span>
            <span className="text-yellow-600 font-semibold hover:text-yellow-700 transition-colors duration-200 font-montserrat">
              Read More →
            </span>
          </div>
        </div>
      </a>
    </motion.article>
  );
});

BlogCard.displayName = 'BlogCard';
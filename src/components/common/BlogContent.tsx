"use client";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { ContactSection } from "@/components/sections/ContactSection";

interface BlogContentProps {
  post: {
    category: string;
    date: string;
    title: string;
    image: string;
    content: string;
  };
}

export const BlogContent = ({ post }: BlogContentProps) => {
  return (
    <motion.main 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <article className="py-16 sm:py-24 lg:py-32">
        <div className="w-[95%] sm:w-[90%] max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-yellow-600 text-white text-sm font-semibold px-3 py-1 rounded">
                {post.category}
              </span>
              <span className="text-gray-500 font-montserrat">{post.date}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0A173B] mb-6 font-['PT_Serif']">
              {post.title}
            </h1>
          </motion.div>

          <motion.div 
            className="relative h-[400px] sm:h-[500px] mb-12 rounded-xl overflow-hidden"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 1200px) 90vw, 1000px"
              className="object-cover"
              quality={90}
              priority
            />
          </motion.div>

          <motion.div 
            className="prose prose-lg max-w-none font-montserrat text-gray-700 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({children}) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
                h2: ({children}) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
                h3: ({children}) => <h3 className="text-xl font-bold mt-5 mb-2">{children}</h3>,
                p: ({children}) => <p className="mb-4">{children}</p>,
                ul: ({children}) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
                li: ({children}) => <li className="mb-2">{children}</li>,
                blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>,
                code: ({children}) => <code className="bg-gray-100 rounded px-2 py-1">{children}</code>,
              }}
            >
              {post.content}
            </ReactMarkdown>
          </motion.div>
        </div>
      </article>
      <ContactSection />
    </motion.main>
  );
};
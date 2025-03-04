"use client";
import useSWR from 'swr';
import { blogPosts } from '@/data/blogs';
import { useEffect, useState } from 'react';

// Define the Blog interface
export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  slug: string;
  content: string;
}

// Fetcher function for when we implement the API route
const fetcher = (url: string) => fetch(url).then((res) => res.json());

/**
 * Custom hook for fetching blog posts
 * Currently uses static data, but can be easily switched to API
 * @param useStatic - Whether to use static data or fetch from API
 * @returns Blog data, loading state, and error state
 */
export function useBlogs(useStatic: boolean = true) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data, error, isLoading } = useSWR<Blog[]>(
    useStatic ? null : '/api/blogs',
    fetcher
  );

  // During server-side rendering, return a consistent initial state
  if (!isClient) {
    return {
      blogs: [],
      isLoading: true,
      isError: false
    };
  }

  if (useStatic) {
    return {
      blogs: blogPosts,
      isLoading: false,
      isError: false
    };
  }
  
  return {
    blogs: data || [],
    isLoading,
    isError: error
  };
}

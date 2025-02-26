"use client";
import useSWR from 'swr';
import { blogPosts } from '@/data/blogs';

// Define the Blog interface
export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
  slug: string;
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
  // If using static data, return immediately without network request
  if (useStatic) {
    return {
      blogs: blogPosts,
      isLoading: false,
      isError: false
    };
  }
  
  // Otherwise use SWR to fetch from API
  const { data, error, isLoading } = useSWR<Blog[]>('/api/blogs', fetcher);
  
  return {
    blogs: data || [],
    isLoading,
    isError: !!error
  };
}

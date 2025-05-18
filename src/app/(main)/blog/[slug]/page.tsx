import { blogPosts } from "@/data/blogs";
import { notFound } from "next/navigation";
import { BlogContent } from "@/components/common/BlogContent";
import { Metadata } from "next";

// Using any to bypass the PageProps constraint
interface BlogDetailPageProps {
  params: any;
  searchParams: any;
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = blogPosts.find(
    (post) => post.slug === params.slug || post.id === params.slug
  );

  if (!post) {
    notFound();
  }

  return <BlogContent post={post} />;
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const post = blogPosts.find(
    (post) => post.slug === params.slug || post.id === params.slug
  );

  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.'
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }]
    }
  };
}
import { blogPosts } from "@/data/blogs";
import { notFound } from "next/navigation";
import { BlogContent } from "@/components/common/BlogContent";

interface BlogDetailPageProps {
  params: {
    slug: string;
  };
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
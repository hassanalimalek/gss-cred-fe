export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  slug: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "How To Rebuild Your Credit Score After Bankruptcy In 2025",
    excerpt: "Understanding the 7-10 Year Impact a| The Real Truth About Bankruptcy's Timeline Filing for bankruptcy feels like hitting the reset button on your financial",
    category: "CREDIT BUILDING",
    date: "Feb 8, 2025",
    image: "/images/magnifying-papers.webp",
    slug: "rebuild-credit-after-bankruptcy"
  },
  {
    id: "2",
    title: "5 Essential Steps to Improve Your Credit Score in 2025",
    excerpt: "Discover proven strategies and expert tips to boost your credit score effectively. Learn about credit utilization, payment history, and more.",
    category: "CREDIT TIPS",
    date: "Jan 15, 2025",
    image: "/images/improve-credit-score.webp",
    slug: "improve-credit-score-steps"
  },

];
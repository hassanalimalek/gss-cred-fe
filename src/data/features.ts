import { ReactNode } from 'react';

export interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
}

export const featureCards = [
  {
    title: "Proven Track Record",
    description:
      "Our expert team has helped thousands of individuals improve their credit scores, opening doors to better interest rates, loan approvals, and financial freedom.",
    imagePath: "/images/handshake.webp",
    imageAlt: "Handshake representing our proven track record"
  },
  {
    title: "Personalized Plans",
    description:
      "We don't believe in one-size-fits-all solutions. Our credit repair strategies are tailored to your unique financial situation.",
    imagePath: "/images/angel-small.webp",
    imageAlt: "Angel statue representing personalized guidance"
  },
  {
    title: "Comprehensive Services",
    description:
      "From disputing inaccuracies to negotiating with creditors, we handle all aspects of credit repair.",
    imagePath: "/images/wall-outdoor.jpg",
    imageAlt: "Architectural columns representing comprehensive services"
  },
  {
    title: "Transparent Process",
    description:
      "We believe in full transparency. You'll receive regular updates and access to your progress.",
    imagePath: "/images/tech.webp",
    imageAlt: "Technology interface representing transparent process"
  },
];
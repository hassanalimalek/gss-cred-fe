"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { featureCards } from "@/data/features";

/**
 * Base feature data structure
 */
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

/**
 * Props for FeatureCard component, extends Feature with animation delay
 */
interface FeatureCardProps extends Feature {
  delay: number;
}

/**
 * Props for feature images
 */
interface ImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Reusable image component for feature cards
 */
const FeatureImage = ({ src, alt, className }: ImageProps) => (
  <div className="relative w-full h-[200px]">
    <Image
      src={src}
      alt={alt}
      fill
      className={`object-cover ${className || ''}`}
    />
  </div>
);

/**
 * Individual feature card component with animation
 */
/**
 * Individual feature card component with animation and accessibility attributes
 */
const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => {
  return (
    <motion.article
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay }}
      className="w-full sm:w-1/2 lg:w-1/4 px-4 mb-8"
    >
      <div 
        className="flex flex-col items-center h-full bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group p-4"
        role="group"
        aria-labelledby={`feature-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="w-full mb-8 transform transition-transform duration-300 group-hover:-translate-y-2">
          {icon}
        </div>
        <h3 
          id={`feature-${title.toLowerCase().replace(/\s+/g, '-')}`}
          className="mt-4 text-2xl font-bold text-[#0A142F] text-center font-['PT_Serif']"
        >
          {title}
        </h3>
        <p className="p-2 mt-6 text-base sm:text-lg leading-relaxed text-[#525A6D] text-center min-h-[96px]">
          {description}
        </p>
      </div>
    </motion.article>
  );
};

/**
 * Features section component displaying company's key services
 * with animated cards and responsive layout
 */
/**
 * Features section component displaying company's key services
 * with animated cards and responsive layout
 */
export const Features = () => {
  const features: Feature[] = featureCards.map(card => ({
    icon: <FeatureImage 
      src={card.imagePath} 
      alt={card.imageAlt} 
      className="w-full h-[200px] sm:h-[250px] md:h-[280px] lg:h-[320px] object-cover rounded-md" 
    />,
    title: card.title,
    description: card.description,
  }));

  return (
    <section
      className="py-20 sm:py-28 bg-[#F9F9FB]"
      aria-labelledby="features-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 w-full sm:w-[95%] md:w-[90%] lg:w-[85%]">
        {/* Animated section header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="block text-sm uppercase tracking-wider text-gray-600 mb-2">
            Our Services
          </span>
          <h2
            id="features-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0A142F] font-['PT_Serif'] px-4 max-w-3xl mx-auto"
          >
            Why Choose Mulligan Credit Repair?
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We offer comprehensive credit repair solutions tailored to your unique situation.
          </p>
        </motion.div>

        {/* Feature cards grid with staggered animation */}
        <div className="flex flex-wrap -mx-4 justify-center" role="list" aria-label="Our key features">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              delay={0.2 * (index + 1)}
            />
          ))}
        </div>

        {/* Animated CTA button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center mt-12"
        >
          <a
            href="#onboarding"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 transition-all rounded-md"
            role="button"
            aria-label="Get started with our credit repair services"
          >
            Get Started Today
          </a>
        </motion.div>
      </div>
    </section>
  );
};
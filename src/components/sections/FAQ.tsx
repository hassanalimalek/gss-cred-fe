"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Props for individual FAQ item component
 */
interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
  itemId: string;
}

/**
 * Animation utility for fade-in effect
 */
const fadeIn = (direction: "up" | "down" = "up", delay: number = 0) => ({
  initial: { y: direction === "up" ? 40 : -40, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: {
    duration: 0.8,
    ease: [0.43, 0.13, 0.23, 0.96],
    delay,
  },
});

/**
 * Chevron icon component that rotates based on item state
 */
const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`w-6 h-6 text-black transform transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

/**
 * Individual FAQ item component with animation
 */
const FAQItem = ({ question, answer, isOpen, onClick, itemId }: FAQItemProps) => (
  <div className="mb-4 overflow-hidden bg-[#F9F9FB] rounded-lg border border-gray-200">
    <button
      onClick={onClick}
      className="flex justify-between w-full px-6 py-4 text-left transition-colors hover:bg-gray-50 min-h-[44px]"
      style={{ touchAction: 'manipulation' }}
      aria-expanded={isOpen}
      aria-controls={`faq-${itemId}`}
    >
      <span className="text-lg sm:text-xl md:text-2xl font-medium text-sky-950 font-['PT_Serif'] pr-4">{question}</span>
      <ChevronIcon isOpen={isOpen} />
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id={`faq-${itemId}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
          role="region"
          aria-labelledby={`faq-question-${itemId}`}
        >
          <div className="text-base sm:text-lg md:text-xl px-6 pb-4 text-neutral-600 leading-relaxed">{answer}</div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

/**
 * Data structure for FAQ items
 */
interface FAQData {
  question: string;
  answer: string;
}

/**
 * FAQ section component with accordion functionality
 * and animated transitions
 */
export const FAQ = () => {
  // Track which FAQ item is currently open
  const [openItem, setOpenItem] = useState<string | null>(null);

  // FAQ content data
  const faqs: FAQData[] = [
    {
      question: "How Does The Credit Repair Process Work?",
      answer: "Review the Disclosure Documents, the process is covered in the consulation."
    },
    {
      question: "How Long Does It Take To See Results?",
      answer: "Depends on how many NEGATIVE items are on your report, typical 60 days or less"
    },
    {
      question: "What Information Do I Need To Provide?",
      answer: "Everything on the signup form + what is requested during the consultation."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-[#F9F9FB]">
      <div className="container px-5 mx-auto">
        <motion.div 
          {...fadeIn("up", 0)}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-sky-950 sm:text-5xl font-['PT_Serif']">
            Frequently Asked Questions
          </h2>
          <p className="mx-auto text-base sm:text-lg leading-relaxed text-sky-800 lg:w-3/4 xl:w-2/3 px-4">
            Find answers to common questions about our credit repair services
          </p>
        </motion.div>

        <motion.div 
          {...fadeIn("up", 0.2)}
          className="max-w-3xl mx-auto"
          role="list"
          aria-label="Frequently Asked Questions"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              itemId={`${index}`}
              question={faq.question}
              answer={faq.answer}
              isOpen={openItem === `${index}`}
              onClick={() => setOpenItem(openItem === `${index}` ? null : `${index}`)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

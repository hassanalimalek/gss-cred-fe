'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

interface StepProps {
  number: number;
  title: string;
  description: string;
  delay: number;
}

const Step = ({ number, title, description, delay }: StepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay }}
      className="flex flex-col md:flex-row gap-6 md:gap-10 mb-16 last:mb-0"
    >
      {/* Step number and connecting line */}
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-yellow-600 text-white text-xl font-bold">
          {number}
        </div>
        {number < 6 && (
          <div className="w-1 flex-grow bg-gray-200 h-full max-h-[100px] md:max-h-[80px] mt-4"></div>
        )}
      </div>

      {/* Step content */}
      <div className="flex-1 pt-2">
        <h3 className="text-2xl md:text-3xl font-bold text-[#0A142F] mb-4 font-['PT_Serif']">
          {title}
        </h3>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          {description}
        </p>
        <div className="flex items-center text-green-600">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span className="font-medium">Included in our service</span>
        </div>
      </div>
    </motion.div>
  );
};

export const ProcessSteps = () => {
  const steps = [
    {
      number: 1,
      title: "Fill Out Your Information & Make Payment",
      description: "Begin your credit repair journey by providing your details through our secure online form. Once submitted, complete the payment process to kickstart your path to better credit.",
      delay: 0.2
    },
    {
      number: 2,
      title: "Onboarding Call",
      description: "Our expert team will schedule a personalized onboarding call to understand your unique credit situation, discuss your financial goals, and outline the strategic steps we'll take to improve your credit profile.",
      delay: 0.3
    },
    {
      number: 3,
      title: "Status Updates & Progress Tracking",
      description: "Stay informed with regular updates on disputes, deletions, and improvements to your credit profile. Our transparent process ensures you're aware of every positive change happening with your credit score.",
      delay: 0.4
    },
    {
      number: 4,
      title: "Completion of Credit Repair",
      description: "Once all disputes have been processed and your credit profile has been optimized to its fullest potential, we'll confirm the successful completion of your personalized credit restoration plan.",
      delay: 0.5
    },
    {
      number: 5,
      title: "Close-Out Documentation",
      description: "Receive comprehensive documentation summarizing all improvements, items removed or updated on your credit profile, along with expert guidance on best practices to maintain and continue building your credit score.",
      delay: 0.6
    },
    {
      number: 6,
      title: "Enjoy Your New Credit Life",
      description: "With your significantly improved credit score, unlock new financial opportunities including better interest rates, loan approvals, and the confidence to pursue your financial goals with strength and stability.",
      delay: 0.7
    }
  ];

  return (
    <section 
      id="process-steps" 
      className="py-20 sm:py-28 bg-gray-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-yellow-600 font-medium mb-2 block">STEP BY STEP</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0A142F] mb-6 font-['PT_Serif']">
            Our Credit Repair Process
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            We&apos;ve simplified the credit repair process to make it easy for you to understand and follow. 
            Here&apos;s how we&apos;ll work together to improve your credit score.
          </p>
        </motion.div>

        <div className="mt-16">
          {steps.map((step) => (
            <Step
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
              delay={step.delay}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <Link
            href="/#onboarding"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 transition-all rounded-md"
            role="button"
          >
            Start Your Credit Repair Today
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
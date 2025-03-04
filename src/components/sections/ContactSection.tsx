"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { submitVisitorRequest, VisitorSubmission } from "@/lib/api";
import { showSuccessToast, showErrorToast } from "@/utils/toast";

/**
 * Animation utility for fade-in effect
 * @param direction - The direction to fade in from ("up" or "down")
 * @param delay - The delay before starting the animation (in seconds)
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
 * Contact section component with animated form and image
 */
export const ContactSection = () => {
  // State for form data
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    subject: "",
    description: ""
  });
  
  // State for form submission status
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.fullName || !formData.email || !formData.description) {
      showErrorToast("Please fill in all required fields.");
      return;
    }
    
    // Update status to loading
    setStatus("loading");
    
    try {
      // Prepare submission data
      const submissionData: VisitorSubmission = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        subject: formData.subject || "Contact Form Submission",
        description: formData.description
      };
      
      // Submit the data to the API
      await submitVisitorRequest(submissionData);
      
      // Update status and show success message
      setStatus("success");
      showSuccessToast("Your message has been sent successfully! We'll get back to you soon.");
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        subject: "",
        description: ""
      });
      
    } catch (error) {
      // Handle error
      setStatus("error");
      showErrorToast("Failed to send your message. Please try again later.");
      console.error("Contact form submission error:", error);
    } finally {
      // Reset status after delay
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <section className=" lg:py-0 bg-white">
      <div className="">
        <div className="flex flex-col lg:flex-row">
          {/* Animated image section */}
          <motion.div 
            {...fadeIn("up", 0)} 
            className="w-full lg:w-[40%] h-full lg:h-[700px] relative overflow-hidden"
          >
            <Image
              src="/images/generic-building.jpg"
              alt="Modern office building"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Animated contact form section */}
          <motion.div 
            {...fadeIn("up", 0.2)} 
            className="w-full lg:w-[60%] px-4 sm:px-12 lg:px-24 py-16 lg:py-24 bg-white"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0A173B] mb-6 font-[&apos;PT_Serif&apos;]">
              Ask Us Anything, Anytime.
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Collect visitor&apos;s submissions and store them directly in your Elementor account, or integrate your favorite marketing & CRM tools.
            </p>

            {/* Contact form with responsive grid layout */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-gray-900"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-gray-900"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>

              <div>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell Us More"
                  rows={4}
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:border-transparent resize-none text-gray-900"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className={`w-full sm:w-auto px-8 py-4 ${
                  status === "loading" ? "bg-gray-400" : "bg-yellow-600 hover:bg-yellow-700"
                } text-white font-medium rounded-md transition-colors duration-300 flex items-center justify-center`}
              >
                {status === "loading" ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send →"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
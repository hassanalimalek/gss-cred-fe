'use client';
import { Mail, Phone } from 'lucide-react';
import { useState } from 'react';
import { submitVisitorRequest, VisitorSubmission } from '@/lib/api';
import { showSuccessToast, showErrorToast } from '@/utils/toast';

export const ContactSectionSimple = () => {
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
    
    // Ensure status is reset to idle if something goes wrong
    // This is a safety measure in case the finally block doesn't execute properly
    setTimeout(() => {
      if (status === "loading") {
        setStatus("idle");
      }
    }, 5000);
  };

  return (
    <section className="bg-[#F9F9FB] py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left Column */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A142F] mb-6">
              Ask Us Anything, Anytime.
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Have a question or need support? Don&apos;t hesitate to reach out! Whether
              it&apos;s about our services, your credit journey, or any concerns you may have,
              we&apos;re always ready to assist you. Feel free to contact us anytime, and our
              team will be happy to provide the answers and support you need.
            </p>

            {/* Contact Info */}
            <div className="flex space-x-12">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-yellow-600" />
                <div>
                  <h3 className="font-bold text-gray-700 mb-1">Email</h3>
                  <p className="text-gray-600">credit@xignite.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-yellow-600" />
                <div>
                  <h3 className="font-bold text-gray-700 mb-1">Phone</h3>
                  <p className="text-gray-600">1-224-444-9857</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Name + Email in two columns on larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-yellow-600 text-black"
                  required
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-yellow-600 text-black"
                />
              </div>

              {/* Email field - Added */}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-yellow-600 text-black"
                required
              />

              {/* Subject */}
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-yellow-600 text-black"
              />

              {/* Message / More Details */}
              <textarea
                rows={5}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell Us More"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-yellow-600 text-black"
                required
              />

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === "loading"}
                className={`${
                  status === "loading" ? "bg-gray-400" : "bg-yellow-600 hover:bg-yellow-700"
                } text-white font-bold px-8 py-3 rounded transition-colors flex items-center justify-center`}
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
                  "Send"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

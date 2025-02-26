'use client';
import { Mail, Phone } from 'lucide-react';

export const ContactSectionSimple = () => {
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
            <form className="space-y-4">
              {/* Name + Phone in two columns on larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-yellow-600"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-yellow-600"
                />
              </div>

              {/* Subject */}
              <input
                type="text"
                placeholder="Subject"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-yellow-600"
              />

              {/* Message / More Details */}
              <textarea
                rows={5}
                placeholder="Tell Us More"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-yellow-600"
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-yellow-600 text-white font-bold px-8 py-3 rounded hover:bg-yellow-700 transition-colors"
              >
                Send...
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import { PaymentInputsContainer } from "react-payment-inputs";
import { usePaymentInputs } from "react-payment-inputs";
import images from "react-payment-inputs/images";

// Extend Window interface to include Accept.js
declare global {
  interface Window {
    Accept?: {
      dispatchData: (
        data: any,
        callback: (response: any) => void
      ) => void;
    };
  }
}

interface CreditCardPreviewProps {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

// Credit Card component to display the card UI
const CreditCardPreview: React.FC<CreditCardPreviewProps> = ({ cardNumber, expiryDate, cvc }) => {
  // 0.5) Don't hide the card number, just format with spacing (no masking).
  const formatDisplayCardNumber = () => {
    if (!cardNumber) return "•••• •••• •••• ••••";
    // Pad up to 16 for a consistent look, then space every 4 digits
    const formatted = cardNumber
      .padEnd(16, "•")
      .replace(/(.{4})/g, "$1 ")
      .trim();
    return formatted;
  };

  // Determine card type based on first digits
  const getCardType = () => {
    if (cardNumber.startsWith("4")) return "visa";
    if (cardNumber.startsWith("5")) return "mastercard";
    if (cardNumber.startsWith("3")) return "amex";
    if (cardNumber.startsWith("6")) return "discover";
    return "default";
  };

  const cardType = getCardType();

  return (
    // 4) Changed dimensions so it appears more like a real credit card shape
    <div className="relative w-[410px] h-[220px] rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white shadow-lg overflow-hidden">
      {/* 0.5) Move the card type (brand logo) to the TOP RIGHT */}
      <div className="absolute top-6 right-6">
        {cardType === "visa" && (
          <span className="text-xl font-bold italic">VISA</span>
        )}
        {cardType === "mastercard" && (
          <div className="flex">
            <div className="w-8 h-8 bg-red-500 rounded-full opacity-80 -mr-4"></div>
            <div className="w-8 h-8 bg-yellow-500 rounded-full opacity-80"></div>
          </div>
        )}
        {cardType === "amex" && <span className="text-xl font-bold">AMEX</span>}
        {cardType === "discover" && (
          <span className="text-xl font-bold">DISCOVER</span>
        )}
      </div>

      {/* Card chip */}
      <div className="w-12 h-10 bg-yellow-300 rounded-md mb-6 flex items-center justify-center">
        <div className="w-10 h-8 border-2 border-yellow-600 rounded-md"></div>
      </div>

      {/* Full card number (no middle digits hidden) */}
      <div className="text-2xl mb-6 font-mono tracking-wider">
        {formatDisplayCardNumber()}
      </div>

      {/* 0.5) In place of card holder name, show expiry date; in place of expires, show CVV */}
      <div className="flex justify-between items-center">
        {/* Left side => Expires */}
        <div>
          <div className="text-xs uppercase text-gray-200 mb-1">Expires</div>
          <div className="font-medium">{expiryDate || "MM/YY"}</div>
        </div>
        {/* Right side => CVV */}
        <div>
          <div className="text-xs uppercase text-gray-200 mb-1">CVV</div>
          <div className="font-medium">{cvc || "***"}</div>
        </div>
      </div>

      {/* Subtle security pattern */}
      <div className="absolute inset-0 bg-white opacity-5">
        <div className="w-full h-full bg-grid-slate-200/10"></div>
      </div>
    </div>
  );
};

// Rest of your component code
interface FormData {
  name: string;
  email: string;
  phone: string;
  ssn: string;
  referralCode: string;
  package: string;
  utilityBill: FileList | null;
  driverLicense: FileList | null;
  amount: string;
  [key: string]: string | FileList | null; // Index signature for dynamic access
}

interface FormErrors {
  [key: string]: string;
}

interface PaymentData {
  dataValue: string;
  dataDescriptor: string;
}

const ContactPaymentForm = () => {
  // Replace with your real Authorize.Net keys
  const PUBLIC_CLIENT_KEY = "YOUR_PUBLIC_CLIENT_KEY";
  const API_LOGIN_ID = "YOUR_API_LOGIN_ID";

  const packageOptions = [
    { value: "tier1", label: "Tier 1", price: 1499 },
    { value: "tier2", label: "Tier 2", price: 2499 },
    { value: "tier3", label: "Tier 3", price: 3499 },
  ];

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    ssn: "",
    referralCode: "",
    package: "",
    utilityBill: null,
    driverLicense: null,
    amount: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isAcceptReady, setIsAcceptReady] = useState(false);

  // Payment card state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");

  // Use react-payment-inputs for card input validation
  const { meta, getCardNumberProps, getExpiryDateProps, getCVCProps } =
    usePaymentInputs();

  // Load Authorize.Net Accept.js
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.authorize.net/v3/Accept.js";
    script.async = true;
    script.onload = () => setIsAcceptReady(true);
    script.onerror = () => {
      console.error("Failed to load Accept.js");
      script.setAttribute("data-error", "true");
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: fileInput.files,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileSelect = (fieldName: string) => (files: FileList | null) => {
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [fieldName]: files }));
    }
  };

  // Validate
  const validateForm = () => {
    const newErrors: FormErrors = {};
    const { name, email, phone, ssn, package: pkg, amount } = formData;

    if (!name) newErrors.name = "Name is required";
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Valid email is required";
    }
    if (!phone || !/^\d{10}$/.test(phone.replace(/\D/g, ""))) {
      newErrors.phone = "Valid phone number is required";
    }
    if (!ssn || !/^\d{9}$/.test(ssn.replace(/\D/g, ""))) {
      newErrors.ssn = "Valid SSN is required";
    }
    if (!pkg) newErrors.package = "Please select a package";

    // If you need to require an amount:
    if (!amount || Number(amount) <= 0) {
      newErrors.amount = "A valid payment amount is required";
    }

    // Card validation
    if (!cardNumber || meta.error) {
      newErrors.cardNumber = "Valid card number is required";
    }
    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
      newErrors.expiryDate = "Valid expiry date required (MM/YY)";
    }
    if (!cvc || !/^\d{3,4}$/.test(cvc)) {
      newErrors.cvc = "Valid CVC required";
    }

    // If meta.error exists, add it
    if (meta.error) newErrors.metaError = meta.error;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit => Tokenize => Send to backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAcceptReady || status === "loading") return;

    const validationErrors = validateForm();
    if (!validationErrors) {
      setErrors({});
      setMessage("Tokenizing payment data...");

      const [month, year] = expiryDate.split("/");
      if (!month || !year) {
        setStatus("error");
        setMessage("Invalid expiry date format.");
        return;
      }

      // Create secureData for Accept.js
      const secureData = {
        authData: {
          clientKey: PUBLIC_CLIENT_KEY,
          apiLoginID: API_LOGIN_ID,
        },
        cardData: {
          cardNumber: cardNumber.replace(/\s/g, ""),
          month: month.trim(),
          year: `20${year.trim()}`, // e.g. "24" => "2024"
          cardCode: cvc,
        },
      };

      try {
        const acceptResponse: any = await new Promise((resolve, reject) => {
          if (!window.Accept?.dispatchData) {
            return reject(new Error("Accept.js is not ready"));
          }
          window.Accept.dispatchData(secureData, (response: any) => {
            if (response.messages.resultCode === "Error") {
              reject(new Error(response.messages.message[0].text));
            } else {
              resolve(response);
            }
          });
        });

        // Send token + form data to your backend
        const backendRes = await fetch("/api/process-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dataValue: acceptResponse.opaqueData.dataValue,
            dataDescriptor: acceptResponse.opaqueData.dataDescriptor,
            amount: Number(formData.amount).toFixed(2),
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            ssn: formData.ssn,
            package: formData.package,
            referralCode: formData.referralCode,
          }),
        });

        if (!backendRes.ok) {
          const errData = await backendRes.json();
          throw new Error(errData.error || "Payment failed");
        }

        const result = await backendRes.json();
        setStatus("success");
        setMessage(`Payment successful! Transaction ID: ${result.transactionId}`);

        // Reset form if desired
        setFormData({
          name: "",
          email: "",
          phone: "",
          ssn: "",
          referralCode: "",
          package: "",
          utilityBill: null,
          driverLicense: null,
          amount: "",
        });
        setCardNumber("");
        setExpiryDate("");
        setCvc("");
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Payment processing failed");
      } finally {
        setTimeout(() => setStatus("idle"), 5000);
      }
    } else {
      setErrors(validationErrors);
      setStatus("error");
      setMessage("Please correct the errors above.");
    }
  };

  // Helper: Render a drag-and-drop area or the selected file with remove button
  const renderFileUpload = (fieldName: string, label: string, required: boolean = false) => {
    const fileData = formData[fieldName];
    const isFileSelected = fileData && fileData.length > 0;
    const inputId = fieldName + "Input";

    return (
      <div className="relative">
        <label className="block mb-2 font-medium text-sky-950">
          {label} {required && "*"}
        </label>

        {/* If NO file is selected, show drag-and-drop */}
        {!isFileSelected && (
          <div
            className="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer flex flex-col items-center justify-center bg-gray-50"
            onClick={() => document.getElementById(inputId)?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("border-blue-500");
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("border-blue-500");
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("border-blue-500");
              const files = e.dataTransfer.files;
              handleFileSelect(fieldName)(files);
            }}
          >
            <svg
              className="w-8 h-8 mb-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6
                  a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-gray-500">
              PDF, PNG, JPG or JPEG (MAX. 10MB)
            </p>
            <input
              id={inputId}
              type="file"
              className="hidden"
              onChange={(e) => handleFileSelect(fieldName)(e.target.files)}
              accept=".pdf,.png,.jpg,.jpeg"
              required={required}
            />
          </div>
        )}

        {/* If a file IS selected, show file name + remove button */}
        {isFileSelected && (
          <div className="flex items-center justify-between border p-4 rounded bg-gray-50">
            <div className="text-gray-800 text-sm">
              {fileData[0]?.name || "Selected file"}
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({ ...prev, [fieldName]: null }))
              }
              className="text-red-600 underline text-sm"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-24 bg-white">
      <div className="container px-5 mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          {/* 1) Change heading to "Get Started Now" with font-['PT_Serif'] */}
          <h2 className="text-4xl font-bold text-[#0A142F] sm:text-5xl font-['PT_Serif']">
            Get Started Now
          </h2>

          {/* 2) Change paragraph below heading */}
          <p className="mx-auto mt-2 text-lg text-[#525A6D] max-w-xl">
            Fill out the form below to provide us with the necessary information
            to get started. Our team will review your details and reach out to
            guide you through the next steps, including payment processing.
          </p>
        </div>

        {/* Error list */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
            <ul className="list-disc list-inside">
              {Object.keys(errors).map((err, idx) => (
                <li key={idx}>{errors[err]}</li>
              ))}
            </ul>
          </div>
        )}

        {/* General message */}
        {message && (
          <div
            className={`mb-4 p-4 rounded ${
              status === "success"
                ? "bg-green-100 text-green-800"
                : status === "error"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* First Row: Name and Phone */}
          <div>
            <label className="block mb-2 font-medium text-sky-950">
              Your Name *
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-gray-300 rounded transition-colors
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-sky-950">Phone *</label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 300 400 5000"
              className="w-full px-4 py-2 border border-gray-300 rounded transition-colors
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                text-gray-900"
              required
            />
          </div>

          {/* Second Row: Full-width Email */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium text-sky-950">Email *</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@doe.com"
              className="w-full px-4 py-2 border border-gray-300 rounded transition-colors
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                text-gray-900"
              required
            />
          </div>

          {/* Third Row: SSN and Referral Code */}
          <div>
            <label className="block mb-2 font-medium text-sky-950">
              Social Security No *
            </label>
            <input
              name="ssn"
              type="password"
              value={formData.ssn}
              onChange={handleInputChange}
              placeholder="123-45-6789"
              className="w-full px-4 py-2 border border-gray-300 rounded transition-colors
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                text-gray-900"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-sky-950">
              Referral Code
            </label>
            <input
              name="referralCode"
              type="text"
              value={formData.referralCode}
              onChange={handleInputChange}
              placeholder="Enter referral code"
              className="w-full px-4 py-2 border border-gray-300 rounded transition-colors
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                text-gray-900"
            />
          </div>

          {/* File Inputs (ONE container) */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Utility Bill */}
            {renderFileUpload("utilityBill", "Utility Bill", true)}

            {/* Driver License */}
            {renderFileUpload("driverLicense", "Driver License", true)}
          </div>

          {/* Package Selection */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium text-sky-950">
              Select The Package *
            </label>
            <select
              name="package"
              value={formData.package}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
              required
            >
              <option value="">Choose a package</option>
              {packageOptions.map((pkg) => (
                <option key={pkg.value} value={pkg.value}>
                  {pkg.label} - ${pkg.price}
                </option>
              ))}
            </select>
          </div>

          {/* If you need an Amount field */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium text-sky-950">
              Amount ($) *
            </label>
            <input
              name="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter amount"
              className="w-full px-4 py-2 border border-gray-300 rounded text-gray-900"
              required
            />
          </div>

          {/* Credit Card Fields */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium text-sky-950">
              Credit / Debit Card *
            </label>
            <PaymentInputsContainer>
              {({ wrapperProps }) => (
                <div {...wrapperProps} className="grid grid-cols-12 gap-4">
                  <div className="col-span-1 flex items-center justify-center">
                    <svg {...getCardImageProps({ images })} />
                  </div>
                  <div className="col-span-11 md:col-span-5">
                    <input
                      {...getCardNumberProps({
                        onChange: (e) => setCardNumber(e.target.value),
                      })}
                      value={cardNumber}
                      className="w-full px-4 py-2 border border-gray-300 rounded text-gray-800
                        transition-colors focus:outline-none focus:border-blue-500
                        focus:ring-1 focus:ring-blue-500"
                      placeholder="Card Number"
                    />
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <input
                      {...getExpiryDateProps({
                        onChange: (e) => setExpiryDate(e.target.value),
                      })}
                      value={expiryDate}
                      className="w-full px-4 py-2 border border-gray-300 rounded text-gray-800
                        transition-colors focus:outline-none focus:border-blue-500
                        focus:ring-1 focus:ring-blue-500"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <input
                      {...getCVCProps({
                        onChange: (e) => setCvc(e.target.value),
                      })}
                      value={cvc}
                      className="w-full px-4 py-2 border border-gray-300 rounded text-gray-800
                        transition-colors focus:outline-none focus:border-blue-500
                        focus:ring-1 focus:ring-blue-500"
                      placeholder="CVC"
                    />
                  </div>
                </div>
              )}
            </PaymentInputsContainer>
            {meta.error && (
              <div className="text-red-500 text-sm mt-1">{meta.error}</div>
            )}
          </div>

          {/* CreditCardPreview AFTER the card input fields (hidden on mobile for layout) */}
          <div className="md:col-span-2 mb-4 hidden md:flex justify-center">
            <CreditCardPreview
              cardNumber={cardNumber}
              expiryDate={expiryDate}
              cvc={cvc}
            />
          </div>

          {/* Terms and Submit Button */}
          <div className="md:col-span-2 text-sm text-neutral-600">
            <p>
              By clicking "Fix My Credits Now," I confirm that I have read,
              understood, and accepted the foregoing terms and agree to be bound
              by them.
            </p>
            <p className="mt-2">
              Read the{" "}
              <a href="#" className="text-[#D09C01] hover:underline">
                Disclosure Here
              </a>
              .
            </p>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={!isAcceptReady || status === "loading"}
              className="w-full px-8 py-4 text-lg font-medium text-white bg-[#D09C01]
                rounded hover:bg-[#B88A01] transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Processing..." : "Fix My Credits Now"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactPaymentForm;

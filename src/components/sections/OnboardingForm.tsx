"use client";

import React, { useState, useEffect } from "react";
import { PaymentInputsContainer } from "react-payment-inputs";
import { usePaymentInputs } from "react-payment-inputs";
import { submitCreditRepairRequest, CreditRepairRequest, uploadFiles } from "../../lib/api";
import { showSuccessToast, showErrorToast } from "@/utils/toast";
import axios from 'axios';

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

// Helper component to filter out the isTouched prop and other non-standard HTML attributes
const InputWrapper = ({ isTouched, ...props }: { isTouched?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) => {
  // Properly filter out the isTouched prop before passing props to the DOM element
  // The destructuring above already removes isTouched from props
  return <input {...props} />;
};

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
  address: string;
  dateOfBirth: string;
  [key: string]: string | FileList | null;
}

interface UploadProgress {
  utilityBill: number;
  driverLicense: number;
}

interface FormErrors {
  [key: string]: string;
}


const OnboardingForm = () => {
  // Add client-side only state
  const [isMounted, setIsMounted] = useState(false);
  

  
  const PUBLIC_CLIENT_KEY = process.env.NEXT_PUBLIC_AUTHORIZE_CLIENT_KEY || "";
  const API_LOGIN_ID = process.env.NEXT_PUBLIC_AUTHORIZE_LOGIN_ID || "";


  const packageOptions = [
    { value: "TIER_1", label: "Tier 1", price: 2199 },
    { value: "TIER_2", label: "Tier 2", price: 2499 },
    { value: "TIER_3", label: "Tier 3", price: 3499 },
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
    address: "",
    dateOfBirth: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isAcceptReady, setIsAcceptReady] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ utilityBill: 0, driverLicense: 0 });
  const [isUploading, setIsUploading] = useState(false);

  // Payment card state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");

  // Use react-payment-inputs for card input validation
  const { meta, getCardNumberProps, getExpiryDateProps, getCVCProps } =
    usePaymentInputs();

  // Load Authorize.Net Accept.js
  useEffect(() => {
    setIsMounted(true);
    
    const existingScript = document.getElementById('accept-js');
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.src = "https://jstest.authorize.net/v1/Accept.js";
    script.id = 'accept-js';
    script.async = true;
    script.setAttribute('data-environment', 'sandbox');
    
    script.onload = () => {
      setIsAcceptReady(true);
      console.log('Accept.js loaded successfully');
    };
    script.onerror = () => {
      console.error("Failed to load Accept.js");
      setStatus('error');
      setMessage('Failed to load payment processor');
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // If not mounted yet (server-side), return a loading state
  if (!isMounted) {
    return (
      <section className="py-16 sm:py-24 lg:py-32 bg-white">
        <div className="w-[95%] sm:w-[90%] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#0A173B] mb-4 font-['PT_Serif']">
            Contact Us
          </h2>
          <p className="text-lg text-gray-600 font-montserrat">
            Loading contact form...
          </p>
        </div>
      </section>
    );
  }

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
      // Clear the error for this field when a file is selected
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  // Validate
  const validateForm = (): FormErrors | null => {
    const newErrors: FormErrors = {};
    const { name, email, phone, ssn, package: pkg, address, dateOfBirth, utilityBill, driverLicense } = formData;

    if (!name) newErrors.name = "Name is required";
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Valid email is required";
    }

    if (!pkg) newErrors.package = "Please select a package";
    if (!address) newErrors.address = "Address is required";
    if (!dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
    
    // Updated file validation logic
    if (!utilityBill || utilityBill.length === 0) {
      newErrors.utilityBill = "Please upload a utility bill document";
    }

    if (!driverLicense || driverLicense.length === 0) {
      newErrors.driverLicense = "Please upload a driver's license document";
    }

    // Card validation
    if (!cardNumber || meta.error) {
      newErrors.cardNumber = "Valid card number is required";
    }
    if (!cvc || !/^\d{3,4}$/.test(cvc)) {
      newErrors.cvc = "Valid CVC required";
    }

    // If meta.error exists, add it
    if (meta.error) newErrors.metaError = meta.error;

    return Object.keys(newErrors).length > 0 ? newErrors : null;
  };

  // Submit => Tokenize => Send to backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAcceptReady || status === "loading") return;

    try {
      const validationErrors = validateForm();
      if (!validationErrors) {
        setErrors({});
        setMessage("Processing your request...");
        setStatus("loading");

        const [month, year] = expiryDate.split("/");
        if (!month || !year) {
          throw new Error("Invalid expiry date format.");
        }

        const secureData = {
          authData: {
            clientKey: PUBLIC_CLIENT_KEY,
            apiLoginID: API_LOGIN_ID,
          },
          cardData: {
            cardNumber: cardNumber.replace(/\s/g, ""),
            month: month.trim(),
            year: `20${year.trim()}`,
            cardCode: cvc,
          },
        };

        // Get payment token
        const acceptResponse: any = await new Promise((resolve, reject) => {
          if (!window.Accept?.dispatchData) {
            throw new Error("Accept.js is not ready");
          }
          window.Accept.dispatchData(secureData, (response: any) => {
            if (response.messages.resultCode === "Error") {
              reject(new Error(response.messages.message[0].text));
            } else {
              resolve(response);
            }
          });
        });

        // Validate package selection
        const selectedPackage = packageOptions.find(pkg => pkg.value === formData.package);
        if (!selectedPackage) {
          throw new Error("Invalid package selected");
        }

        // Validate and prepare files
        const utilityBillFile = formData.utilityBill?.item(0);
        const driverLicenseFile = formData.driverLicense?.item(0);
        if (!utilityBillFile || !driverLicenseFile) {
          throw new Error("Required documents are missing");
        }

        // Handle file uploads
        setIsUploading(true);
        setUploadProgress({ utilityBill: 0, driverLicense: 0 });

        const fileApiWithProgress = axios.create({
          baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://lzx4063g-3003.inc1.devtunnels.ms',
        });

        const uploadFormData = new FormData();
        uploadFormData.append('files', utilityBillFile);
        uploadFormData.append('files', driverLicenseFile);
        uploadFormData.append('isPublic', 'false');

        const uploadResponse = await fileApiWithProgress.post('/media', uploadFormData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const totalSize = utilityBillFile.size + driverLicenseFile.size;
              const loadedSize = progressEvent.loaded;
              
              // Calculate individual progress based on file sizes
              const utilityBillProgress = Math.round((loadedSize * utilityBillFile.size / totalSize) / utilityBillFile.size * 100);
              const driverLicenseProgress = Math.round((loadedSize * driverLicenseFile.size / totalSize) / driverLicenseFile.size * 100);
              
              setUploadProgress({
                utilityBill: Math.min(utilityBillProgress, 100),
                driverLicense: Math.min(driverLicenseProgress, 100)
              });
            }
          }
        });

        if (!uploadResponse.data.files || uploadResponse.data.files.length !== 2) {
          throw new Error("Failed to upload all required documents");
        }

        const utilityBillUrl = uploadResponse.data.files[0]._id;
        const driverLicenseUrl = uploadResponse.data.files[1]._id;

        // Submit credit repair request
        const creditRepairData = {
          fullName: formData.name,
          email: formData.email,
          phoneNumber: '+18143512239',
          referralCode: formData.referralCode || undefined,
          address: formData.address,
          socialSecurityNumber: formData.ssn,
          dateofBirth: formData.dateOfBirth,
          utilityBill: utilityBillUrl,
          driverLicense: driverLicenseUrl,
          packageType: formData.package,
          packagePrice: selectedPackage.price,
          dataValue: acceptResponse.opaqueData.dataValue,
          dataDescriptor: acceptResponse.opaqueData.dataDescriptor
        };

        await submitCreditRepairRequest(creditRepairData);

        // Success handling
        setStatus("success");
        setMessage("Your credit repair request has been submitted successfully!");
        showSuccessToast("Your credit repair request has been submitted successfully!");

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          ssn: "",
          referralCode: "",
          package: "",
          utilityBill: null,
          driverLicense: null,
          address: "",
          dateOfBirth: "",
        });
        setCardNumber("");
        setExpiryDate("");
        setCvc("");
        setIsUploading(false);

      } else {
        setErrors(validationErrors);
        setStatus("error");
        setMessage("Please correct the errors above.");
        showErrorToast("Please correct the errors above.");
      }
    } catch (err: any) {
      setStatus("error");
      const errorMessage = err.message || "Failed to process your request";
      setMessage(errorMessage);
      showErrorToast(errorMessage);
      setIsUploading(false);
    } finally {
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  // We no longer need the convertFileToBase64 function as we're using the uploadFiles API

  // Helper: Render a drag-and-drop area or the selected file with remove button
  const renderFileUpload = (fieldName: string, label: string, required: boolean = false) => {
    const fileData = formData[fieldName] as FileList | null;
    const isFileSelected = fileData && fileData.length > 0;
    const inputId = fieldName + "Input";
    const progress = uploadProgress[fieldName as keyof UploadProgress];
    const showProgress = isUploading && isFileSelected && progress < 100;
    const error = errors[fieldName];

    return (
      <div className="relative">
        <label className="block mb-2 font-medium text-sky-950">
          {label} {required && "*"}
        </label>

        {/* If NO file is selected, show drag-and-drop */}
        {!isFileSelected && (
          <div
            className={`w-full px-4 py-8 border-2 border-dashed rounded-lg hover:border-blue-500 transition-colors cursor-pointer flex flex-col items-center justify-center bg-gray-50 ${error ? 'border-red-500' : 'border-gray-300'}`}
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
              className={`w-8 h-8 mb-4 ${error ? 'text-red-500' : 'text-gray-500'}`}
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
            <p className={`mb-2 text-sm ${error ? 'text-red-500' : 'text-gray-500'}`}>
              Click to upload or drag and drop
            </p>
            <p className={`text-xs ${error ? 'text-red-500' : 'text-gray-500'}`}>
              PDF, PNG, JPG or JPEG (MAX. 10MB)
            </p>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
        )}

        <input
          id={inputId}
          type="file"
          className="hidden"
          onChange={(e) => handleFileSelect(fieldName)(e.target.files)}
          accept=".pdf,.png,.jpg,.jpeg"
          aria-invalid={error ? 'true' : 'false'}
        />

        {/* If file IS selected, show file info */}
        {isFileSelected && fileData[0] && (
          <div className={`p-4 border rounded-lg ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-black truncate">{fileData[0].name}</span>
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    [fieldName]: null
                  }));
                }}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            {showProgress && (
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>
        )}
      </div>
    );
  };

  return (
    <section id="onboarding" className="py-24 bg-white">
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

          {/* Third Row: Address */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium text-sky-950">Address *</label>
            <input
              name="address"
              type="text"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="1234 Main St, City, State, ZIP"
              className="w-full px-4 py-2 border border-gray-300 rounded transition-colors
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                text-gray-900"
              required
            />
          </div>
          
          {/* Fourth Row: SSN */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium text-sky-950">Social Security Number *</label>
            <input
              name="ssn"
              type="text"
              value={formData.ssn}
              onChange={handleInputChange}
              placeholder="123-45-6789"
              className="w-full px-4 py-2 border border-gray-300 rounded transition-colors
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                text-gray-900"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium text-sky-950">Date of Birth *</label>
            <input
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded transition-colors
                focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                text-gray-900"
              required
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



          {/* Credit Card Fields */}
          <div className="md:col-span-2">
            <label className="block mb-2 font-medium text-sky-950">
              Credit / Debit Card *
            </label>
            <PaymentInputsContainer>
              {({ wrapperProps }: { wrapperProps: React.HTMLAttributes<HTMLDivElement> }) => (
                <div {...wrapperProps} className="grid grid-cols-12 gap-4">
                  <div className="col-span-1 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                      <path
                        fill="currentColor"
                        d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"
                      />
                    </svg>
                  </div>
                  <div className="col-span-11 md:col-span-5">
                    <InputWrapper
                      {...getCardNumberProps({
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCardNumber(e.target.value),
                      })}
                      value={cardNumber}
                      className="w-full px-4 py-2 border border-gray-300 rounded text-gray-800
                        transition-colors focus:outline-none focus:border-blue-500
                        focus:ring-1 focus:ring-blue-500"
                      placeholder="Card Number"
                    />
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <InputWrapper
                      {...getExpiryDateProps({
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setExpiryDate(e.target.value),
                      })}
                      value={expiryDate}
                      className="w-full px-4 py-2 border border-gray-300 rounded text-gray-800
                        transition-colors focus:outline-none focus:border-blue-500
                        focus:ring-1 focus:ring-blue-500"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="col-span-6 md:col-span-3">
                    <InputWrapper
                      {...getCVCProps({
                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCvc(e.target.value),
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
              By clicking &quot;Fix My Credits Now,&quot; I confirm that I have read,
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

export default OnboardingForm;

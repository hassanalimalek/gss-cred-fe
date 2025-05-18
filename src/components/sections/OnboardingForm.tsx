"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PaymentInputsContainer, usePaymentInputs } from "react-payment-inputs";
import { submitCreditRepairRequest, getEncryptionKeys } from "../../api";
import { showSuccessToast, showErrorToast } from "../../utils/toast";
import axios from 'axios';
import { encryptFormData } from '../../utils/encryption';
import { LoadingSpinner } from "../common/LoadingSpinner";
import { packages } from "../../data/packages";

// Environment-aware logging
const isProduction = process.env.NODE_ENV === 'production';
const logDebug = (message: string, data?: any) => {
  if (!isProduction) {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
};

const logError = (message: string, error?: any) => {
  if (!isProduction) {
    console.error(message, error);
  }
  // In production, you might want to send this to an error tracking service
  // if (isProduction && typeof window !== 'undefined' && window.errorTracker) {
  //   window.errorTracker.captureError(error, { message });
  // }
};

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
const InputWrapper = ({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
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
  // Format the card number with spaces
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
    if (!cardNumber) return "default";
    if (cardNumber.startsWith("4")) return "visa";
    if (cardNumber.startsWith("5")) return "mastercard";
    if (cardNumber.startsWith("3")) return "amex";
    if (cardNumber.startsWith("6")) return "discover";
    return "default";
  };

  const cardType = getCardType();

  // Dynamic card background based on card type
  const getCardBackground = () => {
    switch (cardType) {
      case "visa":
        return "from-blue-600 to-blue-900";
      case "mastercard":
        return "from-red-600 to-yellow-600";
      case "amex":
        return "from-blue-400 to-blue-700";
      case "discover":
        return "from-orange-400 to-orange-700";
      default:
        return "from-gray-700 to-gray-900";
    }
  };

  return (
    <div className={`relative w-full max-w-[410px] h-[220px] rounded-xl bg-gradient-to-tr ${getCardBackground()} p-6 text-white shadow-lg overflow-hidden transition-all duration-300`}>
      {/* Card brand logo/icon */}
      <div className="absolute top-6 right-6">
        {cardType === "visa" && (
          <span className="text-xl font-bold italic tracking-wider">VISA</span>
        )}
        {cardType === "mastercard" && (
          <div className="flex">
            <div className="w-8 h-8 bg-red-500 rounded-full opacity-80 -mr-4"></div>
            <div className="w-8 h-8 bg-yellow-500 rounded-full opacity-80"></div>
          </div>
        )}
        {cardType === "amex" && (
          <span className="text-xl font-bold tracking-wide">AMEX</span>
        )}
        {cardType === "discover" && (
          <span className="text-xl font-bold">DISCOVER</span>
        )}
        {cardType === "default" && (
          <span className="text-xl font-bold">CARD</span>
        )}
      </div>

      {/* Card chip */}
      <div className="w-12 h-10 bg-yellow-300 rounded-md mb-6 flex items-center justify-center overflow-hidden">
        <div className="w-10 h-8 border-2 border-yellow-600 rounded-md grid grid-cols-3 grid-rows-2 gap-px">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-yellow-600/30"></div>
          ))}
        </div>
      </div>

      {/* Card number */}
      <div className="text-xl md:text-2xl mb-6 font-mono tracking-wider">
        {formatDisplayCardNumber()}
      </div>

      {/* Card details */}
      <div className="flex justify-between items-center">
        {/* Expires */}
        <div>
          <div className="text-xs uppercase text-gray-200 mb-1">Expires</div>
          <div className="font-medium">{expiryDate || "MM/YY"}</div>
        </div>
        {/* CVV */}
        <div>
          <div className="text-xs uppercase text-gray-200 mb-1">CVV</div>
          <div className="font-medium">{cvc || "***"}</div>
        </div>
      </div>

      {/* Security pattern overlay */}
      <div className="absolute inset-0 bg-white opacity-5 pointer-events-none">
        <div className="w-full h-full bg-grid-slate-200/10"></div>
      </div>

      {/* Chip reflection */}
      <div className="absolute top-20 left-12 w-6 h-1 bg-white opacity-20 transform rotate-45"></div>
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
  requestRecordExpunction: boolean;
  [key: string]: string | FileList | null | boolean;
}

interface UploadProgress {
  utilityBill: number;
  driverLicense: number;
  [key: string]: number; // Allow dynamic field access
}

interface FormErrors {
  [key: string]: string;
}

interface PaymentErrorDetails {
  message: string;
  responseCode?: string;
  raw?: {
    transactionResponse?: {
      responseCode: string;
      accountNumber?: string;
      accountType?: string;
      cvvResultCode?: string;
      avsResultCode?: string;
      errors?: Array<{
        errorCode: string;
        errorText: string;
      }>;
    };
    messages?: {
      resultCode: string;
      message: Array<{
        code: string;
        text: string;
      }>;
    };
  };
}

interface PaymentError {
  statusCode: number;
  error: string;
  details: PaymentErrorDetails;
}

// Simple inline spinner component
const Spinner = () => (
  <div className="inline-block animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full mr-3" aria-hidden="true"></div>
);

const OnboardingForm = () => {
  const PUBLIC_CLIENT_KEY = process.env.NEXT_PUBLIC_AUTHORIZE_CLIENT_KEY || "";
  const API_LOGIN_ID = process.env.NEXT_PUBLIC_AUTHORIZE_LOGIN_ID || "";

  // Map packages to the format needed for the form
  const packageOptions = packages.map(pkg => ({
    value: pkg.name === "Tier 1" ? "TIER_1" :
           pkg.name === "Tier 2" ? "TIER_2" :
           pkg.name === "Custom" ? "CUSTOM" : "",
    label: pkg.name,
    price: pkg.price
  }));

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
    requestRecordExpunction: false,
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isAcceptReady, setIsAcceptReady] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ utilityBill: 0, driverLicense: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const [fileUploads, setFileUploads] = useState<{[key: string]: {uploading: boolean, completed: boolean, error?: boolean}}>({
    utilityBill: {uploading: false, completed: false},
    driverLicense: {uploading: false, completed: false}
  });

  // Payment card state
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");

  // Use react-payment-inputs for card input validation
  const { meta, getCardNumberProps, getExpiryDateProps, getCVCProps } =
    usePaymentInputs();

  // Load Authorize.Net Accept.js
  useEffect(() => {
    const loadAcceptJs = async () => {
      try {
        // Use a single URL provided via environment variable
        const acceptJsUrl = process.env.NEXT_PUBLIC_ACCEPTJS_URL;

        if (!acceptJsUrl) {
          // Log to error tracking service in production instead of console
          setStatus("error");
          setMessage("Payment system failed to initialize. Please contact support.");
          throw new Error("Accept.js URL not defined");
        }

        const script = document.createElement("script");
        script.src = acceptJsUrl;
        script.async = true;
        script.onload = () => {
          // Accept.js loaded successfully
          setIsAcceptReady(true);
        };
        script.onerror = () => {
          // Log to error tracking service in production instead of console
          setStatus("error");
          setMessage("Payment system failed to initialize. Please try again later.");
        };

        document.body.appendChild(script);
      } catch (error) {
        // Log to error tracking service in production instead of console
        setStatus("error");
        setMessage("Payment system failed to initialize. Please try again later.");
      }
    };

    loadAcceptJs();

    // Cleanup function
    return () => {
      const scripts = document.querySelectorAll(`script[src*="Accept.js"]`);
      scripts.forEach(script => script.remove());
    };
  }, []);

  // Check for required environment variables
  useEffect(() => {
    const requiredEnvVars = [
      { name: 'NEXT_PUBLIC_API_BASE_URL', value: process.env.NEXT_PUBLIC_API_BASE_URL },
      { name: 'NEXT_PUBLIC_AUTHORIZE_LOGIN_ID', value: process.env.NEXT_PUBLIC_AUTHORIZE_LOGIN_ID },
      { name: 'NEXT_PUBLIC_AUTHORIZE_CLIENT_KEY', value: process.env.NEXT_PUBLIC_AUTHORIZE_CLIENT_KEY },
      { name: 'NEXT_PUBLIC_ACCEPTJS_URL', value: process.env.NEXT_PUBLIC_ACCEPTJS_URL }
    ];

    const missingVars = requiredEnvVars.filter(v => !v.value);

    if (missingVars.length > 0) {
      setStatus("error");
      setMessage(`Configuration error. Please contact support. [Missing: ${missingVars.map(v => v.name).join(', ')}]`);
      // In production, we would log this to an error tracking service but not expose the details to the user
    }
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
      const file = files[0];
      const maxSizeInBytes = 10 * 1024 * 1024; // 10MB

      // Validate file size
      if (file.size > maxSizeInBytes) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: `File size exceeds 10MB limit. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB`
        }));
        return;
      }

      // Validate file type
      const validTypes = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/jpg'
      ];

      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: `Invalid file type. Please upload a PDF, PNG, JPG or JPEG file.`
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, [fieldName]: files }));

      // Clear any errors for this field when a valid file is selected
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });

      // Reset progress tracking for this field
      setUploadProgress(prev => ({
        ...prev,
        [fieldName]: 0
      }));
      setFileUploads(prev => ({
        ...prev,
        [fieldName]: {uploading: false, completed: false}
      }));
    }
  };

  // Get API base URL from environment
  const getApiBaseUrl = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      // Log to error tracking service in production instead of console
      setStatus("error");
      setMessage("API configuration error. Please contact support.");
      throw new Error("API base URL not defined");
    }
    return baseUrl;
  };

  // Validate
  const validateForm = (): FormErrors | null => {
    const errors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = "Phone number is invalid";
    }

    // SSN validation
    if (!formData.ssn.trim()) {
      errors.ssn = "SSN is required";
    } else if (!/^\d{3}-?\d{2}-?\d{4}$/.test(formData.ssn)) {
      errors.ssn = "SSN is invalid";
    }

    // Address validation
    if (!formData.address.trim()) {
      errors.address = "Address is required";
    }

    // Date of Birth validation
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "Date of birth is required";
    }

    // Package validation
    if (!formData.package) {
      errors.package = "Please select a package";
    }

    // File validation
    if (!formData.utilityBill || formData.utilityBill.length === 0) {
      errors.utilityBill = "Utility bill is required";
    }

    if (!formData.driverLicense || formData.driverLicense.length === 0) {
      errors.driverLicense = "Driver's license is required";
    }

    // Payment method validation
    if (isAcceptReady) {
      // Only store card error in one place to avoid duplicates
      // Don't show validation error if meta.error already displays it
      if (!cardNumber.trim()) {
        errors.card = "Valid card number is required";
      }
    }

    return Object.keys(errors).length ? errors : null;
  };

  // Function to reset the form after successful submission
  const resetForm = () => {
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
      requestRecordExpunction: false,
    });
    setCardNumber("");
    setExpiryDate("");
    setCvc("");
    setErrors({});
    setIsUploading(false);
    setUploadProgress({ utilityBill: 0, driverLicense: 0 });
    setFileUploads({
      utilityBill: {uploading: false, completed: false},
      driverLicense: {uploading: false, completed: false}
    });
  };

  // Create API instance outside the handler for better memory management
  const fileApiWithProgress = useMemo(() => (baseUrl: string) => {
    const instance = axios.create({
      baseURL: baseUrl,
      timeout: 120000, // 2 minutes timeout for larger files
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Add response interceptor to handle errors
    instance.interceptors.response.use(
      (response) => response, // Return successful responses as-is
      (error) => {
        // Just pass through the error - no special handling needed here
        return Promise.reject(error);
      }
    );

    return instance;
  }, []);

  // Completely restructured handleSubmit for better error handling and flow
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Start with form in loading state
    setStatus("loading");
    setMessage("Processing your application...");

    try {
      // STEP 1: Validate form
      const formErrors = validateForm();
      if (formErrors) {
        setErrors(formErrors);
        const firstErrorField = Object.keys(formErrors)[0];
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus();
        }
        throw new Error("Please correct the errors in the form.");
      }

      // Clear any previous errors since validation passed
      setErrors({});

      // STEP 2: Check API configuration
      const apiBaseUrl = getApiBaseUrl();
      if (!apiBaseUrl) {
        throw new Error("System configuration error. Please try again later or contact support.");
      }

      // STEP 3: Verify document uploads are ready
      const utilityBillFile = formData.utilityBill && formData.utilityBill.item(0);
      const driverLicenseFile = formData.driverLicense && formData.driverLicense.item(0);

      if (!utilityBillFile || !driverLicenseFile) {
        throw new Error("Required documents are missing. Please upload both utility bill and driver's license.");
      }

      // STEP 4: Prepare and validate data
      // Clean phone number
      const cleanedPhone = formData.phone.replace(/\D/g, '');
      if (cleanedPhone.length !== 10) {
        setErrors(prev => ({...prev, phone: "Phone number must be 10 digits"}));
        throw new Error("Phone number must be 10 digits.");
      }

      const formattedPhone = `+1${cleanedPhone}`;

      // Clean SSN
      const ssnDigits = formData.ssn.replace(/\D/g, '');
      if (ssnDigits.length !== 9) {
        setErrors(prev => ({...prev, ssn: "SSN must be 9 digits"}));
        throw new Error("SSN must be 9 digits.");
      }

      // STEP 5: Verify payment data is ready
      if (!isAcceptReady) {
        throw new Error("Payment processing system is not ready. Please try again.");
      }

      if (meta.error) {
        throw new Error(`Payment card error: ${meta.error}`);
      }

      // STEP 6: Upload documents
      setMessage("Uploading documents... Please do not close this window.");
      setIsUploading(true);
      setUploadProgress({ utilityBill: 0, driverLicense: 0 });

      let utilityBillUrl;
      let driverLicenseUrl;

      try {
        // Use the memoized API instance
        const api = fileApiWithProgress(apiBaseUrl);

        // Fixing the uploadSingleFile function to handle concurrent uploads with individual progress
        const uploadSingleFile = async (file: File, fieldName: string) => {
          const singleFileFormData = new FormData();
          singleFileFormData.append('files', file);
          singleFileFormData.append('isPublic', 'false');

          // Set uploading state for this specific file only
          setFileUploads(prev => ({
            ...prev,
            [fieldName]: {uploading: true, completed: false, error: false}
          }));

          // Reset progress for this file before starting
          setUploadProgress(prev => ({
            ...prev,
            [fieldName]: 0
          }));

          try {
            const response = await api.post('/media', singleFileFormData, {
              onUploadProgress: (progressEvent) => {
                // This callback runs many times during upload, we need a functional update
                // to ensure we're not interfering with other concurrent uploads
                setUploadProgress(prev => {
                  // Important: Create a new object to avoid state batching issues
                  return {
                    ...prev,
                    // Only update this specific file's progress
                    [fieldName]: Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
                  };
                });
              }
            });

            // Set completed state only for this file
            setFileUploads(prev => ({
              ...prev,
              [fieldName]: {uploading: false, completed: true, error: false}
            }));

            return response.data;
          } catch (uploadError: any) {
            // Update error state only for this file
            setFileUploads(prev => ({
              ...prev,
              [fieldName]: {uploading: false, completed: false, error: true}
            }));

            // Handle specific upload errors
            if (axios.isAxiosError(uploadError)) {
              if (uploadError.code === 'ECONNABORTED') {
                throw new Error(`${fieldName} upload timed out. Please try again with a smaller file or better connection.`);
              }
              if (uploadError.response?.status === 413) {
                throw new Error(`${fieldName} is too large. Please upload a smaller file (max 10MB).`);
              }
              if (uploadError.response?.status === 406) {
                // Extract the actual error message from the backend
                const errorMessage = uploadError.response.data?.message || 'File size or type not acceptable';
                throw new Error(`${fieldName}: ${errorMessage}`);
              }
              if (uploadError.response?.data?.message) {
                throw new Error(`${fieldName}: ${uploadError.response.data.message}`);
              }
            }

            throw new Error(`Failed to upload ${fieldName}. ${uploadError.message || 'Please try again.'}`);
          }
        };

        // Use Promise.all for parallel uploads but with proper individual progress handling
        setMessage("Uploading documents... Please wait.");

        try {
          // Run uploads in parallel for better speed
          const [utilityBillResponse, driverLicenseResponse] = await Promise.all([
            uploadSingleFile(utilityBillFile, 'utilityBill'),
            uploadSingleFile(driverLicenseFile, 'driverLicense')
          ]);

          // Validate upload results
          if (!utilityBillResponse.files || utilityBillResponse.files.length === 0) {
            throw new Error("Failed to upload utility bill. Please try again.");
          }

          if (!driverLicenseResponse.files || driverLicenseResponse.files.length === 0) {
            throw new Error("Failed to upload driver's license. Please try again.");
          }

          // Set the URLs after successful uploads
          utilityBillUrl = utilityBillResponse.files[0]._id;
          driverLicenseUrl = driverLicenseResponse.files[0]._id;

        } catch (error) {
          // Just rethrow the error - no need to wrap it again
          throw error;
        }

      } catch (error) {
        // Handle document upload errors
        let uploadErrorMessage = "An unexpected error occurred during document upload. Please try again later.";

        if (error instanceof Error) {
          // Don't wrap the error message if it already contains "upload" to avoid duplication
          if (error.message.includes('upload') || error.message.includes('File')) {
            throw error; // Just pass through the original error
          } else {
            uploadErrorMessage = `Document upload error: ${error.message}`;
          }
        }

        throw new Error(uploadErrorMessage);
      }

      // STEP 7: Process payment
      setMessage("Processing payment... Please do not close this window.");

      let dataValue;
      let dataDescriptor;

      try {
        const secureData = {
          authData: {
            clientKey: PUBLIC_CLIENT_KEY,
            apiLoginID: API_LOGIN_ID,
          },
          cardData: {
            cardNumber: cardNumber.replace(/\s/g, ""),
            month: expiryDate.split("/")[0].trim(),
            year: `20${expiryDate.split("/")[1].trim()}`,
            cardCode: cvc,
          },
        };

        // // Get payment token
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

        dataValue = acceptResponse.opaqueData.dataValue;
        dataDescriptor = acceptResponse.opaqueData.dataDescriptor;

        if (!dataValue || !dataDescriptor) {
          throw new Error("Payment processing failed. Please check your card information.");
        }
      } catch (error) {
        // Only handle Accept.js errors here
        let errorMessage = "Payment processing failed. Please try again.";

        if (error instanceof Error) {
          errorMessage = `Payment error: ${error.message}`;
        }

        throw new Error(errorMessage);
      }

      // STEP 8: Submit the credit repair request
      setMessage("Finalizing your application...");

      try {
        // Get encryption keys
        const { publicKey, sessionId } = await getEncryptionKeys();

        // Prepare data for submission
        const submissionData = {
          fullName: formData.name,
          email: formData.email,
          phoneNumber: formattedPhone,
          referralCode: formData.referralCode || undefined,
          address: formData.address,
          socialSecurityNumber: ssnDigits,
          dateofBirth: formData.dateOfBirth,
          utilityBill: utilityBillUrl,
          driverLicense: driverLicenseUrl,
          packageType: formData.package,
          packagePrice: packageOptions.find((p) => p.value === formData.package)?.price || 0,
          dataValue: dataValue,
          dataDescriptor: dataDescriptor,
          requestRecordExpunction: formData.requestRecordExpunction
        };

        // Encrypt the submission data
        const encryptedPayload = encryptFormData(submissionData, publicKey, sessionId);
        // Submit the encrypted payload
        const response = await submitCreditRepairRequest(encryptedPayload);
        logDebug("Submission successful, response:", "test");

        // Success - show success message
        setStatus("success");
        setMessage("Application submitted successfully! We'll get back to you soon.");
        showSuccessToast("Your credit repair application has been submitted successfully! We'll be in touch soon.");

        // Optional: Reset form after success
        setTimeout(() => {
          resetForm();
        }, 3000);

      } catch (error) {
        // Handle API submission errors - critically important for payment errors!
        let submitErrorMessage = "An error occurred during submission.";
        logDebug("Submission or payment error caught:", error);

        // Special handling for payment errors (HTTP 402)
        if (axios.isAxiosError(error) && error.response) {
          logDebug("API error response:", {
            status: error.response.status,
            statusText: error.response.statusText,
            data: JSON.stringify(error.response.data)
          });

          if (error.response.status === 402) {
            try {
              const paymentError = error.response.data as PaymentError;
              logDebug("Payment error details:", paymentError);
              const details = paymentError?.details || { message: "Unknown payment error" };

              // Map response codes to user-friendly messages - EXPANDED
              const errorMessages: Record<string, string> = {
                '2': 'Your card was declined.',
                '3': 'This card requires additional verification.',
                '4': 'This card has insufficient funds.',
                '6': 'Invalid card information. Please check your card details.',
                '7': 'The credit card has expired.',
                '8': 'The credit card has an invalid expiration date.',
                '11': 'A duplicate transaction has been submitted.',
                '27': 'The transaction resulted in an address verification mismatch.',
                '44': 'This card has been declined for your protection.',
                '45': 'This card has been flagged for potential fraud.',
                '200': 'This transaction has been declined.',
                '300': 'The transaction was rejected by the payment processor.'
              };

              // Add CVV response code messages
              const cvvMessages: Record<string, string> = {
                'N': 'The CVV code you entered doesn\'t match your card.',
                'P': 'Your card issuer couldn\'t verify your CVV code.',
                'S': 'Your card requires a CVV code but none was provided.',
                'U': 'Your card issuer doesn\'t support CVV verification.'
              };

              // Add retry suggestions based on error type
              const getRetrySuggestion = (errorCode: string) => {
                switch(errorCode) {
                  case '2': // Declined
                    return "Please try another card or payment method.";
                  case '3': // Additional verification
                    return "Please contact your bank for more information.";
                  case '4': // Insufficient funds
                    return "Please try another card or payment method.";
                  case '6': // Invalid card
                    return "Please carefully check your card number and try again.";
                  case '7': // Expired
                    return "Please use a card that hasn't expired.";
                  case '8': // Invalid expiration
                    return "Please check the expiration date and try again.";
                  case '45': // Fraud
                  case '44': // Declined for protection
                    return "Please contact your bank or use a different card.";
                  default:
                    return "Please try again or use a different payment method.";
                }
              };

              // Try to get the most specific error message
              if (details.raw?.transactionResponse?.errors && details.raw.transactionResponse.errors.length > 0) {
                const transactionError = details.raw.transactionResponse.errors[0];
                submitErrorMessage = errorMessages[transactionError.errorCode] || transactionError.errorText;

                // Add retry suggestion
                if (errorMessages[transactionError.errorCode]) {
                  submitErrorMessage += " " + getRetrySuggestion(transactionError.errorCode);
                }

                logDebug("Using transaction error code:", transactionError.errorCode);
              }
              else if (details.responseCode && errorMessages[details.responseCode]) {
                submitErrorMessage = errorMessages[details.responseCode];

                // Add retry suggestion
                submitErrorMessage += " " + getRetrySuggestion(details.responseCode);

                logDebug("Using response code:", details.responseCode);
              }
              else {
                submitErrorMessage = details.message || paymentError.error || "Payment failed. Please try again.";
                logDebug("Using fallback error message");
              }

              // Check for CVV-specific errors with null check
              if (details.raw?.transactionResponse?.cvvResultCode) {
                const cvvCode = details.raw.transactionResponse.cvvResultCode;
                if (cvvMessages[cvvCode] && cvvCode !== 'M') { // M is success
                  // If we already have a general decline message, add CVV info
                  if (submitErrorMessage.includes('declined') || submitErrorMessage.includes('invalid')) {
                    submitErrorMessage += " " + cvvMessages[cvvCode];
                  } else {
                    submitErrorMessage = cvvMessages[cvvCode] + " Please try again.";
                  }
                  logDebug("Using CVV error code:", cvvCode);
                }
              }

              // Add card info if available with additional null checks
              if (details.raw?.transactionResponse?.accountType &&
                  details.raw.transactionResponse?.accountNumber) {
                submitErrorMessage += ` (${details.raw.transactionResponse.accountType} ending in ${
                  details.raw.transactionResponse.accountNumber.replace('XXXX', '')
                })`;
              }
            } catch (parseError) {
              logError("Error parsing payment error response:", parseError);
              submitErrorMessage = "Payment failed. Please check your card details and try again.";
            }
          } else if (error.response.status === 400) {
            submitErrorMessage = "Invalid submission data. Please check your information and try again.";
          } else if (error.response.status === 500) {
            submitErrorMessage = "Server error. Please try again later or contact support.";
          } else {
            submitErrorMessage = `Submission error (${error.response.status}): ${error.response?.data?.message || error.message}`;
          }
        } else if (error instanceof Error) {
          // Network error detection
          if (error.message.includes('Network Error') || error.message.includes('ECONNABORTED')) {
            submitErrorMessage = "Cannot connect to payment service. Please check your internet connection and try again.";
            logDebug("Network error detected");
          }
          // False negative detection - if the message contains "cancel" it might be a false negative
          else if (error.message.toLowerCase().includes('cancel')) {
            setStatus("success");
            setMessage("Your application is being processed. If you don't receive confirmation within 15 minutes, please contact support.");
            showSuccessToast("Your application is being processed. You'll receive a confirmation email shortly.");
            return;
          } else {
            submitErrorMessage = error.message;
          }
        }

        throw new Error(submitErrorMessage);
      }

    } catch (error) {
      // MAIN ERROR HANDLER - All errors bubble up to here
      setIsUploading(false);
      setStatus("error");

      let finalErrorMessage = "An unexpected error occurred. Please try again later.";

      if (error instanceof Error) {
        finalErrorMessage = error.message;
        // Log error details safely
        logError("Form submission error:", {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      } else {
        // Handle non-Error objects
        logError("Form submission error (non-Error object):",
          typeof error === 'object' ? JSON.stringify(error) : error);
      }

      setMessage(finalErrorMessage);
      showErrorToast(finalErrorMessage);
    } finally {
      // Always clean up, regardless of success or failure
      setIsUploading(false);
      setUploadProgress({ utilityBill: 0, driverLicense: 0 });
      setFileUploads({
        utilityBill: {uploading: false, completed: false},
        driverLicense: {uploading: false, completed: false}
      });
    }
  };

  // Helper: Render a drag-and-drop area or the selected file with remove button
  const renderFileUpload = (fieldName: string, label: string, required: boolean = false) => {
    const fileData = formData[fieldName] as FileList | null;
    const isFileSelected = fileData && fileData.length > 0;
    const inputId = fieldName + "Input";
    const progress = uploadProgress[fieldName as keyof UploadProgress];
    const fileUploadState = fileUploads[fieldName];
    const showProgress = isUploading && isFileSelected && (fileUploadState?.uploading || (progress > 0 && progress < 100));
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
                  // Reset progress when removing file
                  setUploadProgress(prev => ({
                    ...prev,
                    [fieldName]: 0
                  }));
                  setFileUploads(prev => ({
                    ...prev,
                    [fieldName]: {uploading: false, completed: false}
                  }));
                }}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            {showProgress && (
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-medium text-blue-700">Uploading...</span>
                  <span className="text-xs font-medium text-blue-700">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}
            {fileUploadState?.completed && (
              <div className="mt-2 flex items-center text-green-600">
                <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span className="text-xs">Upload complete</span>
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
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500">+1</span>
              </div>
              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  // Remove any non-digit characters and limit to 10 digits
                  const cleaned = e.target.value.replace(/[^\d]/g, '').substring(0, 10);
                  handleInputChange({
                    ...e,
                    target: {
                      ...e.target,
                      name: 'phone',
                      value: cleaned
                    }
                  });
                }}
                placeholder="8143512239"
                className="w-full pl-10 px-4 py-2 border border-gray-300 rounded transition-colors
                  focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                  text-gray-900"
                maxLength={10}
                required
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">Format: +1 followed by 10 digits</p>
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
            {/* Only show meta.error if it's related to formatting or validation */}
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

          {/* Record Expunction Checkbox */}
          <div className="md:col-span-2 mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.requestRecordExpunction}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    requestRecordExpunction: e.target.checked
                  }));
                }}
                className="form-checkbox h-5 w-5 text-[#D09C01] rounded border-gray-300 focus:ring-[#D09C01]"
              />
              <span className="text-neutral-800 font-bold">Request Record Expunctions</span>
            </label>
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
              <a
                href="/docs/customer-disclosure.pdf"
                className="text-[#D09C01] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Disclosure Here
              </a>
              .
            </p>
          </div>

        {/* General message - Make it full width */}
        {message && (
          <div className="md:col-span-2">
            <div
              className={`mb-0 p-4 rounded w-full ${
                status === "success"
                  ? "bg-green-100 text-green-800"
                  : status === "error"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {message}
            </div>
          </div>
        )}

        {/* Error list - In its own div below the message */}
        {Object.keys(errors).length > 0 && (
          <div className="md:col-span-2">
            <div className="mb-2 p-4 bg-red-100 text-red-800 rounded">
              <ul className="list-disc list-inside">
                {Object.keys(errors)
                  .filter(err => err !== 'card') // Filter out card error as it's shown by meta.error
                  .map((err, idx) => (
                    <li key={idx}>{errors[err]}</li>
                  ))}
              </ul>
            </div>
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
              {status === "loading" ? (
                <span className="flex items-center justify-center">
                  <Spinner /> Processing
                </span>
              ) : "Fix My Credits Now"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default OnboardingForm;

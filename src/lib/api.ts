import axios, { AxiosInstance } from 'axios';

// Create axios instance with base URL from environment variable
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://lzx4063g-3003.inc1.devtunnels.ms',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a separate instance for file uploads with multipart/form-data
const fileApi: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://lzx4063g-3003.inc1.devtunnels.ms',
});

// Interface for credit repair request
export interface CreditRepairRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  referralCode?: string;
  address: string;
  socialSecurityNumber: string;
  dateofBirth: string;
  utilityBill: string;
  driverLicense: string;
  packageType: string;
  packagePrice: number;
  dataValue: string;
  dataDescriptor: string;
}

// Interface for visitor submission
export interface VisitorSubmission {
  email: string;
  fullName: string;
  phoneNumber: string;
  subject: string;
  description: string;
}

// Interface for file upload response
export interface FileUploadResponse {
  url: string;
  filename: string;
  isPublic: boolean;
}

// Function to submit credit repair request
export const submitCreditRepairRequest = async (data: CreditRepairRequest) => {
  try {
    const response = await api.post('/credit-repair-requests', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to submit credit repair request');
    }
    throw error;
  }
};

// Function to submit visitor request
export const submitVisitorRequest = async (data: VisitorSubmission) => {
  try {
    // Ensure phone number is properly formatted
    const formattedData = {
      ...data,
      phoneNumber: data.phoneNumber && data.phoneNumber.trim() !== '' ? 
        (data.phoneNumber.startsWith('+1') ? data.phoneNumber : `+1${data.phoneNumber}`) : 
        '+10000000000' // Default phone number if empty
    };
    
    console.log("Sending visitor submission to API:", formattedData);
    const response = await api.post('/credit-repair-requests/visitor-submission', formattedData);
    console.log("Visitor submission response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in submitVisitorRequest:", error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Failed to submit visitor request';
      console.error("API error details:", error.response?.data);
      throw new Error(errorMessage);
    }
    throw error;
  }
};

/**
 * Upload files to the server
 * @param files - Array of File objects to upload
 * @param isPublic - Whether the files should be publicly accessible
 * @returns Array of file URLs and metadata
 */
export const uploadFiles = async (files: File[], isPublic: boolean = false): Promise<FileUploadResponse[]> => {
  try {
    const formData = new FormData();
    
    // Append each file to the FormData object
    files.forEach(file => {
      formData.append('files', file);
    });
    
    // Add isPublic flag
    formData.append('isPublic', isPublic.toString());
    
    // Use fileApi instance which doesn't set Content-Type (browser will set it with boundary)
    const response = await fileApi.post('/media', formData);
    console.log("Response of upload -->",response)
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to upload files');
    }
    throw error;
  }
};
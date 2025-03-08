/**
 * API Types
 * 
 * This file contains TypeScript interfaces for API requests and responses.
 * Centralizing types makes them reusable across the application.
 */

/**
 * Standard credit repair request interface
 */
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

/**
 * Secure (encrypted) credit repair request interface
 */
export interface SecureCreditRepairRequest extends CreditRepairRequest {
  _encryptionKey: string; // RSA-encrypted AES key
  sessionId: string;     // Session ID for key retrieval on the server
}

/**
 * Visitor/contact submission interface
 */
export interface VisitorSubmission {
  email: string;
  fullName: string;
  phoneNumber: string;
  subject: string;
  description: string;
}

/**
 * File upload response interface
 */
export interface FileUploadResponse {
  url: string;
  filename: string;
  isPublic: boolean;
}

/**
 * Encryption keys response interface
 */
export interface EncryptionKeysResponse {
  publicKey: string;
  sessionId: string;
}

/**
 * New encrypted payload format as required by the backend
 */
export interface EncryptedPayload {
  encryptedAesKey: string; // RSA-encrypted AES key
  sessionId: string;      // Session ID for key retrieval on the server
  encryptedData: string;  // AES-encrypted JSON string of the entire data object
} 
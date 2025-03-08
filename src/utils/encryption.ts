/**
 * Encryption Utility Module
 * 
 * This module provides pure utility functions for encrypting sensitive data.
 * It implements a hybrid encryption approach using:
 * - RSA for encrypting the AES key (asymmetric encryption)
 * - AES for encrypting the actual data (symmetric encryption)
 * 
 * This approach provides strong security while maintaining performance.
 * 
 * The module is organized following the principle of separation of concerns.
 * All network/API calls are kept in the API module, while this module
 * focuses exclusively on encryption algorithms and data transformation.
 */

import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

/**
 * Encrypt sensitive data using hybrid encryption (RSA + AES)
 * 
 * @param data - Object containing data to encrypt
 * @param fieldsToEncrypt - Array of field names to encrypt
 * @param publicKey - RSA public key from server
 * @param sessionId - Session ID for the encryption session
 * @returns Encrypted data ready for transmission
 */
export const encryptFields = <T extends Record<string, any>, K extends keyof T>(
  data: T, 
  fieldsToEncrypt: readonly K[] | K[],
  publicKey: string,
  sessionId: string
): T & { _encryptionKey: string, sessionId: string } => {
  // Create a copy of the data including the session ID
  const encryptedData = { ...data, sessionId } as T & { _encryptionKey: string, sessionId: string };
  
  // Generate a random AES key (32 bytes = 256 bits)
  const aesKey = CryptoJS.lib.WordArray.random(32).toString();
  
  // Encrypt sensitive fields with AES
  fieldsToEncrypt.forEach(field => {
    if (typeof encryptedData[field] === 'string') {
      encryptedData[field] = CryptoJS.AES.encrypt(encryptedData[field] as string, aesKey).toString() as any;
    }
    // Handle numbers by converting to string first
    else if (typeof encryptedData[field] === 'number') {
      encryptedData[field] = CryptoJS.AES.encrypt(String(encryptedData[field]), aesKey).toString() as any;
    }
  });
  
  // Encrypt the AES key with RSA public key
  const rsaEncrypt = new JSEncrypt();
  rsaEncrypt.setPublicKey(publicKey);
  const encryptedAesKey = rsaEncrypt.encrypt(aesKey);
  
  if (!encryptedAesKey) {
    throw new Error('Failed to encrypt data securely');
  }
  
  // Add encrypted AES key to the transmission data
  encryptedData._encryptionKey = encryptedAesKey;
  
  return encryptedData;
};

/**
 * @deprecated Use encryptFields with proper keys from the server
 * Legacy function maintained for backward compatibility
 */
export const encryptData = (data: string): string => {
  if (!data) return data;
  
  // Log to error tracking service in production instead of console warnings
  
  try {
    return CryptoJS.AES.encrypt(data, 'deprecated-key').toString();
  } catch (error) {
    // Log to error tracking service in production instead of console errors
    return data; // Fallback to unencrypted data on error
  }
};

/**
 * @deprecated Decryption should happen server-side only
 * Legacy function maintained for backward compatibility
 */
export const decryptData = (encryptedData: string): string => {
  if (!encryptedData) return encryptedData;
  
  // Log to error tracking service in production instead of console warnings
  
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, 'deprecated-key');
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    // Log to error tracking service in production instead of console errors
    return encryptedData; // Return the original data on error
  }
};

/**
 * @deprecated Use secure encryption instead of hashing
 * Legacy function maintained for backward compatibility
 */
export const hashData = (data: string): string => {
  if (!data) return data;
  
  // Log to error tracking service in production instead of console warnings
  
  try {
    return CryptoJS.SHA256(data).toString();
  } catch (error) {
    // Log to error tracking service in production instead of console errors
    return data; // Fallback to original data on error
  }
}; 
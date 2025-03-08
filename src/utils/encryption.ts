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
import * as forge from 'node-forge';
import { EncryptedPayload } from '../types/api';

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
  try {
    if (!data) return data;
    
    // DEPRECATED: This uses a hard-coded key and is not secure
    // Only kept for backward compatibility with older code
    return CryptoJS.AES.encrypt(data, 'deprecated-key').toString();
  } catch (_error) {
    // Log to error tracking service in production instead of console
    return data; // Fallback to unencrypted data on error for backward compatibility
  }
};

/**
 * Decrypt data that was encrypted with the encryptData function
 * 
 * @deprecated Use secure encryption instead
 * @param encryptedData - The encrypted data string
 * @returns Decrypted data
 */
export const decryptData = (encryptedData: string): string => {
  if (!encryptedData) return encryptedData;
  
  try {
    // DEPRECATED: This uses a hard-coded key and is not secure
    // Only kept for backward compatibility with older code
    const bytes = CryptoJS.AES.decrypt(encryptedData, 'deprecated-key');
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (_error) {
    // Log to error tracking service in production instead of console
    return encryptedData; // Return the original data on error for backward compatibility
  }
};

/**
 * Hash data using SHA-256
 * 
 * @deprecated Use secure encryption instead of hashing
 * @param data - Data to hash
 * @returns Hashed data
 */
export const hashData = (data: string): string => {
  try {
    if (!data) return '';
    return CryptoJS.SHA256(data).toString();
  } catch (_error) {
    // Log to error tracking service in production instead of console
    return ''; // Return empty string on error
  }
};

/**
 * Encrypt the entire form data object using hybrid encryption (RSA + AES)
 * 
 * This function follows the backend's expected format:
 * {
 *   "encryptedAesKey": "encrypted_aes_key",
 *   "sessionId": "session_id",
 *   "encryptedData": "encrypted_data"
 * }
 * 
 * Uses OAEP padding for RSA encryption to match the backend's decryption method
 * 
 * @param data - Object containing all form data
 * @param publicKey - RSA public key from server
 * @param sessionId - Session ID for the encryption session
 * @returns Encrypted payload ready for transmission in the format required by the backend
 */
export const encryptFormData = (
  data: any,
  publicKey: string, 
  sessionId: string
): EncryptedPayload => {
  try {
    // Generate random AES key (32 bytes = 256 bits)
    const aesKey = CryptoJS.lib.WordArray.random(32).toString(CryptoJS.enc.Hex);
    
    // Convert data object to JSON string
    const jsonData = JSON.stringify(data);
    
    // Encrypt the entire data string with AES
    const encryptedData = CryptoJS.AES.encrypt(jsonData, aesKey).toString();
    
    // Use forge to encrypt the AES key with RSA-OAEP padding
    // First, convert the PEM format public key to forge's format
    const publicKeyForge = forge.pki.publicKeyFromPem(publicKey);
    
    // Encrypt the AES key with OAEP padding matching the backend's pkcs1_oaep scheme
    // Using SHA-1 as the hash function which is the default for pkcs1_oaep
    const encryptedAesKey = forge.util.encode64(
      publicKeyForge.encrypt(aesKey, 'RSA-OAEP', {
        md: forge.md.sha1.create(),
        mgf1: {
          md: forge.md.sha1.create()
        }
      })
    );
    
    // Return in the format expected by the backend
    return {
      encryptedAesKey,
      sessionId,
      encryptedData
    };
  } catch (_error) {
    // Log to error tracking service in production instead of console
    throw new Error('Failed to encrypt data securely');
  }
}; 
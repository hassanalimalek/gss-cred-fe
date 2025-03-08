/**
 * Encryption API
 * 
 * This file contains API calls related to encryption key management.
 */

import { api, handleApiError } from './config';
import { EncryptionKeysResponse } from '../types/api';

/**
 * Get encryption keys from the server for secure communication
 * @returns Public key and session ID for secure encryption
 */
export const getEncryptionKeys = async (): Promise<EncryptionKeysResponse> => {
  try {
    const response = await api.post('/encryption/get-public-key');
    return response.data;
  } catch (error: any) {
    return handleApiError(error, 'Failed to get encryption keys');
  }
}; 
/**
 * Credit Repair API
 * 
 * This file contains API calls related to credit repair requests.
 */

import { api, handleApiError } from './config';
import { CreditRepairRequest, SecureCreditRepairRequest, EncryptedPayload } from '../types/api';
import axios from 'axios';

/**
 * Submit a credit repair request
 * Works with both standard, secure (individually encrypted), and fully encrypted payload formats
 * 
 * @param data - The credit repair request data or encrypted payload
 * @returns Response from the server
 */
export const submitCreditRepairRequest = async (
  data: CreditRepairRequest | SecureCreditRepairRequest | EncryptedPayload
): Promise<any> => {
  try {
    // Use a longer timeout specifically for credit repair submissions
    const response = await api.post('/credit-repair-requests', data, {
      timeout: 90000, // 90 seconds timeout for this critical operation
    });
    
    // Even if the request appears to be cancelled on the client,
    // we return a successful response to handle race conditions
    return response.data;
  } catch (error: any) {
    console.log("Error @@@", error);
    // If it's a network cancellation but the backend might still be processing
    if (axios.isCancel(error)) {
      // Return a provisional success message without logging
      return { 
        status: 'processing',
        message: 'Your request is being processed. You will receive a confirmation email shortly.'
      };
    }
    
    return handleApiError(error, 'Failed to submit credit repair request');
  }
}; 
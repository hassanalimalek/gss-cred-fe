/**
 * Credit Repair API
 * 
 * This file contains API calls related to credit repair requests.
 */

import { api, handleApiError } from './config';
import { CreditRepairRequest, SecureCreditRepairRequest } from '../types/api';

/**
 * Submit a credit repair request
 * Works with both standard and secure (encrypted) requests
 * 
 * @param data - The credit repair request data
 * @returns Response from the server
 */
export const submitCreditRepairRequest = async (
  data: CreditRepairRequest | SecureCreditRepairRequest
): Promise<any> => {
  try {
    const response = await api.post('/credit-repair-requests', data);
    return response.data;
  } catch (error: any) {
    return handleApiError(error, 'Failed to submit credit repair request');
  }
}; 
/**
 * Tracking API
 * 
 * This file contains API calls related to tracking credit repair requests.
 */

import { api, handleApiError } from './config';
import { StatusTrackingResponse } from '../types/creditRepair';

/**
 * Get status information by tracking ID
 * @param trackingId - The tracking ID to look up
 * @returns Status tracking information
 */
export const getStatusByTrackingId = async (trackingId: string): Promise<StatusTrackingResponse> => {
  try {
    const response = await api.get(`/credit-repair-requests/track/${trackingId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to retrieve tracking information');
  }
};

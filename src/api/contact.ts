/**
 * Contact API
 * 
 * This file contains API calls related to contact form submissions.
 */

import { api, handleApiError } from './config';
import { VisitorSubmission } from '../types/api';

/**
 * Submit a visitor contact request
 * 
 * @param data - The visitor submission data
 * @returns Response from the server
 */
export const submitVisitorRequest = async (data: VisitorSubmission): Promise<any> => {
  try {
    const response = await api.post('/visitor-submissions', data);
    return response.data;
  } catch (error: any) {
    return handleApiError(error, 'Failed to submit contact request');
  }
}; 
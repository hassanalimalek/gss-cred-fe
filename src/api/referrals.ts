/**
 * Referrals API
 *
 * This file contains API calls related to the referral system.
 */

import { api, handleApiError } from './config';

/**
 * Validate a referral code
 * @param referralCode - The referral code to validate
 * @returns Whether the code is valid and referrer information if available
 */
export const validateReferralCode = async (referralCode: string): Promise<{
  valid: boolean;
  referrer?: {
    _id: string;
    fullName: string;
  };
}> => {
  try {
    const response = await api.post('/referrals/validate', { referralCode });
    return response.data;
  } catch (error) {
    // Handle the error but return a default value
    try {
      handleApiError(error, 'Failed to validate referral code');
    } catch (e) {
      // Suppress the error and return default value
    }
    return { valid: false };
  }
};

/**
 * Get a customer's referral code
 * @param customerId - The ID of the customer
 * @returns The customer's referral code
 */
export const getCustomerReferralCode = async (customerId: string): Promise<{
  referralCode: string;
}> => {
  try {
    const response = await api.get(`/referrals/customer/${customerId}/referral-code`);
    return response.data;
  } catch (error) {
    // Handle the error but return a default value
    try {
      handleApiError(error, 'Failed to get referral code');
    } catch (e) {
      // Suppress the error and return default value
    }
    return { referralCode: '' };
  }
};

/**
 * Get all referrals made by a customer with search and pagination
 * @param customerId - The ID of the customer
 * @param search - Optional search term to filter referrals
 * @param page - Page number (1-based)
 * @param limit - Number of items per page
 * @returns List of customers referred by this customer and pagination metadata
 */
export const getCustomerReferrals = async (
  customerId: string,
  search?: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  referrals: Array<{
    _id: string;
    fullName: string;
    email: string;
    signupDate: string;
    creditRepairRequests: number;
    package?: number;
    allPackages?: Array<{
      packagePrice: number;
    }>;
  }>;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/referrals/customer/${customerId}/referrals${queryString}`);
    return response.data;
  } catch (error) {
    // Handle the error but return a default value
    try {
      handleApiError(error, 'Failed to get customer referrals');
    } catch (e) {
      // Suppress the error and return default value
    }
    return {
      referrals: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      }
    };
  }
};

/**
 * Apply a referral code to a customer
 * @param customerId - The ID of the customer
 * @param referralCode - The referral code to apply
 * @returns Whether the operation was successful
 */
export const applyReferralCode = async (
  customerId: string,
  referralCode: string
): Promise<{
  success: boolean;
}> => {
  try {
    const response = await api.post(`/referrals/customer/${customerId}/apply`, {
      referralCode,
    });
    return response.data;
  } catch (error) {
    // Handle the error but return a default value
    try {
      handleApiError(error, 'Failed to apply referral code');
    } catch (e) {
      // Suppress the error and return default value
    }
    return { success: false };
  }
};

/**
 * Get referral statistics for admin dashboard
 * @returns Referral statistics
 */
export const getReferralStatistics = async (
  search?: string,
  page: number = 1,
  limit: number = 10
): Promise<{
  totalReferrals: number;
  activeReferrers: number;
  topReferrers: Array<{
    _id: string;
    fullName: string;
    email: string;
    referralCount: number;
    totalReferralAmount?: number;
  }>;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());

    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await api.get(`/referrals/statistics${queryString}`);
    return response.data;
  } catch (error) {
    // Handle the error but return a default value
    try {
      handleApiError(error, 'Failed to get referral statistics');
    } catch (e) {
      // Suppress the error and return default value
    }
    return {
      totalReferrals: 0,
      activeReferrers: 0,
      topReferrers: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0
      }
    };
  }
};

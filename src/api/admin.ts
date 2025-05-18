/**
 * Admin API Module
 *
 * This file contains API functions for admin-related operations
 * including authentication, fetching credit repair requests,
 * and updating application statuses.
 */

import { api, handleApiError } from './config';
import { AxiosError } from 'axios';

// Types
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface CreditRepairRequest {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  trackingId: string;
  currentStatus: number;
  statusText: string;
  createdAt: string;
  socialSecurityNumber: string;
  packagePrice: number;
  requestRecordExpunction: boolean;
  utilityBill: {
    _id: string;
    url: string;
    s3Key: string;
    mediaType: string;
    fileType: string;
  };
  driverLicense: {
    _id: string;
    url: string;
    s3Key: string;
    mediaType: string;
    fileType: string;
  };
  statusHistory: Array<{
    status: number;
    statusText: string;
    timestamp: string;
    updatedBy: string;
    userNotes?: string;
  }>;
}

export interface StatusUpdateRequest {
  newStatus: number;
  userNotes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Admin login function
 * @param credentials Admin login credentials
 * @returns Promise with login response containing token and user info
 */
export const adminLogin = async (credentials: AdminLoginRequest): Promise<AdminLoginResponse> => {
  try {
    console.log(" process.env.NEXT_PUBLIC_API_BASE_URL -->",process.env.NEXT_PUBLIC_API_BASE_URL)
    const response = await api.post('/admin/auth', credentials);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Login failed. Please try again later.');
  }
};

/**
 * Get all credit repair requests with pagination, sorting, filtering, and search
 * @param page Page number (default: 1)
 * @param limit Items per page (default: 10)
 * @param sortBy Field to sort by (default: 'createdAt')
 * @param sortOrder Sort order ('asc' or 'desc', default: 'desc')
 * @param filterStatus Filter by status (optional)
 * @param search Search query for name, email, or tracking ID (optional)
 * @returns Promise with paginated response of credit repair requests
 */
export const getCreditRepairRequests = async (
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  filterStatus?: number,
  search?: string
): Promise<PaginatedResponse<CreditRepairRequest>> => {
  try {
    const params: Record<string, string | number> = {
      page,
      limit,
      sortBy,
      sortOrder,
    };

    if (filterStatus !== undefined) {
      params.filterStatus = filterStatus;
    }

    if (search && search.trim() !== '') {
      params.search = search.trim();
    }

    console.log('Fetching credit repair requests with token:', localStorage.getItem('admin_token')?.substring(0, 20) + '...');

    const response = await api.get('/admin/credit-repair-requests', { params });
    console.log('Credit repair requests response:', response.status);
    return response.data;
  } catch (error) {
    console.error('Error fetching credit repair requests:', error);

    // Check if it's an authentication error
    if ((error as AxiosError).response?.status === 401) {
      // Don't throw here, just return empty data
      return {
        data: [],
        total: 0,
        page: 1,
        limit: 10
      };
    }

    // Use our centralized error handling for other errors
    return handleApiError(error, 'Failed to fetch credit repair requests');
  }
};

/**
 * Get a single credit repair request by ID
 * @param id Request ID
 * @returns Promise with credit repair request
 */
export const getCreditRepairRequestById = async (id: string): Promise<CreditRepairRequest> => {
  try {
    const response = await api.get(`/admin/credit-repair-requests/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to fetch credit repair request');
  }
};

/**
 * Update the status of a credit repair request
 * @param id Request ID
 * @param statusUpdate Status update data
 * @returns Promise with updated credit repair request
 */
export const updateCreditRepairStatus = async (
  id: string,
  statusUpdate: StatusUpdateRequest
): Promise<CreditRepairRequest> => {
  try {
    const response = await api.post(`/admin/credit-repair-requests/${id}/status`, statusUpdate);
    return response.data;
  } catch (error) {
    return handleApiError(error, 'Failed to update status');
  }
};

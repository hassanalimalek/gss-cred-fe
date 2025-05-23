import { apiClient } from '../client';

export interface Customer {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address?: string;
  socialSecurityNumber?: string;
  dateOfBirth?: string;
  referralCode?: string;
  referredBy?: string;
  referrals?: string[];
  creditRepairRequests: Array<{
    _id: string;
    trackingId: string;
    currentStatus: number;
    statusText: string;
    createdAt: string;
    packagePrice: number;
    requestRecordExpunction: boolean;
    transactionId: string;
    appliedReferralCode?: string;
    utilityBill?: {
      url: string;
      _id: string;
    };
    driverLicense?: {
      url: string;
      _id: string;
    };
    statusHistory?: Array<{
      status: number;
      statusText: string;
      timestamp: string;
      updatedBy: string;
      userNotes?: string;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerResponse {
  data: Customer[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Get all customers with pagination, sorting, and filtering
 */
export const getCustomers = async (
  page = 1,
  limit = 10,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  search?: string
): Promise<CustomerResponse> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  params.append('sortBy', sortBy);
  params.append('sortOrder', sortOrder);
  if (search) {
    params.append('search', search);
  }

  const response = await apiClient.get(`/admin/customers?${params.toString()}`);
  return response.data;
};

/**
 * Get a customer by ID
 */
export const getCustomerById = async (id: string): Promise<Customer> => {
  // Request customer data with pre-signed URLs for S3 objects
  const response = await apiClient.get(`/admin/customers/${id}`, {
    params: {
      presignedUrls: true // Add a query parameter to tell the backend to generate pre-signed URLs
    }
  });
  return response.data;
};

/**
 * Credit Repair Types
 *
 * This file contains TypeScript types and enums related to credit repair functionality.
 */

// Credit Repair Status Enum
export enum ECreditRepairStatus {
  GET_STARTED = 1,
  AUTHORIZE_CONNECT = 2,
  PARTNER_PROCESSING = 3,
  REPAIR_IN_PROGRESS = 4,
  CONFIRM_DELIVER = 5,
  REQUEST_DENIED = 6,
}

// Status descriptions for display
export const CREDIT_REPAIR_STATUS_TEXT = {
  [ECreditRepairStatus.GET_STARTED]: "Get Started",
  [ECreditRepairStatus.AUTHORIZE_CONNECT]: "Authorize & Connect",
  [ECreditRepairStatus.PARTNER_PROCESSING]: "Partner Processing",
  [ECreditRepairStatus.REPAIR_IN_PROGRESS]: "Repair in Progress",
  [ECreditRepairStatus.CONFIRM_DELIVER]: "Confirm & Deliver",
  [ECreditRepairStatus.REQUEST_DENIED]: "Request Denied",
};

// Detailed descriptions for each status
export const CREDIT_REPAIR_STATUS_DESCRIPTIONS = {
  [ECreditRepairStatus.GET_STARTED]: "Make your payment and schedule your consultation — your credit transformation begins here.",
  [ECreditRepairStatus.AUTHORIZE_CONNECT]: "Sign the required documents and provide access to your online credit accounts.",
  [ECreditRepairStatus.PARTNER_PROCESSING]: "Your case is transferred to our trusted experts at Melvin & Co. for thorough credit review and dispute preparation.",
  [ECreditRepairStatus.REPAIR_IN_PROGRESS]: "Melvin & Co. executes the dispute process, targeting negative items and working directly with credit bureaus.",
  [ECreditRepairStatus.CONFIRM_DELIVER]: "We verify results, ensure accuracy, and deliver your final documentation package.",
  [ECreditRepairStatus.REQUEST_DENIED]: "Your credit repair request could not be processed. Any payment made will be refunded. Please contact our support team for more information.",
};

// Status colors for UI display
export const CREDIT_REPAIR_STATUS_COLORS = {
  [ECreditRepairStatus.GET_STARTED]: "blue",
  [ECreditRepairStatus.AUTHORIZE_CONNECT]: "purple",
  [ECreditRepairStatus.PARTNER_PROCESSING]: "indigo",
  [ECreditRepairStatus.REPAIR_IN_PROGRESS]: "yellow",
  [ECreditRepairStatus.CONFIRM_DELIVER]: "green",
  [ECreditRepairStatus.REQUEST_DENIED]: "red",
};

// Credit Repair Request Status History Item
export interface StatusHistoryItem {
  status: number;
  statusText: string;
  timestamp: string;
  updatedBy: string;
  userNotes?: string;
}

// Credit Repair Request
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
  statusHistory: StatusHistoryItem[];
}

// Status Update Request
export interface StatusUpdateRequest {
  newStatus: number;
  userNotes: string;
}

// Status Tracking Response
export interface StatusTrackingResponse {
  customerName: string;
  submissionDate: string;
  currentStatus: number;
  statusText: string;
  statusHistory: Array<{
    status: number;
    statusText: string;
    timestamp: string;
    userNotes: string;
  }>;
  allStatuses: Array<{
    status: number;
    statusText: string;
    description: string;
  }>;
}

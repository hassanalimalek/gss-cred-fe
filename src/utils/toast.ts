import toast, { ToastOptions } from 'react-hot-toast';

// Default toast options for consistent styling
const defaultOptions: ToastOptions = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: '#fff',
    color: '#333',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
};

// Success toast with green styling
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    ...defaultOptions,
    style: {
      ...defaultOptions.style,
      background: '#f0fdf4', // Light green background
      border: '1px solid #86efac', // Green border
    },
    icon: '✅',
    ...options,
  });
};

// Error toast with red styling
export const showErrorToast = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    ...defaultOptions,
    style: {
      ...defaultOptions.style,
      background: '#fef2f2', // Light red background
      border: '1px solid #fca5a5', // Red border
    },
    icon: '❌',
    ...options,
  });
};

// Info toast with blue styling
export const showInfoToast = (message: string, options?: ToastOptions) => {
  return toast(message, {
    ...defaultOptions,
    style: {
      ...defaultOptions.style,
      background: '#eff6ff', // Light blue background
      border: '1px solid #93c5fd', // Blue border
    },
    icon: 'ℹ️',
    ...options,
  });
};

// Dismiss a specific toast by its ID
export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};

// Dismiss all toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};
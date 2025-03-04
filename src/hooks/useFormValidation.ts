import { useState, useCallback } from 'react';
import { showErrorToast } from '@/utils/toast';

/**
 * Custom hook for form validation
 * @returns Object with validation functions and state
 */
export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Validate an email address
   * @param email Email address to validate
   * @returns Boolean indicating validity
   */
  const validateEmail = useCallback((email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    if (!isValid) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return false;
    }
    
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.email;
      return newErrors;
    });
    
    return true;
  }, []);

  /**
   * Validate a phone number
   * @param phone Phone number to validate
   * @returns Boolean indicating validity
   */
  const validatePhone = useCallback((phone: string): boolean => {
    // Allow formats like: (123) 456-7890, 123-456-7890, 1234567890
    const phoneRegex = /^(\+\d{1,2}\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/;
    const isValid = phoneRegex.test(phone);
    
    if (!isValid) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number' }));
      return false;
    }
    
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.phone;
      return newErrors;
    });
    
    return true;
  }, []);

  /**
   * Validate a Social Security Number
   * @param ssn SSN to validate
   * @returns Boolean indicating validity
   */
  const validateSSN = useCallback((ssn: string): boolean => {
    // Format: XXX-XX-XXXX or XXXXXXXXX
    const ssnRegex = /^(?:\d{3}-\d{2}-\d{4}|\d{9})$/;
    const isValid = ssnRegex.test(ssn);
    
    if (!isValid) {
      setErrors(prev => ({ ...prev, ssn: 'Please enter a valid Social Security Number' }));
      return false;
    }
    
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.ssn;
      return newErrors;
    });
    
    return true;
  }, []);

  /**
   * Validate a credit card number using the Luhn algorithm
   * @param cardNumber Credit card number to validate
   * @returns Boolean indicating validity
   */
  const validateCreditCard = useCallback((cardNumber: string): boolean => {
    // Remove spaces and non-numeric characters
    const digitsOnly = cardNumber.replace(/\D/g, '');
    
    if (digitsOnly.length < 13 || digitsOnly.length > 19) {
      setErrors(prev => ({ ...prev, cardNumber: 'Invalid card number length' }));
      return false;
    }
    
    // Luhn algorithm (mod 10)
    let sum = 0;
    let shouldDouble = false;
    
    // Loop from right to left
    for (let i = digitsOnly.length - 1; i >= 0; i--) {
      let digit = parseInt(digitsOnly.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    const isValid = (sum % 10) === 0;
    
    if (!isValid) {
      setErrors(prev => ({ ...prev, cardNumber: 'Invalid card number' }));
      return false;
    }
    
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.cardNumber;
      return newErrors;
    });
    
    return true;
  }, []);

  /**
   * Generic required field validator
   * @param value Value to check
   * @param fieldName Field name for error message
   * @returns Boolean indicating if field has a value
   */
  const validateRequired = useCallback((value: string, fieldName: string): boolean => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, [fieldName]: `${fieldName} is required` }));
      return false;
    }
    
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
    
    return true;
  }, []);

  /**
   * Show validation errors as toasts
   */
  const showValidationErrors = useCallback(() => {
    if (Object.keys(errors).length > 0) {
      // Show only the first error as a toast to not overwhelm the user
      const firstError = Object.values(errors)[0];
      showErrorToast(firstError);
      return true;
    }
    return false;
  }, [errors]);

  /**
   * Clear all validation errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateEmail,
    validatePhone,
    validateSSN,
    validateCreditCard,
    validateRequired,
    showValidationErrors,
    clearErrors,
  };
}; 
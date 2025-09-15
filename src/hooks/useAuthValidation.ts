import { useState, useCallback } from 'react';

/**
 * Custom hook for managing authentication form validation and state
 */
export const useAuthValidation = () => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const setFieldError = useCallback((field: string, errorMessages: string[]) => {
    setErrors(prev => ({ ...prev, [field]: errorMessages }));
  }, []);

  const setFieldTouched = useCallback((field: string, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }));
  }, []);

  const hasErrors = Object.keys(errors).length > 0;
  const hasFieldError = useCallback((field: string) => {
    return errors[field] && errors[field].length > 0;
  }, [errors]);

  const getFieldErrors = useCallback((field: string) => {
    return errors[field] || [];
  }, [errors]);

  const isFieldTouched = useCallback((field: string) => {
    return touched[field] || false;
  }, [touched]);

  return {
    errors,
    touched,
    hasErrors,
    hasFieldError,
    getFieldErrors,
    isFieldTouched,
    clearErrors,
    clearFieldError,
    setFieldError,
    setFieldTouched
  };
};
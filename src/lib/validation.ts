/**
 * Validation utilities for authentication forms
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates email format using a robust regex pattern
 */
export const validateEmail = (email: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!email) {
    errors.push('Email is required');
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates password with security requirements
 */
export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
  } else {
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain at least one special character (@$!%*?&)');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates full name
 */
export const validateName = (name: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!name || !name.trim()) {
    errors.push('Full name is required');
  } else if (name.trim().length < 2) {
    errors.push('Full name must be at least 2 characters long');
  } else if (!/^[a-zA-Z\s]+$/.test(name)) {
    errors.push('Full name can only contain letters and spaces');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates password confirmation
 */
export const validatePasswordConfirmation = (password: string, confirmation: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!confirmation) {
    errors.push('Password confirmation is required');
  } else if (password !== confirmation) {
    errors.push('Passwords do not match');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Gets password strength score (0-5)
 */
export const getPasswordStrength = (password: string): {
  score: number;
  label: string;
  color: string;
} => {
  if (!password) return { score: 0, label: 'No password', color: 'text-gray-400' };
  
  let score = 0;
  
  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Character type checks
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;
  
  const labels = [
    { label: 'Very Weak', color: 'text-red-500' },
    { label: 'Weak', color: 'text-orange-500' },
    { label: 'Fair', color: 'text-yellow-500' },
    { label: 'Good', color: 'text-blue-500' },
    { label: 'Strong', color: 'text-green-500' },
    { label: 'Very Strong', color: 'text-green-600' }
  ];
  
  return {
    score,
    ...labels[Math.min(score, 5)]
  };
};

/**
 * Comprehensive form validation for sign up
 */
export const validateSignUpForm = (data: {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}): ValidationResult => {
  const allErrors: string[] = [];
  
  const nameValidation = validateName(data.name);
  const emailValidation = validateEmail(data.email);
  const passwordValidation = validatePassword(data.password);
  
  allErrors.push(...nameValidation.errors);
  allErrors.push(...emailValidation.errors);
  allErrors.push(...passwordValidation.errors);
  
  if (data.confirmPassword !== undefined) {
    const confirmValidation = validatePasswordConfirmation(data.password, data.confirmPassword);
    allErrors.push(...confirmValidation.errors);
  }
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

/**
 * Comprehensive form validation for sign in
 */
export const validateSignInForm = (data: {
  email: string;
  password: string;
}): ValidationResult => {
  const allErrors: string[] = [];
  
  if (!data.email) {
    allErrors.push('Email is required');
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(data.email)) {
    allErrors.push('Please enter a valid email address');
  }
  
  if (!data.password) {
    allErrors.push('Password is required');
  }
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};
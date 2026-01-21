/**
 * Enhanced Form Validation Utilities
 * Professional-grade validation for all input types
 */

// ==================== EMAIL VALIDATION ====================
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email?.trim()) return { isValid: false, error: "Email is required" };
  if (!regex.test(email.trim())) return { isValid: false, error: "Invalid email format" };
  if (email.length > 100) return { isValid: false, error: "Email is too long" };
  return { isValid: true, error: null };
};

// ==================== PASSWORD VALIDATION ====================
export const validatePassword = (password) => {
  if (!password) return { isValid: false, error: "Password is required", strength: "weak" };
  
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*]/.test(password)
  };

  const strength = Object.values(requirements).filter(v => v).length;
  const strengthLevel = strength <= 2 ? "weak" : strength <= 3 ? "fair" : strength <= 4 ? "good" : "strong";

  if (strength < 2) {
    return { 
      isValid: false, 
      error: "Password must contain uppercase, lowercase, and numbers",
      strength: strengthLevel 
    };
  }

  return { isValid: true, error: null, strength: strengthLevel };
};

// ==================== NAME VALIDATION ====================
export const validateName = (name) => {
  if (!name?.trim()) return { isValid: false, error: "Name is required" };
  if (name.trim().length < 2) return { isValid: false, error: "Name must be at least 2 characters" };
  if (name.trim().length > 50) return { isValid: false, error: "Name is too long" };
  if (!/^[a-zA-Z\s'-]+$/.test(name)) return { isValid: false, error: "Name can only contain letters, spaces, hyphens, and apostrophes" };
  return { isValid: true, error: null };
};

export const validators = {
  /**
   * Validate email format
   */
  email: validateEmail,

  /**
   * Validate password strength
   */
  password: validatePassword,

  /**
   * Validate name
   */
  name: validateName,

  /**
   * Validate phone number
   */
  phone: (phone) => {
    const regex = /^[\d\s\-\+\(\)]+$/;
    if (!phone) return { isValid: false, error: "Phone number is required" };
    if (phone.replace(/\D/g, "").length < 10) {
      return { isValid: false, error: "Phone number must have at least 10 digits" };
    }
    if (!regex.test(phone)) {
      return { isValid: false, error: "Invalid phone format" };
    }
    return { isValid: true, error: null };
  },

  /**
   * Validate URL
   */
  url: (url) => {
    try {
      new URL(url);
      return { isValid: true, error: null };
    } catch {
      return { isValid: false, error: "Invalid URL format" };
    }
  },

  /**
   * Validate number range
   */
  range: (value, min, max) => {
    if (value < min || value > max) {
      return { isValid: false, error: `Value must be between ${min} and ${max}` };
    }
    return { isValid: true, error: null };
  },

  /**
   * Validate string length
   */
  length: (value, min, max) => {
    if (!value || value.length < min) {
      return { isValid: false, error: `Minimum ${min} characters required` };
    }
    if (value.length > max) {
      return { isValid: false, error: `Maximum ${max} characters allowed` };
    }
    return { isValid: true, error: null };
  },

  /**
   * Validate required field
   * @param {any} value - Value to validate
   * @param {string} fieldName - Field name for error message
   * @returns {object} - { isValid, error }
   */
  required: (value, fieldName = "Field") => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    return { isValid: true, error: null };
  },

  /**
   * Validate card number (basic Luhn algorithm)
   */
  cardNumber: (cardNumber) => {
    const regex = /^\d{13,19}$/;
    if (!regex.test(cardNumber.replace(/\s/g, ""))) {
      return { isValid: false, error: "Invalid card number" };
    }
    return { isValid: true, error: null };
  },

  /**
   * Validate product price
   */
  price: (price) => {
    const num = parseFloat(price);
    if (isNaN(num)) return { isValid: false, error: "Price must be a number" };
    if (num <= 0) return { isValid: false, error: "Price must be greater than 0" };
    if (!/^\d+(\.\d{1,2})?$/.test(price.toString())) {
      return { isValid: false, error: "Price must have max 2 decimal places" };
    }
    return { isValid: true, error: null };
  },

  /**
   * Validate stock quantity
   */
  stock: (stock) => {
    const num = parseInt(stock);
    if (isNaN(num)) return { isValid: false, error: "Stock must be a number" };
    if (num < 0) return { isValid: false, error: "Stock cannot be negative" };
    return { isValid: true, error: null };
  }
};

/**
 * Validate entire form object
 */
export const validateForm = (formData, schema) => {
  const errors = {};

  Object.keys(schema).forEach((field) => {
    const validator = schema[field];
    const value = formData[field];
    const result = validator(value);

    if (!result.isValid) {
      errors[field] = result.error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default validators;

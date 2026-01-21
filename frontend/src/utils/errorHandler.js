/**
 * Enhanced API Error Handler & Logger
 * Standardized error handling for all API calls
 */

// ==================== ERROR TYPES ====================
export const ERROR_TYPES = {
  NETWORK: "NETWORK_ERROR",
  TIMEOUT: "TIMEOUT_ERROR",
  VALIDATION: "VALIDATION_ERROR",
  AUTHENTICATION: "AUTHENTICATION_ERROR",
  AUTHORIZATION: "AUTHORIZATION_ERROR",
  NOT_FOUND: "NOT_FOUND_ERROR",
  SERVER: "SERVER_ERROR",
  UNKNOWN: "UNKNOWN_ERROR"
};

// ==================== ERROR MESSAGES ====================
const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  TIMEOUT_ERROR: "Request timeout. Please try again.",
  VALIDATION_ERROR: "Please check your input and try again.",
  AUTHENTICATION_ERROR: "Please log in to continue.",
  AUTHORIZATION_ERROR: "You don't have permission to perform this action.",
  NOT_FOUND_ERROR: "The requested resource was not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNKNOWN_ERROR: "An unexpected error occurred. Please try again."
};

// ==================== LOG LEVELS ====================
export const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

let logLevel = process.env.NODE_ENV === 'development' ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN;

/**
 * Logger utility
 */
export const logger = {
  debug: (message, data) => {
    if (logLevel <= LOG_LEVELS.DEBUG) {
      console.log(`🔍 [DEBUG] ${message}`, data);
    }
  },
  
  info: (message, data) => {
    if (logLevel <= LOG_LEVELS.INFO) {
      console.log(`ℹ️ [INFO] ${message}`, data);
    }
  },
  
  warn: (message, data) => {
    if (logLevel <= LOG_LEVELS.WARN) {
      console.warn(`⚠️ [WARN] ${message}`, data);
    }
  },
  
  error: (message, error) => {
    if (logLevel <= LOG_LEVELS.ERROR) {
      console.error(`❌ [ERROR] ${message}`, error);
    }
  }
};

/**
 * Parse API error response
 */
export const parseApiError = (error) => {
  let errorType = ERROR_TYPES.UNKNOWN;
  let errorMessage = ERROR_MESSAGES.UNKNOWN_ERROR;
  let statusCode = 0;
  let details = null;

  // Network error or no response
  if (!error.response) {
    if (error.code === 'ECONNABORTED') {
      errorType = ERROR_TYPES.TIMEOUT;
      errorMessage = ERROR_MESSAGES.TIMEOUT_ERROR;
    } else if (error.message === 'Network Error') {
      errorType = ERROR_TYPES.NETWORK;
      errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
    }
    return { errorType, errorMessage, statusCode };
  }

  statusCode = error.response.status;

  // HTTP error responses
  switch (statusCode) {
    case 400:
      errorType = ERROR_TYPES.VALIDATION;
      errorMessage = error.response.data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
      details = error.response.data?.errors;
      break;
    case 401:
      errorType = ERROR_TYPES.AUTHENTICATION;
      errorMessage = ERROR_MESSAGES.AUTHENTICATION_ERROR;
      break;
    case 403:
      errorType = ERROR_TYPES.AUTHORIZATION;
      errorMessage = ERROR_MESSAGES.AUTHORIZATION_ERROR;
      break;
    case 404:
      errorType = ERROR_TYPES.NOT_FOUND;
      errorMessage = ERROR_MESSAGES.NOT_FOUND_ERROR;
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      errorType = ERROR_TYPES.SERVER;
      errorMessage = ERROR_MESSAGES.SERVER_ERROR;
      break;
    default:
      errorMessage = error.response.data?.message || ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  return { errorType, errorMessage, statusCode, details };
};

/**
 * Legacy function for backward compatibility
 */
export const getErrorMessage = (error) => {
  const parsed = parseApiError(error);
  return parsed.errorMessage;
};

/**
 * Format error object for form display
 * @param {object} error - Error object from API
 * @returns {object} - Formatted errors by field
 */
export const formatFieldErrors = (error) => {
  const errors = {};

  if (error.response?.data?.errors) {
    if (Array.isArray(error.response.data.errors)) {
      // If array, convert to field-based object
      error.response.data.errors.forEach((err, index) => {
        errors[`field_${index}`] = err;
      });
    } else if (typeof error.response.data.errors === "object") {
      // If object, use as-is
      Object.assign(errors, error.response.data.errors);
    }
  }

  return errors;
};

/**
 * Check if error is recoverable
 * @param {object} error - Error object
 * @returns {boolean} - True if user can retry
 */
export const isRecoverableError = (error) => {
  const status = error.response?.status;
  // 429 = Too Many Requests, 5xx = Server errors (can retry)
  return status === 429 || (status >= 500 && status < 600) || error.message === "Network Error";
};

/**
 * Get retry delay in milliseconds
 * @param {number} attempt - Attempt number (1-based)
 * @returns {number} - Delay in ms with exponential backoff
 */
export const getRetryDelay = (attempt) => {
  return Math.min(1000 * Math.pow(2, attempt - 1), 10000);
};

/**
 * Retry failed API call with exponential backoff
 * @param {function} apiCall - The API function to retry
 * @param {number} maxAttempts - Maximum number of attempts
 * @returns {Promise} - Result of API call
 */
export const retryApiCall = async (apiCall, maxAttempts = 3) => {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;

      if (!isRecoverableError(error) || attempt === maxAttempts) {
        throw error;
      }

      const delay = getRetryDelay(attempt);
      console.warn(`Retry attempt ${attempt}/${maxAttempts} after ${delay}ms`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
};

export default { getErrorMessage, formatFieldErrors, isRecoverableError, retryApiCall };

import { useState, useCallback } from 'react';

const useErrorHandler = () => {
  const [errors, setErrors] = useState([]);

  const addError = useCallback((error, context = {}) => {
    const errorId = `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    let errorMessage = 'An unexpected error occurred';
    let errorDetails = null;

    // Parse different error types
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error?.message) {
      errorMessage = error.message;
      errorDetails = {
        stack: error.stack,
        name: error.name,
        ...context
      };
    } else if (error?.response) {
      // API Error
      errorMessage = error.response.data?.message || `HTTP ${error.response.status}: ${error.response.statusText}`;
      errorDetails = {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.response.config?.url,
        method: error.response.config?.method,
        data: error.response.data,
        ...context
      };
    } else if (error?.request) {
      // Network Error
      errorMessage = 'Network error - please check your connection';
      errorDetails = {
        type: 'network_error',
        url: error.request.responseURL,
        ...context
      };
    }

    const errorObj = {
      id: errorId,
      message: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString(),
      context
    };

    // Log to console for debugging
    console.error('Error Handler:', errorObj);

    // Add to errors array
    setErrors(prev => [...prev, errorObj]);

    // Send to monitoring service (if available)
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: errorMessage,
        fatal: false,
        error_id: errorId
      });
    }

    return errorId;
  }, []);

  const removeError = useCallback((errorId) => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // API Error Handler
  const handleApiError = useCallback((error, context = {}) => {
    let message = 'API request failed';
    
    if (error?.response?.status === 401) {
      message = 'Authentication required - please login again';
    } else if (error?.response?.status === 403) {
      message = 'Access denied - insufficient permissions';
    } else if (error?.response?.status === 404) {
      message = 'Resource not found';
    } else if (error?.response?.status === 422) {
      message = 'Validation error - please check your input';
    } else if (error?.response?.status >= 500) {
      message = 'Server error - please try again later';
    } else if (error?.response?.data?.message) {
      message = error.response.data.message;
    }

    return addError(error, { type: 'api_error', ...context });
  }, [addError]);

  // Form Validation Error Handler
  const handleValidationError = useCallback((fieldErrors, context = {}) => {
    const message = 'Please fix the following errors:';
    const details = fieldErrors;
    
    return addError({ message, details }, { type: 'validation_error', ...context });
  }, [addError]);

  // Network Error Handler
  const handleNetworkError = useCallback((context = {}) => {
    const message = 'Network connection failed - please check your internet connection';
    return addError({ message }, { type: 'network_error', ...context });
  }, [addError]);

  return {
    errors,
    addError,
    removeError,
    clearErrors,
    handleApiError,
    handleValidationError,
    handleNetworkError
  };
};

export default useErrorHandler;

import { useToast } from "@/hooks/use-toast";

export interface APIError {
  message: string;
  status: number;
  code?: string;
  details?: any;
}

export class AppError extends Error {
  status: number;
  code?: string;
  details?: any;

  constructor(message: string, status: number = 500, code?: string, details?: any) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export const createAPIError = (response: Response, data?: any): AppError => {
  let message = 'An unexpected error occurred';
  
  if (data?.message) {
    message = data.message;
  } else {
    switch (response.status) {
      case 400:
        message = 'Invalid request. Please check your input.';
        break;
      case 401:
        message = 'Authentication required. Please log in.';
        break;
      case 403:
        message = 'Access denied. You do not have permission.';
        break;
      case 404:
        message = 'Resource not found.';
        break;
      case 429:
        message = 'Too many requests. Please try again later.';
        break;
      case 500:
        message = 'Server error. Please try again later.';
        break;
      case 503:
        message = 'Service unavailable. Please try again later.';
        break;
    }
  }

  return new AppError(message, response.status, data?.code, data?.details);
};

export const handleAPIError = (error: unknown, toast: ReturnType<typeof useToast>['toast']) => {
  console.error('API Error:', error);

  if (error instanceof AppError) {
    toast({
      title: "Error",
      description: error.message,
      variant: "destructive",
    });
    return error;
  }

  if (error instanceof Error) {
    toast({
      title: "Error",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    });
    return new AppError(error.message);
  }

  const fallbackError = new AppError("An unexpected error occurred");
  toast({
    title: "Error",
    description: fallbackError.message,
    variant: "destructive",
  });
  
  return fallbackError;
};

export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  toast: ReturnType<typeof useToast>['toast']
) => {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      handleAPIError(error, toast);
      return null;
    }
  };
};

// Network error handling
export const isNetworkError = (error: unknown): boolean => {
  return error instanceof TypeError && error.message.includes('fetch');
};

export const handleNetworkError = (toast: ReturnType<typeof useToast>['toast']) => {
  toast({
    title: "Connection Error",
    description: "Unable to connect to the server. Please check your internet connection.",
    variant: "destructive",
  });
};

// Validation error helpers
export const formatValidationErrors = (errors: Record<string, string[]>): string => {
  return Object.entries(errors)
    .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
    .join('\n');
};

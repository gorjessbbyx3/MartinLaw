import { AppError, createAPIError, isNetworkError } from "./error-handling";

const API_BASE_URL = "/api";

// Rate limiting
const requestCounts = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;

const checkRateLimit = (endpoint: string): boolean => {
  const now = Date.now();
  const key = endpoint;
  const record = requestCounts.get(key);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    requestCounts.set(key, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count++;
  return true;
};

// Request timeout
const createTimeoutPromise = (timeoutMs: number = 30000): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
  });
};

// Retry mechanism
const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: any,
  options: {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
  } = {}
): Promise<Response> {
  const { timeout = 30000, retries = 3, retryDelay = 1000 } = options;

  // Check rate limit
  if (!checkRateLimit(endpoint)) {
    throw new AppError('Too many requests. Please try again later.', 429);
  }

  const token = localStorage.getItem("auth_token");

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      // Security headers
      "X-Requested-With": "XMLHttpRequest",
      "Cache-Control": "no-cache",
    },
    credentials: "same-origin",
  };

  if (data && (method === "POST" || method === "PUT" || method === "PATCH")) {
    // Input sanitization
    const sanitizedData = sanitizeInput(data);
    config.body = JSON.stringify(sanitizedData);
  }

  let lastError: Error;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const fetchPromise = fetch(`${API_BASE_URL}${endpoint}`, config);
      const timeoutPromise = createTimeoutPromise(timeout);

      const response = await Promise.race([fetchPromise, timeoutPromise]);

      // Handle different response statuses
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }
        throw createAPIError(response, errorData);
      }

      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');

      // Don't retry on certain errors
      if (error instanceof AppError) {
        if (error.status === 401 || error.status === 403 || error.status === 404) {
          throw error;
        }
      }

      // Don't retry network errors on last attempt
      if (attempt === retries) {
        if (isNetworkError(error)) {
          throw new AppError('Network error. Please check your connection.', 0);
        }
        throw lastError;
      }

      // Wait before retry
      await sleep(retryDelay * Math.pow(2, attempt)); // Exponential backoff
    }
  }

  throw lastError!;
}

// Input sanitization
const sanitizeInput = (data: any): any => {
  if (typeof data === 'string') {
    return data.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  }

  if (data && typeof data === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }

  return data;
};

// Secure API helper for authenticated requests
export async function secureApiRequest(
  method: string,
  endpoint: string,
  data?: any,
  options?: Parameters<typeof apiRequest>[3]
): Promise<any> {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    throw new AppError('Authentication required', 401);
  }

  const response = await apiRequest(method, endpoint, data, options);

  try {
    return await response.json();
  } catch {
    return null;
  }
}

// File upload helper
export async function uploadFile(
  endpoint: string,
  file: File,
  additionalData?: Record<string, any>
): Promise<any> {
  const token = localStorage.getItem("auth_token");

  if (!token) {
    throw new AppError('Authentication required', 401);
  }

  // Validate file
  if (file.size > 10 * 1024 * 1024) { // 10MB limit
    throw new AppError('File size exceeds 10MB limit', 400);
  }

  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new AppError('File type not allowed', 400);
  }

  const formData = new FormData();
  formData.append('file', file);

  if (additionalData) {
    for (const [key, value] of Object.entries(additionalData)) {
      formData.append(key, value);
    }
  }

  const config: RequestInit = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Requested-With": "XMLHttpRequest",
    },
    body: formData,
    credentials: "same-origin",
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    throw createAPIError(response, errorData);
  }

  return await response.json();
}
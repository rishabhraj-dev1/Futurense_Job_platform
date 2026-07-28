import { API_URL } from "./constants";
import { getToken } from "./auth";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

async function fetchApi<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options;
  const token = getToken();

  let url = `${API_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const config: RequestInit = {
    ...customConfig,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  // Handle FormData
  if (customConfig.body instanceof FormData) {
    // Remove content-type so browser sets it with boundary
    const { "Content-Type": _, ...restHeaders } = config.headers as any;
    config.headers = restHeaders;
  }

  try {
    const response = await fetch(url, config);
    
    let data;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new ApiError(
        response.status,
        data?.detail || data?.message || "An error occurred",
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, error instanceof Error ? error.message : "Network error");
  }
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    fetchApi<T>(endpoint, { ...options, method: "GET" }),
  
  post: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
    
  put: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    fetchApi<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
    
  delete: <T>(endpoint: string, options?: RequestOptions) =>
    fetchApi<T>(endpoint, { ...options, method: "DELETE" }),
};

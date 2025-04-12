import axios, { AxiosRequestConfig } from "axios";
import { cookies } from "next/headers";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 seconds timeout
});

export const apiRequest = async <T>(
  endpoint: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    [key: string]: any;
  } = {}
): Promise<T> => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    // Convert fetch-style options to axios config
    const config: AxiosRequestConfig = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...(options.headers || {}),
      },
      // Handle body data - convert from fetch-style body to axios data
      ...(options.body && { data: options.body }),
    };

    // Remove body from config to avoid axios warnings
    delete options.body;
    delete options.method;
    delete options.headers;

    // Add any remaining options to config
    Object.assign(config, options);

    // Make the request
    const response = await axiosInstance(endpoint, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Format error similar to fetch error
      throw new Error(
        `API error: ${error.response?.statusText || error.message}`
      );
    }
    throw error;
  }
};

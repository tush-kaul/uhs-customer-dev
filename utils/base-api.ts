import axios, { AxiosInstance } from "axios";

// Constants

export const CACHE_MAX_AGE = 300; // Cache for 5 minutes (300 seconds)

// Create an axios instance with default configuration
export const api: AxiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 5000, // Add a reasonable timeout
});

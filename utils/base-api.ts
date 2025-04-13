import axios, { AxiosInstance } from "axios";

// Constants
const BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL ||
	"http://ec2-3-28-58-24.me-central-1.compute.amazonaws.com/api/v1";
export const CACHE_MAX_AGE = 300; // Cache for 5 minutes (300 seconds)

// Create an axios instance with default configuration
export const api: AxiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 5000, // Add a reasonable timeout
});

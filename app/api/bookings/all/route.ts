/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { headers } from "next/headers";

// Base URL for API requests
const BASE_URL =
	"http://ec2-3-28-58-24.me-central-1.compute.amazonaws.com/api/v1";

// Create axios instance with optimized configuration
const api = axios.create({
	baseURL: BASE_URL,
	timeout: 10000, // 10 seconds timeout
	headers: {
		"Content-Type": "application/json",
	},
});

interface ResidenceDurationMap {
	[key: string]: number;
}

// Residence duration mapping - kept for reference even though not used in this function
const residenceDurationMap: ResidenceDurationMap = {
	Studio: 45,
	"1BHK Apartment": 60,
	"1BHK + Study Room": 90,
	"2BHK Apartment": 120,
	"2BHK Townhouse": 150,
	"3BHK Apartment": 150,
	"3BHK Townhouse": 180,
	"3BHK Villa": 210,
	"4BHK Apartment": 210,
	"4BHK Villa": 240,
	"5BHK Apartment": 300,
	"5BHK Villa": 300,
};

/**
 * Fetch user services bookings with axios
 * @param token Auth token for API request
 * @returns User services data
 */
async function fetchUserServices(token: string) {
	try {
		const response = await api.get("/bookings/user-services", {
			headers: {
				authorization: token,
			},
		});

		return response.data.data || [];
	} catch (error) {
		if (axios.isAxiosError(error)) {
			throw new Error(
				`Failed to fetch user services: ${error.response?.status} ${
					error.response?.statusText || error.message
				}`
			);
		}
		throw error;
	}
}

/**
 * GET endpoint for user services
 */
export async function GET(req: NextRequest) {
	try {
		// Get authorization header
		const headersList = await headers();
		const token = headersList.get("Authorization");

		if (!token) {
			return NextResponse.json(
				{ success: false, message: "Authorization token is required" },
				{ status: 401 }
			);
		}

		// Fetch user services data
		const userServices = await fetchUserServices(token);

		// Return response
		return NextResponse.json(
			{
				success: true,
				message: "User services fetched successfully",
				data: userServices,
			},
			{
				headers: {
					// Add cache control headers to improve performance for repeated requests
					"Cache-Control": "private, max-age=60", // Cache for 1 minute
				},
			}
		);
	} catch (error: any) {
		console.error("Error fetching user services:", error);

		return NextResponse.json(
			{ success: false, message: error.message || "An error occurred" },
			{ status: error.statusCode || 500 }
		);
	}
}

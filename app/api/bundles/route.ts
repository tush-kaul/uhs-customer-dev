/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/bundles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { api, CACHE_MAX_AGE } from "@/utils/base-api";
import axios from "axios";

// Cache implementation with TTL
const bundlesCache: Record<string, any> = {};
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Function to fetch bundles from API or cache
 * @param requestData Request payload containing bundle criteria
 * @returns Array of suggested bundles
 */
async function fetchBundles(requestData: any) {
  try {
    // Generate cache key from request data
    const cacheKey = JSON.stringify(requestData);

    // Return cached result if available and not expired
    if (
      bundlesCache[cacheKey] &&
      bundlesCache[cacheKey].timestamp > Date.now() - CACHE_TTL
    ) {
      return bundlesCache[cacheKey].data;
    }

    // Make API request with axios
    const response = await api.post("/bundles", requestData);

    // Extract bundle data
    const bundles = response.data.suggestedBundles || [];

    // Store in cache
    bundlesCache[cacheKey] = {
      data: bundles,
      timestamp: Date.now(),
    };

    return bundles;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching bundles:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      throw new Error(
        `Failed to fetch bundles: ${error.response?.status} ${
          error.response?.statusText || error.message
        }`
      );
    }
    console.error("Error fetching bundles:", error);
    throw error;
  }
}

/**
 * Validate bundle request data
 * @param body Request body to validate
 * @returns Array of missing fields or empty array if valid
 */
function validateBundleRequest(body: any): string[] {
  const requiredFields = [
    "startDate",
    "location",
    "frequency",
    "servicePeriod",
    "serviceType",
    "duration",
  ];
  return requiredFields.filter((field) => !body[field]);
}

/**
 * POST endpoint for bundles
 */
export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const missingFields = validateBundleRequest(body);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields in the request body: ${missingFields.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }

    // Fetch bundles using the provided criteria
    const bundles = await fetchBundles(body);

    // Return successful response with cache control headers
    return NextResponse.json(
      {
        success: true,
        message: "Bundles fetched successfully",
        data: bundles,
      },
      {
        headers: {
          "Cache-Control": "private, max-age=300", // Cache for 5 minutes
        },
      }
    );
  } catch (error: any) {
    console.error("Error in bundles API:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "An error occurred while fetching bundles",
      },
      { status: error.statusCode || 500 }
    );
  }
}

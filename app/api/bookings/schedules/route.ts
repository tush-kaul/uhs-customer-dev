/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { api, CACHE_MAX_AGE } from "@/utils/base-api";
import axios from "axios";

// Cache for team availabilities to reduce redundant API calls
const availabilitiesCache: Record<string, any> = {};

/**
 * Function to fetch team availabilities by IDs
 * @param data Request payload containing IDs
 * @returns Team availabilities data
 */
async function fetchTeamAvailabilities(data: { ids: string[] }) {
  try {
    // Generate cache key from sorted IDs array for consistency
    const cacheKey = data.ids.sort().join(",");

    // Return from cache if available and not expired
    if (
      availabilitiesCache[cacheKey] &&
      availabilitiesCache[cacheKey].timestamp > Date.now() - 5 * 60 * 1000
    ) {
      return availabilitiesCache[cacheKey].data;
    }

    // Make the API request with axios
    const response = await api.post("/team-availability/all-by-ids", data);

    // Store result in cache with timestamp
    availabilitiesCache[cacheKey] = {
      data: response.data,
      timestamp: Date.now(),
    };

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching team availabilities:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      throw new Error(
        `Failed to fetch team availabilities: ${error.response?.status} ${
          error.response?.statusText || error.message
        }`
      );
    }
    console.error("Error fetching team availabilities:", error);
    throw error;
  }
}

/**
 * POST endpoint for team availabilities
 */
export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const body = await req.json();

    // Validate required fields
    if (!body.ids || !Array.isArray(body.ids) || body.ids.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing or invalid 'ids' field in request body. Expected non-empty array.",
        },
        { status: 400 }
      );
    }

    // Fetch team availabilities
    const result = await fetchTeamAvailabilities(body);

    // Return successful response with cache control headers
    return NextResponse.json(
      {
        success: true,
        message: "Team availabilities fetched successfully",
        data: result,
      },
      {
        headers: {
          "Cache-Control": "private, max-age=300", // Cache for 5 minutes
        },
      }
    );
  } catch (error: any) {
    console.error("Error in team availabilities API:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error.message ||
          "An error occurred while fetching team availabilities",
      },
      { status: error.statusCode || 500 }
    );
  }
}

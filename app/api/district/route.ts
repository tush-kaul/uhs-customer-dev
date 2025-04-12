/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { api } from "@/utils/base-api";

/**
 * Fetch districts with optional area filter
 * @param areaId Optional area ID to filter districts
 * @returns Array of districts
 */
async function fetchDistricts(areaId?: string | null) {
  try {
    // Use query params object for cleaner URL construction
    const params: Record<string, string> = {};
    if (areaId) {
      params.areaId = areaId;
    }

    const response = await api.get("/districts", { params });
    return response.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;
      throw new Error(`Failed to fetch districts: ${message} (${status})`);
    }
    throw error; // Re-throw if it's not an Axios error
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const areaId = searchParams.get("areaId");

    const districts = await fetchDistricts(areaId);

    // Create response with the data
    const response = NextResponse.json({
      success: true,
      message: "Districts fetched successfully",
      data: districts,
    });

    // Add cache control headers
    // Districts data may change more frequently than areas
    response.headers.set(
      "Cache-Control",
      "public, max-age=180, stale-while-revalidate=60"
    );

    return response;
  } catch (error: any) {
    console.error("Error fetching districts:", error);

    // Determine appropriate status code
    const statusCode = error.message.includes("404") ? 404 : 500;

    return NextResponse.json(
      { success: false, message: error.message },
      { status: statusCode }
    );
  }
}

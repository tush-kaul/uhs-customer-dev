/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosInstance } from "axios";

import { api, CACHE_MAX_AGE } from "@/utils/base-api";

/**
 * Fetch properties with optional district filter
 * @param districtId Optional district ID to filter properties
 * @returns Array of properties
 */
async function fetchProperties(districtId?: string | null) {
  try {
    // Use query params object for cleaner URL construction
    const params: Record<string, string> = {};
    if (districtId) {
      params.districtId = districtId;
    }

    const response = await api.get("/properties", { params });
    return response.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;
      throw new Error(`Failed to fetch properties: ${message} (${status})`);
    }
    throw error; // Re-throw if it's not an Axios error
  }
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const districtId = searchParams.get("districtId");

    const properties = await fetchProperties(districtId);

    return NextResponse.json({
      success: true,
      message: "Properties fetched successfully",
      data: properties,
    });
  } catch (error: any) {
    console.error("Error fetching properties:", error);

    // Determine appropriate status code
    const statusCode = error.message.includes("404") ? 404 : 500;

    return NextResponse.json(
      { success: false, message: error.message },
      { status: statusCode }
    );
  }
}

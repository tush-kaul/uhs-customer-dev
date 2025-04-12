/* eslint-disable @typescript-eslint/no-explicit-any */
import { api, CACHE_MAX_AGE } from "@/utils/base-api";
import axios from "axios";
import { NextResponse } from "next/server";

/**
 * Fetch all areas from the API
 * @returns Array of areas
 */
async function fetchAreas() {
  try {
    const response = await api.get("/areas/");
    return response.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;
      throw new Error(`Failed to fetch areas: ${message} (${status})`);
    }
    throw error; // Re-throw if it's not an Axios error
  }
}

export async function GET() {
  try {
    const areas = await fetchAreas();

    // Create response with the data
    const response = NextResponse.json({
      success: true,
      message: "Areas fetched successfully",
      data: areas,
    });

    // Add cache control headers
    // public: can be cached by browsers and shared caches
    // max-age: how long the response remains fresh (in seconds)
    // stale-while-revalidate: allows serving stale content while fetching fresh content
    response.headers.set(
      "Cache-Control",
      `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=60`
    );

    return response;
  } catch (error: any) {
    console.error("Error fetching areas:", error);

    // Determine appropriate status code
    const statusCode = error.message.includes("404") ? 404 : 500;

    return NextResponse.json(
      { success: false, message: error.message },
      { status: statusCode }
    );
  }
}

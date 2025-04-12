import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { api } from "@/utils/base-api";

// GET tickets by user ID (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: any }> }
) {
  try {
    const headerReq = await headers();
    const { userId } = await params;
    const token = headerReq.get("Authorization");

    // Get query parameters for pagination
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";

    // Set authorization header for this specific request
    const requestConfig = {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      params: {
        page,
        limit,
      },
    };

    // Use axios instead of fetch
    const response = await api.get(`/tickets/user/${userId}`, requestConfig);

    // Create response with the data and add cache control
    const apiResponse = NextResponse.json(response.data);

    // Add cache control headers - short cache time as ticket data may change frequently
    apiResponse.headers.set(
      "Cache-Control",
      "private, max-age=60, stale-while-revalidate=30"
    );

    return apiResponse;
  } catch (error) {
    // Improved error handling with axios
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;

      console.error(`API Error (${status}): ${message}`);
      return NextResponse.json(
        { error: `Failed to fetch user tickets: ${message}` },
        { status }
      );
    }

    console.error("Unexpected error fetching user tickets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

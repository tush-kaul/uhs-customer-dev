import { NextRequest, NextResponse } from "next/server";
import { api, CACHE_MAX_AGE } from "@/utils/base-api";
import axios from "axios";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ parentId: string }> }
) {
  try {
    const parentId = (await params).parentId;

    // Use axios instead of fetch
    const response = await api.get(`/services/parent/${parentId}`);

    // Axios automatically parses JSON, so we can return data directly
    return NextResponse.json(response.data);
  } catch (error) {
    // Improved error handling with axios
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;

      console.error(`API Error (${status}): ${message}`);
      return NextResponse.json(
        { error: `Failed to fetch services: ${message}` },
        { status }
      );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

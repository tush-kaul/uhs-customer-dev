/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosInstance } from "axios";
import { api, CACHE_MAX_AGE } from "@/utils/base-api";

// Function to fetch a property by ID
async function fetchPropertyById(propertyId: string) {
  try {
    const response = await api.get(`/properties/${propertyId}`);
    return response.data || null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const message = error.response?.data?.message || error.message;
      throw new Error(
        `Failed to fetch property with ID ${propertyId}: ${message} (${status})`
      );
    }
    throw error; // Re-throw if it's not an Axios error
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: any }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Property ID is required" },
        { status: 400 }
      );
    }

    const property = await fetchPropertyById(id);

    return NextResponse.json({
      success: true,
      message: "Property fetched successfully",
      data: property,
    });
  } catch (error: any) {
    console.error("Error fetching property:", error);

    // Determine appropriate status code
    const statusCode = error.message.includes("Failed to fetch property")
      ? 404
      : 500;

    return NextResponse.json(
      { success: false, message: error.message },
      { status: statusCode }
    );
  }
}

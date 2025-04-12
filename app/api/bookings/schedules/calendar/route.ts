/* eslint-disable @typescript-eslint/no-explicit-any */
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { api, CACHE_MAX_AGE } from "@/utils/base-api";
import axios from "axios";

// Function to fetch calendar availability
async function fetchCalendar(
  startDate: string,
  endDate: string,
  token: string,
  area?: string,
  district?: string,
  property?: string,
  apartment_number?: string,
  bookingId?: string,
  teamId?: string
) {
  try {
    // Construct query parameters using axios params object
    const params: Record<string, string> = {
      start_date: startDate,
      end_date: endDate,
    };

    // Add optional parameters if they exist
    if (area) params.area = area;
    if (district) params.district = district;
    if (property) params.property = property;
    if (bookingId) params.booking_id = bookingId;
    if (teamId) params.team_id = teamId;
    if (apartment_number) params.apartment_number = apartment_number;

    // Make request with axios
    const response = await api.get("/schedules/calendar/availability", {
      params,
      headers: {
        authorization: token,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error getting calendar:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
      throw new Error(
        `Failed to find calendar: ${error.response?.status} ${
          error.response?.statusText || error.message
        }`
      );
    }
    console.error("Error getting calendar:", error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    const headersList = await headers();
    const token = headersList.get("Authorization");

    // Check for token
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authorization token is required" },
        { status: 401 }
      );
    }

    // Validate the required fields
    if (!body.startDate || !body.endDate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing required fields: startDate and endDate are required",
        },
        { status: 400 }
      );
    }

    // Destructure optional parameters
    const { area, district, property, apartment_number, bookingId, teamId } =
      body;

    // Fetch calendar data
    const result = await fetchCalendar(
      body.startDate,
      body.endDate,
      token,
      area,
      district,
      property,
      apartment_number,
      bookingId,
      teamId
    );

    // Return successful response with cache control headers
    return NextResponse.json(
      {
        success: true,
        message: "Dates fetched successfully",
        data: result,
      },
      {
        headers: {
          "Cache-Control": "private, max-age=300", // Cache for 5 minutes
        },
      }
    );
  } catch (error: any) {
    console.error("Error in calendar API:", error);

    // Return error response
    return NextResponse.json(
      {
        success: false,
        message:
          error.message || "An error occurred while fetching calendar data",
      },
      { status: error.statusCode || 500 }
    );
  }
}

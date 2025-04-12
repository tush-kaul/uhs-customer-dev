/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import moment from "moment";
import { api, CACHE_MAX_AGE } from "@/utils/base-api";
import axios from "axios";

// Cache for team availability data to reduce API calls
const teamAvailabilityCache: Record<string, any> = {};

interface ResidenceDurationMap {
  [key: string]: number;
}

// Residence duration mapping
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
 * Fetch bookings with optimized query parameters handling
 */
async function fetchBookings(
  userId?: string,
  recurrencePlan?: string[],
  status?: string
) {
  try {
    // Build query parameters more efficiently
    const params: Record<string, any> = {};

    if (userId) params.user_id = userId;

    // Handle multiple status values
    if (status === "home") {
      params.status = ["active", "scheduled", "upcoming"];
    } else if (status) {
      params.status = status;
    }

    if (recurrencePlan?.length) {
      params.recurrence_plan = recurrencePlan;
    }

    const response = await api.get("/bookings/bookings", { params });
    return response.data.data || [];
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        `Failed to fetch bookings: ${error.response?.status} ${error.response?.statusText}`
      );
    }
    throw error;
  }
}

/**
 * Fetch team availability with caching
 */
async function fetchTeamAvailability(availabilityId: string) {
  try {
    // Check cache first
    if (teamAvailabilityCache[availabilityId]) {
      return teamAvailabilityCache[availabilityId];
    }

    const response = await api.get(`/team-availability/${availabilityId}`);

    // Store in cache
    teamAvailabilityCache[availabilityId] = response.data;

    return response.data;
  } catch (error) {
    console.error(`Error fetching team availability ${availabilityId}:`, error);
    return { start_time: "", end_time: "" }; // Return default values if fetch fails
  }
}

/**
 * Calculate duration between dates
 */
function calculateDuration(
  startDate: moment.Moment,
  endDate: moment.Moment
): string {
  const durationInDays = endDate.diff(startDate, "days");

  if (durationInDays >= 365) {
    const years = Math.floor(durationInDays / 365);
    return `${years} ${years === 1 ? "year" : "years"}`;
  } else if (durationInDays >= 30) {
    const months = Math.floor(durationInDays / 30);
    return `${months} ${months === 1 ? "month" : "months"}`;
  } else {
    return `${durationInDays} ${durationInDays === 1 ? "day" : "days"}`;
  }
}

/**
 * Transform booking data for client consumption
 * This is separated to make the code more maintainable
 */
function transformBooking(booking: any) {
  const startDate = moment(booking.date);
  const endDate = moment(booking.end_date);

  return {
    id: booking.booking_number,
    customer: booking.user?.name || "Unknown",
    frequency: booking.recurrence_plan,
    date: `${startDate.format("DD, MMM YY")} - ${endDate.format("DD, MMM YY")}`,
    paymentStatus: booking.payment_status?.replace("_", " ") || "Unknown",
    status: booking.status || "Unknown",
    team: booking.team?.name || "Unknown",
    service: booking.service?.name || "Unknown",
    startDate: startDate.format("DD MMM YYYY"),
    endDate: endDate.format("DD MMM YYYY"),
    ref: booking.id,
    teamAvailabilities: booking.team_availability_ids || [],
    residenceType: booking.residence_type?.type || "Unknown",
    serviceMinutes: booking.residence_type?.type
      ? residenceDurationMap[booking.residence_type.type] || 0
      : 0,
    duration: calculateDuration(startDate, endDate),
    ...booking,
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id") || undefined;
    const status = searchParams.get("status") || undefined;
    const recurrencePlans = searchParams.getAll("recurrence_plan");

    // Fetch bookings
    const bookings = await fetchBookings(userId, recurrencePlans, status);

    // Transform bookings in batch
    const bookingData = bookings.map(transformBooking);

    return NextResponse.json({
      success: true,
      message: "Bookings fetched and transformed successfully",
      data: bookingData,
    });
  } catch (error: any) {
    console.error("Error fetching or transforming bookings:", error);
    return NextResponse.json(
      { success: false, message: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}

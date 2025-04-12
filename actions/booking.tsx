"use server";
import {
  getAllServiceBookings,
  getBookings,
  getStats,
} from "@/lib/service/booking";

export async function BookingAction(recurrencePlan?: string, status?: string) {
  const bookings = await getBookings(recurrencePlan, status);
  return bookings.data;
}

export async function GetAllBookingAction() {
  const bookings = await getAllServiceBookings();
  return bookings.data;
}

export async function GetStatsAction(serviceName: string) {
  const stats = await getStats(serviceName);
  return stats.data;
}

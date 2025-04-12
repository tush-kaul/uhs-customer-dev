"use server";
import { cancelBooking, cancelSingleBooking } from "@/lib/service/cancel";

export async function CancelBookingAction(bookingId: string) {
  const bookingsRes = await cancelBooking(bookingId);
  return bookingsRes.data;
}

export async function CancelSingleBookingAction(bookingId: string) {
  const bookingsRes = await cancelSingleBooking(bookingId);
  return bookingsRes.data;
}

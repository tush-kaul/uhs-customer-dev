"use server";
import { confirmBooking } from "@/lib/service/confirm-booking";

export default async function ConfirmBookingAction(data: {
  userPhone: string;
  userAvailableInApartment?: boolean;
  specialInstructions?: string;
  appartmentNumber?: string;
  is_renewed?: boolean;
  prev_booking_id?: string;
}) {
  const bookings = await confirmBooking(data);
  return bookings.data;
}

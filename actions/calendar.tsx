"use server";
import { getCalendar } from "@/lib/service/calendar";

export default async function CalendarAction(
  startDate: string,
  endDate: string,
  area?: string,
  district?: string,
  property?: string,
  apartment_number?: string,
  bookingId?: string,
  teamId?: string
) {
  const timeslots = await getCalendar({
    startDate,
    endDate,
    area,
    district,
    property,
    apartment_number,
    bookingId,
    teamId,
  });

  return timeslots.data;
}

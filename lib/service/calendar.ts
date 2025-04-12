import { apiRequest } from "../api";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getCalendar = async (data: {
  startDate: string;
  endDate: string;
  area?: string;
  district?: string;
  property?: string;
  apartment_number?: string;
  bookingId?: string;
  teamId?: string;
}) => {
  return apiRequest<any>("/bookings/schedules/calendar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

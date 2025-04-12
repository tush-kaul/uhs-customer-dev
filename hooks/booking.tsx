// hooks/use-bookings.ts
import { useQuery } from "@tanstack/react-query";
import { BookingAction, GetAllBookingAction } from "@/actions/booking";
import TeamAvailabilityAction from "@/actions/team-availability";

/**
 * Hook to fetch bookings with React Query
 *
 * @param statusFilter Filter by booking status
 * @returns Query result with bookings data
 */
export const useBookings = (statusFilter: string) => {
  return useQuery({
    queryKey: ["bookings", statusFilter],
    queryFn: async () => {
      const recurrenceParams =
        "recurrence_plan=once&recurrence_plan=twice&recurrence_plan=three&recurrence_plan=four&recurrence_plan=five&recurrence_plan=six";

      const result =
        statusFilter === "all"
          ? await BookingAction(recurrenceParams)
          : await BookingAction(recurrenceParams, statusFilter);

      return result || [];
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
  });
};

/**
 * Hook to fetch service dates for an expanded booking
 *
 * @param bookingId ID of the expanded booking
 * @param bookingsData All bookings data (to find the specific booking)
 * @returns Query result with service dates
 */
export const useServiceDates = (
  bookingId: string | null,
  bookingsData: any[] = []
) => {
  return useQuery({
    queryKey: ["serviceDates", bookingId],
    queryFn: async () => {
      if (!bookingId) return null;

      const booking = bookingsData.find((item) => item.id === bookingId);
      if (!booking) return null;

      return await TeamAvailabilityAction(booking.teamAvailabilities);
    },
    enabled: !!bookingId, // Only run the query when a booking is expanded
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useAllBookings = () => {
  return useQuery({
    queryKey: ["allBookings"],
    queryFn: async () => {
      try {
        const result = await GetAllBookingAction();
        return result || [];
      } catch (error) {
        console.error("Failed to fetch all bookings:", error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

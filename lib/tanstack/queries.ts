import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { toast } from "sonner";

// Import actions
import AreaAction from "@/actions/area";
import DistrictAction from "@/actions/district";
import { PropertyAction, PropertyDetailAction } from "@/actions/property";
import ResidenceAction from "@/actions/residence";
import BundlesAction from "@/actions/bundles";
import BlockBookingAction from "@/actions/block";
import ConfirmBookingAction from "@/actions/confirmBooking";
import CalendarAction from "@/actions/calendar";
import ServicesAction from "@/actions/services";
import { BookingAction } from "@/actions/booking";
import PricingAction from "@/actions/pricing";
import { getCurrentUser } from "@/utils/user";

// Import constants
import { RESIDENCE_DURATION_MAP } from "@/utils/constants";

// User query
export function useUserQuery(open: boolean, setValue: any, bookingData: any) {
  return useQuery({
    queryKey: [open, setValue, "user"],
    queryFn: async () => {
      try {
        const user = await getCurrentUser();
        return user;
      } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
      }
    },
    enabled: !!open,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Active bookings query
export function useActiveBookingsQuery(open: boolean, userData: any) {
  return useQuery({
    queryKey: ["active-bookings"],
    queryFn: async () => {
      const bookings = await BookingAction(
        `recurrence_plan=one_time&recurrence_plan=once&recurrence_plan=twice&recurrence_plan=three&recurrence_plan=four&recurrence_plan=five&recurrence_plan=six`
      );
      return bookings;
    },
    enabled: !!open && !!userData,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Areas query
export function useAreasQuery(open: boolean, bookingData: any, type: string) {
  return useQuery({
    queryKey: ["areas"],
    queryFn: async () => {
      const areas = await AreaAction();
      return areas;
    },
    enabled: !!open && !bookingData && type === "new",
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Districts query
export function useDistrictsQuery(
  open: boolean,
  bookingData: any,
  type: string,
  area: string
) {
  return useQuery({
    queryKey: ["districts", area],
    queryFn: async () => {
      if (!area) return [];
      const districts = await DistrictAction(area);
      return districts;
    },
    enabled: !!open && !bookingData && !!area && type === "new",
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Properties query
export function usePropertiesQuery(
  open: boolean,
  bookingData: any,
  type: string,
  district: string
) {
  return useQuery({
    queryKey: ["properties", district],
    queryFn: async () => {
      if (!district) return [];
      const properties = await PropertyAction(district);
      return properties;
    },
    enabled: !!open && !bookingData && !!district && type === "new",
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Services query
export function useServicesQuery(
  open: boolean,
  bookingData: any,
  type: string
) {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const servicesResponse = await ServicesAction({});
      return servicesResponse.data || [];
    },
    enabled: !!open && !bookingData && type === "new",
    staleTime: 60 * 60 * 1000, // 60 minutes
  });
}

// Sub-services query
export function useSubServicesQuery(
  open: boolean,
  bookingData: any,
  type: string,
  service: string
) {
  return useQuery({
    queryKey: ["sub-services", service],
    queryFn: async () => {
      if (!service) return [];
      const subServicesResponse = await ServicesAction({ parentId: service });
      return subServicesResponse.data || [];
    },
    enabled:
      !!open &&
      !!service &&
      ((!bookingData && type === "new") ||
        (!!bookingData?.service?.parent_id &&
          bookingData.service.parent_id === service)),
    staleTime: 60 * 60 * 1000, // 60 minutes
  });
}

// Residences query
export function useResidencesQuery(
  open: boolean,
  bookingData: any,
  type: string
) {
  return useQuery({
    queryKey: ["residences"],
    queryFn: async () => {
      const residences = await ResidenceAction();
      return residences;
    },
    enabled: !!open && !bookingData && type === "new",
    staleTime: 60 * 60 * 1000, // 60 minutes
  });
}

// Frequencies query
export function useFrequenciesQuery(open: boolean) {
  return useQuery({
    queryKey: ["frequencies"],
    queryFn: async () => {
      return [
        { id: "one_time", label: "One Time" },
        { id: "once", label: "Once a week" },
        { id: "twice", label: "2 Times A Week" },
        { id: "three", label: "3 Times A Weeek" },
        { id: "four", label: "4 Times A Week" },
        { id: "five", label: "5 Times A Weeek" },
        { id: "six", label: "6 Times A Week" },
      ];
    },
    enabled: !!open,
    staleTime: Infinity, // This data never changes
  });
}

// Calendar query
export function useCalendarQuery(
  open: boolean,
  bookingData: any,
  area: string,
  district: string,
  property: string,
  months: number,
  customerDetails: any,
  userData: any
) {
  return useQuery({
    queryKey: [
      "calendar",
      bookingData?.end_date,
      area,
      district,
      property,
      months,
      customerDetails?.apartmentNumber,
    ],
    queryFn: async () => {
      const startDateStr = bookingData
        ? moment(bookingData?.end_date).add(1, "day").format("YYYY-MM-DD")
        : moment().add(1, "day").format("YYYY-MM-DD");

      const endDateStr = bookingData
        ? moment(bookingData?.end_date)
            .add(months || 1, "months")
            .format("YYYY-MM-DD")
        : moment()
            .add(months || 1, "months")
            .format("YYYY-MM-DD");

      const response = await CalendarAction(
        startDateStr,
        endDateStr,
        bookingData ? bookingData.area_id : area,
        bookingData ? bookingData.district_id : district,
        bookingData ? bookingData.property_id : property,
        customerDetails?.apartmentNumber ||
          bookingData?.appartment_number ||
          userData?.apartment_number,
        undefined,
        bookingData ? bookingData.team.id : undefined
      );

      return response.data || {};
    },
    enabled:
      !!open &&
      (!!bookingData || (!!area && !!district && !!property)) &&
      !!months,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Pricing query
export function usePricingQuery(
  open: boolean,
  bookingData: any,
  subService: string,
  residenceType: string,
  frequency: string
) {
  return useQuery({
    queryKey: [
      "pricing",
      bookingData?.service_id,
      bookingData?.residence_type_id,
      bookingData?.recurrence_plan,
      subService,
      residenceType,
      frequency,
    ],
    queryFn: async () => {
      let serviceId, residenceTypeId, frequencyValue;

      if (bookingData) {
        serviceId = bookingData.service_id;
        residenceTypeId = bookingData.residence_type_id;
        frequencyValue = bookingData.recurrence_plan;
      } else {
        if (!subService || !residenceType) {
          return [];
        }
        serviceId = subService;
        residenceTypeId = residenceType;
        frequencyValue = frequency;
      }

      const pricingResponse = await PricingAction({
        serviceId: serviceId,
        residenceTypeId: residenceTypeId,
      });

      return pricingResponse.data || [];
    },
    enabled: !!open && (!!bookingData || (!!subService && !!residenceType)),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Bundles mutation
export function useBundlesMutation(
  residences: any[],
  residenceType: string,
  bookingData: any,
  property: string,
  months: number
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      frequency,
      date,
    }: {
      frequency: string;
      date: Date;
    }) => {
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const residenceSelected = bookingData
        ? bookingData.residence_type.type
        : residences.filter((r) => r.id === residenceType);

      const duration: number = bookingData
        ? RESIDENCE_DURATION_MAP[bookingData.residence_type.type]
        : RESIDENCE_DURATION_MAP[
            residenceSelected.length > 0 ? residenceSelected[0].type : ""
          ] || 60;

      const propertyLocation = bookingData
        ? {
            lat: bookingData.property.latitude,
            lng: bookingData.property.longitude,
          }
        : await getPropertyLocation(property);

      const payload = {
        startDate: formattedDate,
        location: propertyLocation,
        frequency: bookingData ? bookingData.recurrence_plan : frequency,
        servicePeriod: months,
        serviceType: bookingData
          ? bookingData.residence_type.type
          : residenceSelected.length > 0
          ? residenceSelected[0].type
          : "",
        duration: duration,
      };

      const response = await BundlesAction({
        startDate: payload.startDate,
        location: payload.location as { lat: any; lng: any },
        frequency: payload.frequency,
        servicePeriod: payload.servicePeriod,
        duration: payload.duration,
        serviceType: payload.serviceType,
      });

      return response.data || [];
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["bundles"], data);
    },
    onError: (error) => {
      console.error("Error fetching bundles:", error);
      toast.error("Failed to load service bundles");
    },
  });
}

// Block slot mutation
export function useBlockSlotMutation(
  bundles: any[],
  bundleId: string,
  selectedSlots: Record<string, string>,
  setSelectedSlotsData: (data: any[]) => void,
  bookingData: any,
  residences: any[],
  residenceType: string,
  frequency: string,
  startDate: Date,
  months: number,
  customerDetails: any,
  subService: string,
  pricings: any[],
  area: string,
  district: string,
  property: string,
  userData: any,
  setBlockId: (id: string | null) => void,
  startBlockTimer: () => void,
  setSlotsBlocked: (blocked: boolean) => void,
  setCurrentStep: (cb: (prev: number) => number) => void
) {
  return useMutation({
    mutationFn: async () => {
      let timeslotsSlected: any[] = [];

      const selectedSlotsArray = bundles[0].teams.flatMap((team: any) =>
        team.availableBundles
          .filter((av: any) => av.bundleId === bundleId)
          .flatMap((av: any) =>
            Object.entries(selectedSlots).map(([day, slotId]) => {
              const [scheduleId, timeRange] = slotId.split("_");
              const [startTime, endTime] = timeRange.split("-");

              const matchingTimeSlot = av.days
                .filter((d: any) => d.day === day)
                ?.flatMap((d: any) => d.timeSlots)
                .filter(
                  (slot: any) =>
                    slot.startTime === startTime && slot.endTime === endTime
                );

              timeslotsSlected = [...timeslotsSlected, ...matchingTimeSlot];
              if (matchingTimeSlot) {
                return {
                  schedule_id: scheduleId,
                  start_time: startTime + ":00",
                  end_time: endTime + ":00",
                };
              }
              return null;
            })
          )
      );

      const residenceSelected = bookingData
        ? bookingData.residence_type.type
        : residences.filter((r) => r.id === residenceType);

      const duration: number = bookingData
        ? RESIDENCE_DURATION_MAP[bookingData.residence_type.type]
        : RESIDENCE_DURATION_MAP[
            residenceSelected.length > 0 ? residenceSelected[0].type : ""
          ] || 60;

      const endDate =
        frequency !== "one_time"
          ? moment(startDate).add(months, "months").format("YYYY-MM-DD")
          : moment(startDate).add(1, "day").format("YYYY-MM-DD");

      // Extract the start and end time from the first timeslot if frequency is "one_time"
      const firstTimeslot = timeslotsSlected[0]; // Get the first timeslot
      const startTime = firstTimeslot ? firstTimeslot.startTime : "00:00"; // Default to "00:00" if no timeslot
      const endTime = firstTimeslot ? firstTimeslot.endTime : "00:00"; // Default to "00:00" if no timeslot

      // Append the times to the endDate if frequency is "one_time"
      const formattedEndDate =
        frequency === "one_time"
          ? `${endDate}T${endTime}:00` // Append start time to endDate
          : endDate;

      setSelectedSlotsData(selectedSlotsArray);

      const frequencyToUse = bookingData
        ? bookingData.recurrence_plan
        : frequency;
      const currentPricing = pricings.filter((p) =>
        p.frequency.includes(frequencyToUse)
      )[0];

      const data: any = {
        userPhone:
          customerDetails && customerDetails.mobileNo
            ? customerDetails.mobileNo
            : bookingData?.user.phone,
        no_of_cleaners: 2,
        userId: userData?.id,
        timeslots:
          frequencyToUse === "one_time"
            ? timeslotsSlected.slice(0, 1).map((ts) => ({
                start_time: ts.startTime + ":00",
                end_time: ts.endTime + ":00",
                schedule_id: ts.scheduleId,
              }))
            : timeslotsSlected.map((ts) => ({
                start_time: ts.startTime + ":00",
                end_time: ts.endTime + ":00",
                schedule_id: ts.scheduleId,
              })),
        teamId: bundles[0].teams[0].teamId,
        areaId: bookingData ? bookingData.area_id : area,
        districtId: bookingData ? bookingData.district_id : district,
        propertyId: bookingData ? bookingData.property_id : property,
        residenceTypeId: bookingData
          ? bookingData.residence_type_id
          : residenceType,
        startDate:
          frequencyToUse === "one_time"
            ? moment(startDate).format("YYYY-MM-DD") + "T" + startTime
            : moment(startDate).format("YYYY-MM-DD"),
        endDate: formattedEndDate, // Use the formatted endDate
        frequency: frequencyToUse,
        userAvailableInApartment:
          customerDetails.presentDuringService &&
          customerDetails.presentDuringService === "Yes"
            ? true
            : false,
        specialInstructions: customerDetails.specialInstructions,
        appartmentNumber: customerDetails.apartmentNumber
          ? customerDetails.apartmentNumber
          : bookingData?.appartment_number,
        serviceId: bookingData ? bookingData.service_id : subService,
        total_amount: currentPricing?.total_amount,
        currency: currentPricing?.currency,
      };
      return await BlockBookingAction(data);
    },
    onSuccess: (bookingId) => {
      setBlockId(bookingId || "bookingId");
      startBlockTimer();
      setSlotsBlocked(true);
      setCurrentStep((prev) => prev + 1);
    },
    onError: (error: any) => {
      console.error("Error blocking time slots:", error);
      toast.error("Timeslot could not be blocked!", {
        description: error.message,
        duration: 5000,
      });
    },
  });
}

// Confirm booking mutation
export function useConfirmBookingMutation(
  bookingData: any,
  customerDetails: any,
  blockInterval: NodeJS.Timeout | null,
  setBlockInterval: (interval: NodeJS.Timeout | null) => void,
  setBlockId: (id: string | null) => void,
  setBlockTimer: (timer: number | null) => void,
  setSlotsBlocked: (blocked: boolean) => void,
  onClose: (data: any, step: number) => void
) {
  return useMutation({
    mutationFn: async () => {
      return await ConfirmBookingAction({
        userPhone: customerDetails.mobileNo
          ? customerDetails.mobileNo
          : bookingData?.user.phone,
        specialInstructions: customerDetails.specialInstructions,
        appartmentNumber: customerDetails.apartmentNumber
          ? customerDetails.apartmentNumber
          : bookingData?.appartment_number,
        userAvailableInApartment:
          customerDetails.presentDuringService === "No" ? false : true,
        is_renewed: bookingData ? true : false,
        prev_booking_id: bookingData ? bookingData.id : undefined,
      });
    },
    onSuccess: () => {
      if (blockInterval) {
        clearInterval(blockInterval);
        setBlockInterval(null);
      }

      setBlockId(null);
      setBlockTimer(null);
      setSlotsBlocked(false);

      toast.success("Booking confirmed successfully!", {
        description: "Your booking has been confirmed.",
        duration: 5000, // 5 seconds
      });

      // Dismiss the dialog
      onClose(null, 0);

      // Reload the data or window
      window.location.reload();
    },
    onError: (error) => {
      toast.error("Booking confirmation failed!", {
        description: "Your booking could not be confirmed!.",
        duration: 5000, // 5 seconds
      });
      console.error("Error booking service:", error);
    },
  });
}

// Helper function for property location
async function getPropertyLocation(propertyId: string) {
  if (!propertyId) return null;

  try {
    const response = await PropertyDetailAction(propertyId);
    return {
      lat: response.latitude,
      lng: response.longitude,
    };
  } catch (error) {
    console.error("Error fetching property location:", error);
    return null;
  }
}

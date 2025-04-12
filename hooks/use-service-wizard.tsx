// hooks/useServiceWizard.tsx
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import moment from "moment";
import axios from "axios";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

// Import types
import {
  AreaType,
  DistrictType,
  PropertyType,
  FrequencyType,
  TimeSlotDayType,
  ServiceType,
  DateStatus,
  FormValuesType,
} from "../types";

// Import queries
import {
  useUserQuery,
  useActiveBookingsQuery,
  useAreasQuery,
  useDistrictsQuery,
  usePropertiesQuery,
  useServicesQuery,
  useSubServicesQuery,
  useResidencesQuery,
  useFrequenciesQuery,
  useCalendarQuery,
  usePricingQuery,
  useBundlesMutation,
  useBlockSlotMutation,
  useConfirmBookingMutation,
} from "../lib/tanstack/queries";

// Import schema
import { serviceFormSchema } from "@/components/schema";

export const useServiceWizard = (
  type: "new" | "renew",
  open: boolean,
  onClose: (data: any, step: number) => void,
  initialData: any = null,
  initialStep: number = 0,
  bookingData: any = null,
  openRenew: () => void
) => {
  const queryClient = useQueryClient();

  // Track component mount/unmount for cleanup
  const isMounted = useRef(true);
  const prevType = useRef<"new" | "renew" | null>(null);
  const prevBookingData = useRef<any>(null);

  // Default form values
  const defaultValues = {
    serviceType: type,
    area: "",
    district: "",
    property: "",
    residenceType: "",
    frequency: "",
    startDate: new Date(),
    months: 1,
    bundleId: "",
    timeSlotId: "",
    service: "",
    subService: "",
    customerDetails: {
      salutation: "Mr.",
      fullName: "",
      mobileNo: "",
      email: "",
      apartmentNumber: "",
      whatsappSame: false,
      whatsappNumber: "",
      presentDuringService: "Yes",
      specialInstructions: "",
      files: [],
    },
  };

  // Local state variables
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formValues, setFormValues] = useState<any>(
    initialData || defaultValues
  );
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string>>(
    {}
  );
  const [selectedSlotsData, setSelectedSlotsData] = useState<any[]>([]);
  const [alreadyExistsModal, setAlreadyExistsModal] = useState(false);
  const [blockTimer, setBlockTimer] = useState<number | null>(null);
  const [blockInterval, setBlockInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [blockId, setBlockId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [slotsBlocked, setSlotsBlocked] = useState<boolean>(false);
  const [userSelectedDate, setUserSelectedDate] = useState<boolean>(false);
  const [bundles, setBundles] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlotDayType[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Queries
  const { data: userData, isLoading: userLoading } = useUserQuery(
    open,
    null, // No setValue function needed anymore
    bookingData
  );

  const { data: activeBookings = [], isLoading: activeBookingsLoading } =
    useActiveBookingsQuery(open, userData);

  const { data: areas = [], isLoading: areasLoading } = useAreasQuery(
    open,
    bookingData,
    type
  );

  const { data: districts = [], isLoading: districtsLoading } =
    useDistrictsQuery(open, bookingData, type, formValues.area);

  const { data: properties = [], isLoading: propertiesLoading } =
    usePropertiesQuery(open, bookingData, type, formValues.district);

  const { data: services = [], isLoading: servicesLoading } = useServicesQuery(
    open,
    bookingData,
    type
  );

  const { data: subServices = [], isLoading: subServicesLoading } =
    useSubServicesQuery(open, bookingData, type, formValues.service);

  const { data: residences = [], isLoading: residencesLoading } =
    useResidencesQuery(open, bookingData, type);

  const { data: frequencies = [], isLoading: frequenciesLoading } =
    useFrequenciesQuery(open);

  const { data: calendar = {}, isLoading: calendarLoading } = useCalendarQuery(
    open,
    bookingData,
    formValues.area,
    formValues.district,
    formValues.property,
    formValues.months,
    formValues.customerDetails,
    userData
  );

  const { data: pricings = [], isLoading: pricingsLoading } = usePricingQuery(
    open,
    bookingData,
    formValues.subService,
    formValues.residenceType,
    formValues.frequency
  );

  // Function to set a form value
  const setValue = (
    name: string,
    value: any,
    options?: { shouldValidate?: boolean }
  ) => {
    // Handle nested paths like "customerDetails.email"
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormValues((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      // Handle top-level properties
      setFormValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Validate if requested
    if (options?.shouldValidate) {
      validateField(name, value);
    }
  };

  // Function to validate an individual field
  const validateField = (name: string, value: any) => {
    try {
      // Create a partial schema for just this field
      const validationSchema = z.object({
        [name]: getZodSchemaForField(name),
      });

      // Validate
      validationSchema.parse({ [name]: value });

      // Clear error if validation passes
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Set validation error
        const errorMessage = error.errors[0]?.message || `Invalid ${name}`;
        setValidationErrors((prev) => ({
          ...prev,
          [name]: errorMessage,
        }));
      }
      return false;
    }
  };

  // Function to get Zod schema for a field
  const getZodSchemaForField = (fieldName: string) => {
    // Handle nested paths
    if (fieldName.includes(".")) {
      const [parent, child] = fieldName.split(".");

      if (parent === "customerDetails") {
        const customerDetailsSchema: any =
          serviceFormSchema.shape.customerDetails;
        return customerDetailsSchema.shape[child];
      }
    }

    // Handle top-level fields
    return serviceFormSchema.shape[fieldName];
  };

  // Function to validate all fields
  const validateAllFields = () => {
    try {
      serviceFormSchema.parse(formValues);
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};

        error.errors.forEach((err) => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });

        setValidationErrors(newErrors);
      }
      return false;
    }
  };

  // Function to trigger validation for specific fields
  const trigger = (fieldNames: string | string[]) => {
    const fields = Array.isArray(fieldNames) ? fieldNames : [fieldNames];
    let allValid = true;

    fields.forEach((field) => {
      let value;

      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        value = formValues[parent]?.[child];
      } else {
        value = formValues[field];
      }

      const isValid = validateField(field, value);
      if (!isValid) allValid = false;
    });

    return allValid;
  };

  // Start block timer
  const startBlockTimer = () => {
    if (blockInterval) {
      clearInterval(blockInterval);
    }

    setBlockTimer(600); // 10 minutes in seconds

    const interval = setInterval(() => {
      setBlockTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          if (blockId) {
            releaseBlockedSlot(blockId);
          }
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);

    setBlockInterval(interval);
  };

  // Mutations
  const bundlesMutation = useBundlesMutation(
    residences,
    formValues.residenceType,
    bookingData,
    formValues.property,
    formValues.months
  );

  const confirmBookingMutation = useConfirmBookingMutation(
    bookingData,
    formValues.customerDetails,
    blockInterval,
    setBlockInterval,
    setBlockId,
    setBlockTimer,
    setSlotsBlocked,
    onClose
  );

  const blockSlotMutation = useBlockSlotMutation(
    bundles,
    formValues.bundleId,
    selectedSlots,
    setSelectedSlotsData,
    bookingData,
    residences,
    formValues.residenceType,
    formValues.frequency,
    formValues.startDate,
    formValues.months,
    formValues.customerDetails,
    formValues.subService,
    pricings,
    formValues.area,
    formValues.district,
    formValues.property,
    userData,
    setBlockId,
    startBlockTimer,
    setSlotsBlocked,
    setCurrentStep
  );

  // Reset all state variables
  const resetAllState = () => {
    setSelectedSlots({});
    setSelectedSlotsData([]);
    setBundles([]);
    setTimeSlots([]);
    setSlotsBlocked(false);
    setUserSelectedDate(false);
    setCurrentStep(initialStep);
    setBlockId(null);
    setBlockTimer(null);
    setValidationErrors({});

    // Reset form to defaults
    setFormValues(initialData || defaultValues);

    // Clear any timers
    if (blockInterval) {
      clearInterval(blockInterval);
      setBlockInterval(null);
    }

    // Release any blocked slots
    if (blockId) {
      releaseBlockedSlot(blockId);
    }

    // Invalidate queries to force refetch
    queryClient.invalidateQueries({ queryKey: ["user"] });
    queryClient.invalidateQueries({ queryKey: ["active-bookings"] });
  };

  // Set booking data values to form
  const setBookingDataValues = () => {
    if (!bookingData || !isMounted.current) return;

    const updatedValues = { ...formValues };

    // Set form values from booking data
    updatedValues.area = bookingData.area_id;
    updatedValues.district = bookingData.district_id;
    updatedValues.property = bookingData.property_id;
    updatedValues.residenceType = bookingData.residence_type_id;
    updatedValues.frequency = bookingData.recurrence_plan;

    // Set service and subService if available
    if (bookingData.service) {
      if (bookingData.service.id) {
        updatedValues.service = bookingData.service.id;
        updatedValues.subService = bookingData.service.id;
      } else {
        updatedValues.service = bookingData.service.id;
      }
    }

    // Set apartment number if not already set
    if (
      bookingData.appartment_number &&
      (!updatedValues.customerDetails ||
        !updatedValues.customerDetails.apartmentNumber)
    ) {
      updatedValues.customerDetails = {
        ...updatedValues.customerDetails,
        apartmentNumber: bookingData.appartment_number,
      };
    }

    // Set special instructions if available
    if (bookingData.special_instructions) {
      updatedValues.customerDetails = {
        ...updatedValues.customerDetails,
        specialInstructions: bookingData.special_instructions,
      };
    }

    // Set user availability
    updatedValues.customerDetails = {
      ...updatedValues.customerDetails,
      presentDuringService: bookingData.user_available_in_apartment
        ? "Yes"
        : "No",
    };

    setFormValues(updatedValues);
  };

  // Filter time slots by bundle ID
  function filterTimeSlotsByBundleId(teamsData: any, bundleId: string): any[] {
    if (!isMounted.current || !teamsData) return [];

    const filteredTimeSlots: any[] = [];

    teamsData.forEach((team: any) => {
      team.availableBundles.forEach((bundle: any) => {
        if (bundle.bundleId === bundleId) {
          // Set the teamId for the selected bundle
          setSelectedTeamId(team.teamId);

          bundle.days.forEach((day: any) => {
            filteredTimeSlots.push({
              day: day.day,
              date: day.date,
              timeSlots: day.timeSlots,
            });
          });
        }
      });
    });

    return filteredTimeSlots;
  }

  // Release blocked slot
  const releaseBlockedSlot = async (blockId: string) => {
    try {
      if (!blockId) return;

      setBlockId(null);
      setSlotsBlocked(false);
    } catch (error) {
      console.error("Error releasing blocked slot:", error);
    }
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (day: string, slot: any) => {
    const slotId = `${slot.scheduleId}_${slot.startTime}-${slot.endTime}`;

    const newSelections = { ...selectedSlots };
    newSelections[day] = slotId;
    setSelectedSlots(newSelections);

    setValue("timeSlotId", slot.scheduleId, { shouldValidate: true });
  };

  // Handle closing the wizard
  const handleClose = () => {
    // Reset state variables
    resetAllState();

    onClose(formValues, currentStep);
  };

  // Fetch bundles
  const fetchBundles = async (frequencyId: string, date: Date) => {
    try {
      const result = await bundlesMutation.mutateAsync({
        frequency: frequencyId,
        date,
      });
      setBundles(result);
    } catch (error) {
      console.error("Error in fetchBundles:", error);
      toast.error("Failed to load service bundles");
    }
  };

  // Fetch time slots
  const fetchTimeSlots = async (bundleId: string) => {
    try {
      if (!bundleId || !bundles || bundles.length === 0) {
        setTimeSlots([]);
        return;
      }

      const filteredTimeSlots = filterTimeSlotsByBundleId(
        bundles[0].teams,
        bundleId
      );
      setTimeSlots(filteredTimeSlots);
      setSlotsBlocked(false);
    } catch (error) {
      console.error("Error fetching time slots:", error);
      toast.error("Failed to load time slots");
      setTimeSlots([]);
    }
  };

  // Block time slot
  const blockTimeSlot = async () => {
    try {
      await blockSlotMutation.mutateAsync();
    } catch (error: any) {
      console.error("Error blocking time slots:", error);
      toast.error("Timeslot could not be blocked!", {
        description: error.message,
        duration: 5000,
      });
    }
  };

  // Submit the form
  const onSubmit = async () => {
    try {
      const isValid = validateAllFields();
      if (!isValid) {
        toast.error("Please fix all form errors before continuing");
        return;
      }

      await confirmBookingMutation.mutateAsync();
    } catch (error) {
      console.error("Error in onSubmit:", error);
      toast.error("Booking confirmation failed");
    }
  };

  // Check if a user already has a booking at this location
  const checkExistingBooking = (values: any) => {
    if (!userData?.id) return false;

    return activeBookings.some((booking: any) => {
      return (
        booking.area_id === values.area &&
        booking.district_id === values.district &&
        booking.property_id === values.property &&
        booking.residence_type_id === values.residenceType &&
        booking.service.id === values.subService &&
        booking.appartment_number === values.customerDetails?.apartmentNumber
      );
    });
  };

  // Initialize form with user data
  useEffect(() => {
    if (userData && !initialized) {
      console.log("usr", userData);

      // Create updated form values
      const updatedValues = { ...formValues };

      // Update customer details
      updatedValues.customerDetails = {
        ...updatedValues.customerDetails,
        email: userData.email || "",
        fullName: userData.name || "",
        mobileNo: userData.phone || "",
        whatsappNumber: userData.whatsapp_number || "",
        whatsappSame: userData.whatsapp_number === userData.phone,
        apartmentNumber: userData.apartment_number || "",
      };

      // Only set these values if we don't have bookingData
      if (!bookingData) {
        updatedValues.area = userData.area?.id || "";
        updatedValues.district = userData.district?.id || "";
        updatedValues.property = userData.property?.id || "";
        updatedValues.residenceType = userData.residence_type?.id || "";
        updatedValues.frequency = "one_time";
      }

      console.log("Setting initial form values:", updatedValues);

      // Update form values
      setFormValues(updatedValues);
      console.log("booking data", bookingData);

      setInitialized(true);
    }
  }, [userData, initialized, bookingData, open]);

  // Set booking data values when available
  useEffect(() => {
    if (bookingData && open) {
      setBookingDataValues();
    }
  }, [bookingData, open]);

  // Update bundles state when mutation succeeds
  useEffect(() => {
    if (bundlesMutation.data) {
      setBundles(bundlesMutation.data);
    }
  }, [bundlesMutation.data]);

  // Fetch time slots when bundle or date changes
  useEffect(() => {
    if (formValues.bundleId && formValues.startDate) {
      fetchTimeSlots(formValues.bundleId);
      setValue("timeSlotId", "", { shouldValidate: false });
      setSlotsBlocked(false);
    }
  }, [formValues.bundleId, formValues.startDate]);

  // Track changes in type or bookingData
  useEffect(() => {
    // Check if type or bookingData has changed
    const typeChanged = prevType.current !== type;
    const bookingDataChanged =
      JSON.stringify(prevBookingData.current) !== JSON.stringify(bookingData);

    // Update refs
    prevType.current = type;
    prevBookingData.current = bookingData;

    // If type or bookingData changed, do a full reset
    if ((typeChanged || bookingDataChanged) && open) {
      resetAllState();
      setInitialized(false);

      // Default frequency for new bookings
      if (type === "new" && !bookingData) {
        setValue("frequency", "one_time", { shouldValidate: false });
      }

      // Set months to 1 by default
      setValue("months", 1, { shouldValidate: false });
    }
  }, [type, bookingData, open]);

  // Cleanup on unmount
  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;

      // Clear any timers
      if (blockInterval) {
        clearInterval(blockInterval);
      }

      // Release any blocked slots
      if (blockId) {
        releaseBlockedSlot(blockId);
      }
    };
  }, []);

  // Calculate global loading state from all queries
  const globalLoading =
    userLoading ||
    activeBookingsLoading ||
    (type === "new" &&
      !bookingData &&
      (areasLoading || servicesLoading || residencesLoading)) ||
    bundlesMutation.isPending;

  // Calculate loading state for individual resources
  const loading = {
    areas: areasLoading,
    districts: districtsLoading,
    properties: propertiesLoading,
    frequencies: frequenciesLoading,
    bundles: bundlesMutation.isPending,
    timeSlots: false,
    residence: residencesLoading,
    blockingSlot: blockSlotMutation.isPending,
    confirmBooking: confirmBookingMutation.isPending,
    calendar: calendarLoading,
    service: servicesLoading,
    subService: subServicesLoading,
  };

  // Create a form-like object for compatibility
  const form = {
    watch: (path?: string) => {
      if (!path) return formValues;

      if (path.includes(".")) {
        const [parent, child] = path.split(".");
        return formValues[parent]?.[child];
      }

      return formValues[path];
    },
    setValue,
    trigger,
    getValues: () => formValues,
    formState: {
      errors: validationErrors,
      isValid: Object.keys(validationErrors).length === 0,
    },
  };

  return {
    form,
    currentStep,
    setCurrentStep,
    loading,
    globalLoading,
    areas,
    districts,
    properties,
    residences,
    services,
    subServices,
    frequencies,
    bundles,
    timeSlots,
    pricings,
    selectedSlots,
    selectedSlotsData,
    blockTimer,
    blockId,
    userSelectedDate,
    setUserSelectedDate,
    calendar,
    alreadyExistsModal,
    setAlreadyExistsModal,
    slotsBlocked,
    handleTimeSlotSelect,
    blockTimeSlot,
    handleClose,
    onSubmit,
    fetchBundles,
    checkExistingBooking,
  };
};

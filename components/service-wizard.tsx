/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, JSX, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Currency,
  Loader2,
} from "lucide-react";
import { Form } from "@/components/ui/form";
import { serviceFormSchema, ServiceWizardProps } from "@/components/schema";
import { z } from "zod";
import axios from "axios";
import AreaAction from "@/actions/area";
import DistrictAction from "@/actions/district";
import { PropertyAction, PropertyDetailAction } from "@/actions/property";
import ResidenceAction from "@/actions/residence";
import moment from "moment";
import BundlesAction from "@/actions/bundles";
import BlockBookingAction from "@/actions/block";
import ConfirmBookingAction from "@/actions/confirmBooking";
import CalendarAction from "@/actions/calendar";
import ServicesAction from "@/actions/services";
import { getCurrentUser } from "@/utils/user";
import CustomDatePicker from "./ui/custom-date-picker";
import { BookingAction } from "@/actions/booking";
import Loader from "./ui/loader";
import PricingAction from "@/actions/pricing";
import ServicePackageModal from "./ServicePackageModal";
import { DateStatus } from "@/types";

type AreaType = {
  id: string;
  name: string;
};

type DistrictType = {
  id: string;
  name: string;
  areaId: number;
};

type PropertyType = {
  id: string;
  name: string;
  districtId: number;
};

type FrequencyType = {
  id: string;
  label: string;
};

type TimeSlotType = {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
};

const residenceDurationMap: any = {
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

const frequencyNumberMapping: Record<string, number> = {
  one_time: 1,
  once: 1,
  twice: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
};

const getSliceEndIndex = (frequency: string) => {
  return frequencyNumberMapping[frequency] || 1;
};

const SERVICE_DURATION = [1, 3, 6, 12];

export default function ServiceWizard({
  type,
  open,
  onClose,
  initialData,
  initialStep = 0,
  bookingData,
  isFromBooking = false,
  openRenew,
}: ServiceWizardProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [areas, setAreas] = useState<AreaType[]>([]);
  const [districts, setDistricts] = useState<DistrictType[]>([]);
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [frequencies, setFrequencies] = useState<FrequencyType[]>([]);
  const [bundles, setBundles] = useState<any[]>([]);
  const [pricings, setPricings] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<any>({});
  const [services, setServices] = useState<any[]>([]);
  const [subServices, setSubServices] = useState<any[]>([]);
  const [user, setUser] = useState<any>();
  const [alreadyExistsModal, setAlreadyExistsModal] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string>>(
    {}
  );
  const [selectedSlotsData, setSelectedSlotsData] = useState<any[]>([]);
  const [residences, setResidences] = useState<any[]>([]);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [loading, setLoading] = useState({
    areas: false,
    districts: false,
    properties: false,
    frequencies: false,
    bundles: false,
    timeSlots: false,
    residence: false,
    blockingSlot: false,
    confirmBooking: false,
    calendar: false,
    service: false,
    subService: false,
  });
  const [blockTimer, setBlockTimer] = useState<number | null>(null);
  const [blockInterval, setBlockInterval] = useState<NodeJS.Timeout | null>(
    null
  );
  const [blockId, setBlockId] = useState<string | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [slotsBlocked, setSlotsBlocked] = useState<boolean>(false);
  const [userSelectedDate, setUserSelectedDate] = useState<boolean>(false);
  const [activeBookings, setActiveBookings] = useState<any[]>([]);
  const form = useForm<z.infer<typeof serviceFormSchema>>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: initialData || {
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
    },
  });

  const { handleSubmit, setValue, watch, reset } = form;

  const area = watch("area");
  const district = watch("district");
  const property = watch("property");
  const residenceType = watch("residenceType");
  const frequency = watch("frequency");
  const startDate = watch("startDate");
  const months = watch("months");
  const bundleId = watch("bundleId");
  const timeSlotId = watch("timeSlotId");
  const customerDetails = watch("customerDetails");
  const service = watch("service");
  const subService = watch("subService");

  const fetchUser = async () => {
    try {
      setGlobalLoading(true);
      const userData = await getCurrentUser();
      const activeBookingsRes = await BookingAction(
        `recurrence_plan=one_time&recurrence_plan=once&recurrence_plan=twice&recurrence_plan=three&recurrence_plan=four&recurrence_plan=five&recurrence_plan=six`
      );
      setActiveBookings(activeBookingsRes);
      setValue("customerDetails.email", userData.email, {
        shouldValidate: true,
      });

      setValue("customerDetails.fullName", userData.name, {
        shouldValidate: true,
      });
      setValue("customerDetails.mobileNo", userData.phone, {
        shouldValidate: true,
      });
      setValue("customerDetails.whatsappNumber", userData.whatsapp_number, {
        shouldValidate: true,
      });
      setValue(
        "customerDetails.whatsappSame",
        userData.whatsapp_number === userData.phone,
        {
          shouldValidate: true,
        }
      );
      setValue("customerDetails.apartmentNumber", userData.apartment_number, {
        shouldValidate: true,
      });
      setValue("area", userData.area, {
        shouldValidate: true,
      });
      setValue("district", userData.district, {
        shouldValidate: true,
      });
      setValue("property", userData.property, {
        shouldValidate: true,
      });
      setValue("residenceType", userData.residenceType, {
        shouldValidate: true,
      });
      setValue("frequency", "one_time", {
        shouldValidate: true,
      });
      // console.log("user", userData);
      setUser(userData);
    } catch (error) {
      console.log("error", error);
      toast.error("Something went wrong please try again!");
    } finally {
      setGlobalLoading(false);
    }
  };
  useEffect(() => {
    if (open) {
      setGlobalLoading(true);
      reset(initialData || {});
      fetchUser();
      setCurrentStep(0);
      fetchAreas();
      fetchServices();
      fetchResidences();
      fetchFrequencies();
      setValue("months", 1, {
        shouldValidate: true,
      });
    }
  }, [open, reset, initialData, initialStep]);

  useEffect(() => {
    if (area) {
      fetchDistricts(area);
    }
  }, [area, setValue]);

  useEffect(() => {
    if (service) {
      fetchSubServices(service);
    }
  }, [service, setValue]);
  useEffect(() => {
    if (district) {
      fetchProperties(district);
    }
  }, [district, setValue]);

  useEffect(() => {
    if (bookingData) {
      setValue("area", bookingData.area_id, { shouldValidate: true });
      setValue("district", bookingData.district_id, { shouldValidate: true });
      setValue("property", bookingData.property_id, { shouldValidate: true });
      setValue("residenceType", bookingData.residence_type_id, {
        shouldValidate: true,
      });

      setValue("frequency", bookingData.frequency, { shouldValidate: true });
      fetchCalendar(
        moment(bookingData?.end_date).add(1, "day").format("YYYY-MM-DD"),
        moment(bookingData?.end_date)
          .add(months || 1, "months")
          .format("YYYY-MM-DD")
      );
    } else {
      fetchCalendar(
        moment().add(1, "day").format("YYYY-MM-DD"),
        moment()
          .add(months || 1, "months")
          .format("YYYY-MM-DD")
      );
      if (frequency && frequency.length === 0) {
        setValue("frequency", "one_time", { shouldValidate: true });
      }
    }
  }, [bookingData, months]);
  // useEffect(() => {

  // }, [frequency, startDate, property, residenceType, months, setValue]);

  useEffect(() => {
    if (bundleId && startDate) {
      fetchTimeSlots(bundleId);
      setValue("timeSlotId", "");
      setSlotsBlocked(false);
    }
  }, [bundleId, startDate, setValue]);

  useEffect(() => {
    return () => {
      if (blockInterval) {
        clearInterval(blockInterval);
      }
      if (blockId) {
        releaseBlockedSlot(blockId);
      }
    };
  }, [blockInterval, blockId]);

  const fetchServices = async () => {
    try {
      setLoading((prev) => ({ ...prev, service: true }));
      const services = await ServicesAction({});
      setServices(services.data || []);
      setLoading((prev) => ({ ...prev, service: false }));
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading((prev) => ({ ...prev, service: false }));
    }
  };

  const fetchSubServices = async (parentId: string) => {
    try {
      setLoading((prev) => ({ ...prev, subService: true }));
      const subService = await ServicesAction({
        parentId: parentId,
      });
      setSubServices(subService.data || []);
      setLoading((prev) => ({ ...prev, subService: false }));
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading((prev) => ({ ...prev, subService: false }));
    }
  };

  const fetchResidences = async () => {
    try {
      setLoading((prev) => ({ ...prev, residence: true }));
      const response = await ResidenceAction();
      setResidences(response);
      setLoading((prev) => ({ ...prev, residence: false }));
    } catch (error) {
      console.error("Error fetching areas:", error);
      setLoading((prev) => ({ ...prev, residence: false }));
    }
  };

  const fetchAreas = async () => {
    try {
      setLoading((prev) => ({ ...prev, areas: true }));
      const response = await AreaAction();
      setAreas(response);
      setLoading((prev) => ({ ...prev, areas: false }));
    } catch (error) {
      console.error("Error fetching areas:", error);
      setLoading((prev) => ({ ...prev, areas: false }));
    }
  };

  const fetchDistricts = async (areaId: string) => {
    try {
      setLoading((prev) => ({ ...prev, districts: true }));
      const response = await DistrictAction(areaId);
      setDistricts(response);
      setLoading((prev) => ({ ...prev, districts: false }));
    } catch (error) {
      console.error("Error fetching districts:", error);
      setLoading((prev) => ({ ...prev, districts: false }));
    }
  };
  const [calendar, setCalendar] = useState<Record<string, DateStatus>>({});
  const fetchCalendar = async (startDate: string, endDate: string) => {
    try {
      setLoading((prev) => ({ ...prev, calendar: true }));
      const response = await CalendarAction(
        startDate,
        endDate,
        area,
        district,
        property,
        customerDetails
          ? customerDetails?.apartmentNumber
          : user?.apartment_number,
        undefined,
        bookingData ? bookingData.team.id : undefined
      );

      const dateStatusMap = response.data;
      setCalendar(dateStatusMap);
      setLoading((prev) => ({ ...prev, calendar: false }));
    } catch (error) {
      console.error("Error fetching properties:", error);
      setLoading((prev) => ({ ...prev, calendar: false }));
    }
  };

  const fetchProperties = async (districtId: string) => {
    try {
      setLoading((prev) => ({ ...prev, properties: true }));
      const response = await PropertyAction(districtId);
      setProperties(response);
      setLoading((prev) => ({ ...prev, properties: false }));
    } catch (error) {
      console.error("Error fetching properties:", error);
      setLoading((prev) => ({ ...prev, properties: false }));
    }
  };

  const getPropertyLocation = async (propertyId: string) => {
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
  };

  const fetchFrequencies = async () => {
    try {
      setLoading((prev) => ({ ...prev, frequencies: true }));
      const response: FrequencyType[] = [
        { id: "one_time", label: "One Time" },
        { id: "once", label: "Once a week" },
        { id: "twice", label: "2 Times A Week" },
        { id: "three", label: "3 Times A Weeek" },
        { id: "four", label: "4 Times A Week" },
        { id: "five", label: "5 Times A Weeek" },
        { id: "six", label: "6 Times A Week" },
      ];
      setFrequencies(response);
      setLoading((prev) => ({ ...prev, frequencies: false }));
    } catch (error) {
      console.error("Error fetching frequencies:", error);
      setLoading((prev) => ({ ...prev, frequencies: false }));
    }
  };

  const fetchBundles = async (frequencyId: string, date: Date) => {
    try {
      setGlobalLoading(true);
      setLoading((prev) => ({ ...prev, bundles: true }));
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const residenceSelected = bookingData
        ? bookingData.residence_type.type
        : residences.filter((r) => r.id === residenceType);

      const duration: number = bookingData
        ? residenceDurationMap[bookingData.residence_type.type]
        : residenceDurationMap[
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
        frequency: bookingData ? bookingData.recurrence_plan : frequencyId,
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
      setBundles(response.data);
      setLoading((prev) => ({ ...prev, bundles: false }));
      // setCurrentStep(type === "renew" ? 1 : 3);
    } catch (error) {
      console.error("Error fetching bundles:", error);
      setLoading((prev) => ({ ...prev, bundles: false }));
    } finally {
      setGlobalLoading(false);
    }
  };

  const fetchPricing = async () => {
    try {
      const formValues = form.getValues();

      if (!formValues.subService || !formValues.residenceType) {
        return;
      }
      const pricings = await PricingAction({
        serviceId: formValues.subService || bookingData.service.id,
        residenceTypeId:
          formValues.residenceType || bookingData.residence_type.id,
      });

      setPricings(pricings.data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    if (bookingData) {
      fetchPricing();
    } else if (subService && residenceType) {
      fetchPricing();
    }
  }, [subService, residenceType, bookingData]);
  function filterTimeSlotsByBundleId(teamsData: any, bundleId: string): any[] {
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

  const fetchTimeSlots = async (bundleId: string) => {
    try {
      setLoading((prev) => ({ ...prev, timeSlots: true }));
      const timeslotsRes = filterTimeSlotsByBundleId(
        bundles[0].teams,
        bundleId
      );
      console.log(timeslotsRes, "bnu");
      setTimeSlots(timeslotsRes);
      setLoading((prev) => ({ ...prev, timeSlots: false }));
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setLoading((prev) => ({ ...prev, timeSlots: false }));
    }
  };

  const blockTimeSlot = async () => {
    try {
      setLoading((prev) => ({ ...prev, blockingSlot: true }));
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
        ? residenceDurationMap[bookingData.residence_type.type]
        : residenceDurationMap[
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

      const data: any = {
        userPhone:
          customerDetails && customerDetails.mobileNo
            ? customerDetails.mobileNo
            : bookingData.user.phone,
        no_of_cleaners: 2,
        userId: user.id,
        timeslots:
          frequency === "one_time"
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
          frequency === "one_time"
            ? moment(startDate).format("YYYY-MM-DD") + "T" + startTime
            : moment(startDate).format("YYYY-MM-DD"),
        endDate: formattedEndDate, // Use the formatted endDate
        frequency: bookingData ? bookingData.recurrence_plan : frequency,
        userAvailableInApartment:
          customerDetails.presentDuringService === "No" ? false : "Yes",
        specialInstructions: customerDetails.specialInstructions,
        appartmentNumber: customerDetails.apartmentNumber
          ? customerDetails.apartmentNumber
          : bookingData.appartment_number,
        serviceId: bookingData ? bookingData.service_id : subService,
        total_amount: pricings.filter((p) =>
          p.frequency.includes(
            bookingData ? bookingData.recurrence_plan : frequency
          )
        )[0].total_amount,
        currency: pricings.filter((p) =>
          p.frequency.includes(
            bookingData ? bookingData.recurrence_plan : frequency
          )
        )[0].currency,
      };
      // console.log("data", data);
      // Simulate API call
      //   await new Promise((resolve) => setTimeout(resolve, 1000));
      const bookingId = await BlockBookingAction(data);
      //   // Mock response
      //   //   const mockBlockId = "mock-block-id-" + Date.now();
      setBlockId(bookingId);
      startBlockTimer();
      setSlotsBlocked(true);
      setLoading((prev) => ({ ...prev, blockingSlot: false }));

      //   // Move to the next step (customer details)
      setCurrentStep((prev) => prev + 1);
    } catch (error: any) {
      console.error("Error blocking time slots:", error);
      setLoading((prev) => ({ ...prev, blockingSlot: false }));
      toast.error("Timeslot could not be blocked!", {
        description: error.message,
        duration: 5000, // 5 seconds
      });
    }
  };

  const releaseBlockedSlot = async (blockId: string) => {
    try {
      await axios.post("/api/release-slot", { blockId });
      setBlockId(null);
      setSlotsBlocked(false);
    } catch (error) {
      console.error("Error releasing blocked slot:", error);
    }
  };

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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  function formatFrequency(frequency: string) {
    // Replace underscores with spaces
    let withSpaces = frequency.replace(/_/g, " ");

    // Capitalize the first letter of each word
    let formatted = withSpaces.replace(/\b\w/g, (char) => char.toUpperCase());

    return formatted;
  }
  const handleClose = () => {
    const currentValues = watch();
    if (blockId) {
      releaseBlockedSlot(blockId);
    }
    if (blockInterval) {
      clearInterval(blockInterval);
    }
    onClose(currentValues, currentStep);
  };

  const onSubmit = async () => {
    try {
      setLoading((prev) => ({ ...prev, confirmBooking: true }));
      const response = await ConfirmBookingAction({
        userPhone: customerDetails.mobileNo
          ? customerDetails.mobileNo
          : bookingData.user.phone,
        specialInstructions: customerDetails.specialInstructions,
        appartmentNumber: customerDetails.apartmentNumber
          ? customerDetails.apartmentNumber
          : bookingData.appartment_number,
        userAvailableInApartment:
          customerDetails.presentDuringService === "No" ? false : true,
        is_renewed: bookingData ? true : false,
        prev_booking_id: bookingData ? bookingData.id : undefined,
      });
      console.log("Service booked successfully:", response);

      if (blockInterval) {
        clearInterval(blockInterval);
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
    } catch (error) {
      toast.error("Booking  confirmation failed!", {
        description: "Your booking could not be confirmed!.",
        duration: 5000, // 5 seconds
      });
      console.error("Error booking service:", error);
    } finally {
      setLoading((prev) => ({ ...prev, confirmBooking: false }));
    }
  };

  const handleTimeSlotSelect = (day: string, slot: any) => {
    const slotId = `${slot.scheduleId}_${slot.startTime}-${slot.endTime}`;

    const newSelections = { ...selectedSlots };
    newSelections[day] = slotId;
    setSelectedSlots(newSelections);

    setValue("timeSlotId", slot.scheduleId, { shouldValidate: true });
  };

  const validateStep = async (step: number) => {
    const formValues = form.getValues();

    switch (step) {
      case 0:
        return (
          formValues.area &&
          formValues.district &&
          formValues.property &&
          formValues.residenceType &&
          formValues.service &&
          formValues.subService &&
          customerDetails.apartmentNumber
        );
      case 1:
        console.log(
          "strep",
          currentStep,
          frequency && startDate && months && userSelectedDate
        );
        return frequency && startDate && months && userSelectedDate;
      case 2:
        return bundleId;
      case 3:
        return (
          Object.keys(selectedSlots).length === getSliceEndIndex(frequency)
        );
      case 4:
        return blockId;
      default:
        return true;
    }
  };

  const validateRenewalStep = (step: number) => {
    switch (step) {
      case 0:
        return startDate && months;
      case 1:
        return bundleId;
      case 2:
        return (
          Object.keys(selectedSlots).length ===
          getSliceEndIndex(
            bookingData ? bookingData.recurrence_plan : frequency
          )
        );
      case 3:
        return blockId;
      case 4:
        return true;
      default:
        return true;
    }
  };

  const selectedSubservice = subServices.filter((s) => s.id === subService);
  // console.log("selectedServ", selectedSubservice);
  const STEPS: Record<"new" | "renew", any[]> = {
    new: [
      {
        title: "Service & Select Location",
        component: () => (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Service Selection */}
              <div className='space-y-2'>
                <Label>Service</Label>
                <Select
                  value={service}
                  onValueChange={(value) => {
                    setValue("service", value, { shouldValidate: true });
                    // Reset sub-service when service changes
                    setValue("subService", "", { shouldValidate: true });
                  }}>
                  <SelectTrigger className='hover:bg-gray-100 transition-transform duration-200 cursor-pointer'>
                    <SelectValue placeholder='Select Service' />
                  </SelectTrigger>
                  <SelectContent>
                    {loading.service ? (
                      <SelectItem value='loading' disabled>
                        <Loader2 className='h-4 w-4 animate-spin' />
                      </SelectItem>
                    ) : (
                      services.map((serviceOption) => (
                        <SelectItem
                          key={serviceOption.id}
                          value={serviceOption.id}>
                          {serviceOption.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Sub-Service Selection */}
              <div className='space-y-2'>
                <Label>Sub-Service</Label>
                <Select
                  value={subService}
                  disabled={!service || loading.subService}
                  onValueChange={(value) =>
                    setValue("subService", value, { shouldValidate: true })
                  }>
                  <SelectTrigger className='hover:bg-gray-100 transition-transform duration-200 cursor-pointer'>
                    <SelectValue placeholder='Select Sub-Service' />
                  </SelectTrigger>
                  <SelectContent>
                    {loading.subService ? (
                      <SelectItem value='loading' disabled>
                        <Loader2 className='h-4 w-4 animate-spin' />
                      </SelectItem>
                    ) : (
                      subServices.map((subServiceOption) => (
                        <SelectItem
                          key={subServiceOption.id}
                          value={subServiceOption.id}>
                          {subServiceOption.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label>Area</Label>
                <Select
                  value={area}
                  onValueChange={(value) => {
                    setValue("area", value, { shouldValidate: true });
                  }}>
                  <SelectTrigger className='hover:bg-gray-100 transition-transform duration-200 cursor-pointer'>
                    <SelectValue placeholder='Select Area' />
                  </SelectTrigger>
                  <SelectContent>
                    {loading.areas ? (
                      <SelectItem value='loading' disabled>
                        <Loader2 className='h-4 w-4 animate-spin' />
                      </SelectItem>
                    ) : (
                      areas.map((areaOption) => (
                        <SelectItem key={areaOption.id} value={areaOption.id}>
                          {areaOption.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>District</Label>
                <Select
                  value={district}
                  disabled={!area || loading.districts}
                  onValueChange={(value) =>
                    setValue("district", value, { shouldValidate: true })
                  }>
                  <SelectTrigger className='hover:bg-gray-100 transition-transform duration-200 cursor-pointer'>
                    <SelectValue placeholder='Select District' />
                  </SelectTrigger>
                  <SelectContent>
                    {loading.districts ? (
                      <SelectItem value='loading' disabled>
                        <Loader2 className='h-4 w-4 animate-spin' />
                      </SelectItem>
                    ) : (
                      districts.map((districtOption) => (
                        <SelectItem
                          key={districtOption.id}
                          value={districtOption.id.toString()}>
                          {districtOption.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>Property</Label>
                <Select
                  value={property}
                  disabled={!district || loading.properties}
                  onValueChange={(value) =>
                    setValue("property", value, { shouldValidate: true })
                  }>
                  <SelectTrigger className='hover:bg-gray-100 transition-transform duration-200 cursor-pointer'>
                    <SelectValue placeholder='Select Property' />
                  </SelectTrigger>
                  <SelectContent>
                    {loading.properties ? (
                      <SelectItem value='loading' disabled>
                        <Loader2 className='h-4 w-4 animate-spin' />
                      </SelectItem>
                    ) : (
                      properties.map((propertyOption) => (
                        <SelectItem
                          key={propertyOption.id}
                          value={propertyOption.id.toString()}>
                          {propertyOption.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>Residence Type</Label>
                <Select
                  value={residenceType}
                  onValueChange={(value) =>
                    setValue("residenceType", value, { shouldValidate: true })
                  }>
                  <SelectTrigger className='hover:bg-gray-100 transition-transform duration-200 cursor-pointer'>
                    <SelectValue placeholder='Select Residence Type' />
                  </SelectTrigger>
                  <SelectContent>
                    {residences.map((res) => (
                      <SelectItem key={res.id} value={res.id}>
                        {res.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>Apartment Number</Label>
                <Input
                  placeholder='Apartment Number'
                  value={customerDetails?.apartmentNumber}
                  onChange={(e) =>
                    setValue(
                      "customerDetails.apartmentNumber",
                      e.target.value,
                      {
                        shouldValidate: true,
                      }
                    )
                  }
                />
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "Service Details",
        component: () => (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2 md:col-span-2'>
                <Label>Frequency</Label>
                <Select
                  value={frequency || "one_time"}
                  onValueChange={(value) =>
                    setValue("frequency", value, { shouldValidate: true })
                  }>
                  <SelectTrigger className='hover:bg-gray-100 transition-transform duration-200 cursor-pointer'>
                    <SelectValue placeholder='Select Frequency' />
                  </SelectTrigger>
                  <SelectContent>
                    {loading.frequencies ? (
                      <SelectItem value='loading' disabled>
                        <Loader2 className='h-4 w-4 animate-spin' />
                      </SelectItem>
                    ) : selectedSubservice[0].name === "Regular Cleaning" ? (
                      frequencies.map((freq) => (
                        <SelectItem key={freq.id} value={freq.id.toString()}>
                          {freq.label}
                        </SelectItem>
                      ))
                    ) : (
                      frequencies
                        .filter((fr) => fr.id === "one_time")
                        .map((freq) => (
                          <SelectItem key={freq.id} value={freq.id.toString()}>
                            {freq.label}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className='mt-4 md:col-span-2 '>
                <h4 className='font-medium mb-2'>Pricing Information</h4>
                <div className='bg-slate-200 p-3 rounded-md'>
                  <div className='space-y-2'>
                    {pricings.length > 0 &&
                      pricings.map((p) => {
                        return (
                          <div className='flex justify-between'>
                            <span>{formatFrequency(p.frequency)}:</span>
                            <div className='flex flex-col items-end'>
                              <span className='font-medium'>
                                {p.currency} {p.unit_amount}/-
                              </span>
                              <span className='text-gray-500 text-sm'>
                                {p.total_services}{" "}
                                {p.total_services > 1 ? "services" : "service"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
              {frequency !== "one_time" && (
                <div className='space-y-2'>
                  <Label>Duration (Months)</Label>
                  <Select
                    value={months?.toString()}
                    onValueChange={(e) => {
                      setValue("months", parseInt(e), {
                        shouldValidate: true,
                      });
                    }}>
                    <SelectTrigger className='hover:bg-gray-100 transition-transform duration-200 cursor-pointer'>
                      <SelectValue placeholder='Select Duration' />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_DURATION.map((sd) => (
                        <SelectItem key={sd} value={sd.toString()}>
                          {sd} {sd === 1 ? "Month" : "Months"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className='space-y-2'>
                <Label>Start Date</Label>
                {!loading.calendar ? (
                  <CustomDatePicker
                    startDate={startDate}
                    setStartDate={(d: any) => {
                      setUserSelectedDate(true);
                      setValue("startDate", d as Date, {
                        shouldValidate: true,
                      });
                    }}
                    minDate={moment().toDate()} // Start date from bookingData.end_date + 1 or today
                    maxDate={moment().add(months, "months").toDate()}
                    dateStatusMap={calendar}
                    setUserSelected={setUserSelectedDate}
                  />
                ) : (
                  <div>Loading calendar...</div>
                )}
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "Select Bundle",
        component: () => (
          <div className='space-y-4'>
            {loading.bundles ? (
              <div className='flex justify-center py-8'>
                <Loader2 className='h-8 w-8 animate-spin' />
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {bundles[0]?.bundles.map((bundle: any) => (
                  <div
                    key={bundle.id}
                    className={`border p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      bundleId === bundle.id ? "border-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() =>
                      setValue("bundleId", bundle.id, { shouldValidate: true })
                    }>
                    <h3 className='font-medium'>{bundle.title}</h3>
                  </div>
                ))}
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Select Time Slot",
        component: () => (
          <div className='space-y-4'>
            {loading.timeSlots ? (
              <div className='flex justify-center py-8'>
                <Loader2 className='h-8 w-8 animate-spin' />
              </div>
            ) : (
              <div className='space-y-6'>
                {timeSlots &&
                  timeSlots
                    .slice(0, getSliceEndIndex(frequency))
                    .map((ts: any) => (
                      <div key={ts.day} className='space-y-2'>
                        <h3 className='font-medium text-lg'>{ts.day}</h3>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                          {ts.timeSlots.map((slot: any, idx: number) => {
                            // Create unique ID for each slot
                            const slotId = `${slot.scheduleId}_${slot.startTime}-${slot.endTime}`;

                            return (
                              <div
                                key={idx}
                                className={`border p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                  // Check if this slot is selected for this day
                                  selectedSlots[ts.day] === slotId
                                    ? "border-blue-500 bg-blue-50"
                                    : ""
                                }`}
                                onClick={() => {
                                  handleTimeSlotSelect(ts.day, slot);
                                }}>
                                <div className='flex justify-between'>
                                  <span>{slot.startTime}</span>
                                  <span>-</span>
                                  <span>{slot.endTime}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Customer Details",
        component: () => (
          <div className='space-y-4'>
            {blockTimer && (
              <div className='flex items-center justify-center space-x-2 mb-4 p-2 bg-yellow-50 border border-yellow-300 rounded-md'>
                <Clock className='h-4 w-4 text-yellow-600' />
                <span className='text-yellow-600'>
                  Time slot reserved for {formatTime(blockTimer)}
                </span>
              </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Salutation</Label>
                <Select
                  value={customerDetails?.salutation}
                  onValueChange={(value) =>
                    setValue("customerDetails.salutation", value, {
                      shouldValidate: true,
                    })
                  }>
                  <SelectTrigger className='hover:bg-gray-100 transition-transform duration-200 cursor-pointer'>
                    <SelectValue placeholder='Select Salutation' />
                  </SelectTrigger>
                  <SelectContent>
                    {["Mr.", "Ms.", "Mrs."].map((salute) => (
                      <SelectItem key={salute} value={salute}>
                        {salute}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>Full Name</Label>
                <Input
                  disabled
                  placeholder='Full Name'
                  value={customerDetails?.fullName}
                  // onChange={(e) =>
                  //   setValue("customerDetails.fullName", e.target.value, {
                  //     shouldValidate: true,
                  //   })
                  // }
                />
              </div>
              <div className='space-y-2'>
                <Label>Mobile Number</Label>
                <Input
                  disabled
                  placeholder='Mobile Number'
                  value={customerDetails?.mobileNo}
                  // onChange={(e) =>
                  //   setValue("customerDetails.mobileNo", e.target.value, {
                  //     shouldValidate: true,
                  //   })
                  // }
                />
              </div>
              <div className='space-y-2'>
                <Label>Email</Label>
                <Input
                  disabled
                  placeholder='Email'
                  type='email'
                  value={customerDetails?.email}
                  // onChange={(e) =>
                  //   setValue("customerDetails.email", e.target.value, {
                  //     shouldValidate: true,
                  //   })
                  // }
                />
              </div>

              <div className='space-y-2'>
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    id='whatsappSame'
                    checked={customerDetails?.whatsappSame}
                    onChange={(e) =>
                      setValue(
                        "customerDetails.whatsappSame",
                        e.target.checked,
                        {
                          shouldValidate: true,
                        }
                      )
                    }
                    className='h-4 w-4'
                  />
                  <Label htmlFor='whatsappSame'>
                    WhatsApp same as mobile number
                  </Label>
                </div>
              </div>
              {!customerDetails?.whatsappSame && (
                <div className='space-y-2'>
                  <Label>WhatsApp Number</Label>
                  <Input
                    placeholder='WhatsApp Number'
                    value={customerDetails?.whatsappNumber}
                    onChange={(e) =>
                      setValue(
                        "customerDetails.whatsappNumber",
                        e.target.value,
                        {
                          shouldValidate: true,
                        }
                      )
                    }
                  />
                </div>
              )}
              <div className='space-y-2 col-span-1 md:col-span-2'>
                <Label>Will you be present during the service?</Label>
                <Select
                  value={customerDetails?.presentDuringService}
                  onValueChange={(value) =>
                    setValue(
                      "customerDetails.presentDuringService",
                      value as "Yes" | "No",
                      {
                        shouldValidate: true,
                      }
                    )
                  }>
                  <SelectTrigger className='hover:bg-gray-100 transition-transform duration-200 cursor-pointer'>
                    <SelectValue placeholder='Select Option' />
                  </SelectTrigger>
                  <SelectContent>
                    {["Yes", "No"].map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2 col-span-1 md:col-span-2'>
                <Label>Special Instructions (optional)</Label>
                <Textarea
                  placeholder='Any special instructions for the service'
                  value={customerDetails?.specialInstructions}
                  onChange={(e) =>
                    setValue(
                      "customerDetails.specialInstructions",
                      e.target.value,
                      {
                        shouldValidate: true,
                      }
                    )
                  }
                  rows={4}
                />
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "Review & Confirm",
        component: () => (
          <div className='space-y-4'>
            {blockTimer && (
              <div className='flex items-center justify-center space-x-2 mb-4 p-2 bg-yellow-50 border border-yellow-300 rounded-md'>
                <Clock className='h-4 w-4 text-yellow-600' />
                <span className='text-yellow-600'>
                  Time slot reserved for {formatTime(blockTimer)}
                </span>
              </div>
            )}

            <div className='border p-4 rounded-lg space-y-4'>
              <h3 className='font-medium text-lg'>Location Details</h3>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <span className='text-sm text-gray-500'>Area</span>
                  <p>{areas.find((a) => a.id === area)?.name}</p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>District</span>
                  <p>
                    {districts.find((d) => d.id.toString() === district)?.name}
                  </p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>Property</span>
                  <p>
                    {properties.find((p) => p.id.toString() === property)?.name}
                  </p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>Residence Type</span>
                  <p>
                    {residences.filter((r) => r.id === residenceType)[0].type}
                  </p>
                </div>
              </div>
            </div>

            <div className='border p-4 rounded-lg space-y-4'>
              <h3 className='font-medium text-lg'>Service Details</h3>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <span className='text-sm text-gray-500'>Frequency</span>
                  <p>{frequencies.find((f) => f.id === frequency)?.label}</p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>Start Date</span>
                  <p>
                    {startDate ? moment(startDate).format("YYYY-MM-DD") : ""}
                  </p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>Duration</span>
                  <p>
                    {months} {months === 1 ? "Month" : "Months"}
                  </p>
                </div>
                {/* <div>
      <span className='text-sm text-gray-500'>End Date</span>
      <p>
        {startDate
          ? moment(startDate)
              .add(months, "months")
              .format("YYYY-MM-DD")
          : ""}
      </p>
    </div> */}
              </div>
            </div>

            <div className='border p-4 rounded-lg space-y-4'>
              <h3 className='font-medium text-lg'>Selected Time Slots</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                {selectedSlotsData.map((slot, index) => (
                  <div key={index} className='bg-blue-50 p-2 rounded'>
                    <span className='text-sm text-gray-500'>{slot.day}</span>
                    <p>
                      {slot.start_time} - {slot.end_time}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className='border p-4 rounded-lg space-y-4'>
              <h3 className='font-medium text-lg'>Customer Details</h3>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <span className='text-sm text-gray-500'>Name</span>
                  <p>
                    {customerDetails?.salutation} {customerDetails?.fullName}
                  </p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>Mobile Number</span>
                  <p>{customerDetails?.mobileNo}</p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>Email</span>
                  <p>{customerDetails?.email}</p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>
                    Apartment Number
                  </span>
                  <p>{customerDetails?.apartmentNumber}</p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>WhatsApp Number</span>
                  <p>
                    {customerDetails?.whatsappSame
                      ? customerDetails?.mobileNo
                      : customerDetails?.whatsappNumber}
                  </p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>
                    Present During Service
                  </span>
                  <p>{customerDetails?.presentDuringService}</p>
                </div>
              </div>
              {customerDetails?.specialInstructions && (
                <div>
                  <span className='text-sm text-gray-500'>
                    Special Instructions
                  </span>
                  <p>{customerDetails?.specialInstructions}</p>
                </div>
              )}
            </div>
            <div className='border p-4 rounded-lg space-y-4'>
              <h3 className='font-medium text-lg'>Total Price</h3>
              <div className='grid grid-cols-2 gap-2'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm text-gray-800'>
                    {
                      pricings.filter((p) =>
                        p.frequency.includes(
                          bookingData ? bookingData.recurrence_plan : frequency
                        )
                      )[0].currency
                    }
                  </span>
                  <p>
                    {
                      pricings.filter((p) =>
                        p.frequency.includes(
                          bookingData ? bookingData.recurrence_plan : frequency
                        )
                      )[0].total_amount
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ],
    renew: [
      {
        title: "Select duration and service start date",
        component: () => (
          <div className='space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Duration (Months)</Label>
                <Select
                  value={months?.toString()}
                  onValueChange={(e) => {
                    setValue("months", parseInt(e), {
                      shouldValidate: true,
                    });
                  }}>
                  <SelectTrigger className='hover:bg-gray-100 transition-transform duration-200 cursor-pointer'>
                    <SelectValue placeholder='Select Duration' />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_DURATION.map((sd) => (
                      <SelectItem key={sd} value={sd.toString()}>
                        {sd} {sd === 1 ? "Month" : "Months"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label>Start Date</Label>
                {!loading.calendar ? (
                  <CustomDatePicker
                    setUserSelected={setUserSelectedDate}
                    startDate={startDate}
                    setStartDate={(d: any) => {
                      setUserSelectedDate(true);
                      setValue("startDate", d as Date, {
                        shouldValidate: true,
                      });
                    }}
                    minDate={
                      bookingData?.end_date
                        ? new Date(
                            new Date(bookingData.end_date).setDate(
                              new Date(bookingData.end_date).getDate() + 1
                            )
                          )
                        : new Date()
                    } // Start date from bookingData.end_date + 1 or today
                    maxDate={
                      months
                        ? new Date(
                            new Date(
                              bookingData?.end_date || new Date()
                            ).setMonth(
                              new Date(
                                bookingData?.end_date || new Date()
                              ).getMonth() + months || 1
                            )
                          )
                        : new Date(
                            new Date(
                              bookingData?.end_date || new Date()
                            ).setMonth(
                              new Date(
                                bookingData?.end_date || new Date()
                              ).getMonth() + 1
                            )
                          )
                    }
                    dateStatusMap={calendar}
                  />
                ) : (
                  <Loader />
                )}
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "Select Bundle",
        component: () => (
          <div className='space-y-4'>
            {loading.bundles ? (
              <div className='flex justify-center py-8'>
                <Loader2 className='h-8 w-8 animate-spin' />
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {bundles[0]?.bundles.map((bundle: any) => (
                  <div
                    key={bundle.id}
                    className={`border p-4 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                      bundleId === bundle.id ? "border-blue-500 bg-blue-50" : ""
                    }`}
                    onClick={() =>
                      setValue("bundleId", bundle.id, { shouldValidate: true })
                    }>
                    <h3 className='font-medium'>{bundle.title}</h3>
                  </div>
                ))}
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Select Time Slot",
        component: () => (
          <div className='space-y-4'>
            {loading.timeSlots ? (
              <div className='flex justify-center py-8'>
                <Loader2 className='h-8 w-8 animate-spin' />
              </div>
            ) : (
              <div className='space-y-6'>
                {timeSlots
                  .slice(0, getSliceEndIndex(bookingData.recurrence_plan))
                  .map((ts: any) => (
                    <div key={ts.day} className='space-y-2'>
                      <h3 className='font-medium text-lg'>{ts.day}</h3>
                      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        {ts.timeSlots.map((slot: any, idx: number) => {
                          // Create unique ID for each slot
                          const slotId = `${slot.scheduleId}_${slot.startTime}-${slot.endTime}`;

                          return (
                            <div
                              key={idx}
                              className={`border p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                                // Check if this slot is selected for this day
                                selectedSlots[ts.day] === slotId
                                  ? "border-blue-500 bg-blue-50"
                                  : ""
                              }`}
                              onClick={() => {
                                handleTimeSlotSelect(ts.day, slot);
                              }}>
                              <div className='flex justify-between'>
                                <span>{slot.startTime}</span>
                                <span>-</span>
                                <span>{slot.endTime}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Extra Details",
        component: () => (
          <div className='space-y-4'>
            {blockTimer && (
              <div className='flex items-center justify-center space-x-2 mb-4 p-2 bg-yellow-50 border border-yellow-300 rounded-md'>
                <Clock className='h-4 w-4 text-yellow-600' />
                <span className='text-yellow-600'>
                  Time slot reserved for {formatTime(blockTimer)}
                </span>
              </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label>Apartment Number</Label>
                <Input
                  placeholder='Apartment Number'
                  value={customerDetails?.apartmentNumber}
                  defaultValue={bookingData?.appartment_number}
                  onChange={(e) =>
                    setValue(
                      "customerDetails.apartmentNumber",
                      e.target.value,
                      {
                        shouldValidate: true,
                      }
                    )
                  }
                />
              </div>

              <div className='space-y-2 col-span-1 md:col-span-2'>
                <Label>Will you be present during the service?</Label>
                <Select
                  value={customerDetails?.presentDuringService as string}
                  defaultValue={
                    bookingData?.user_available_in_apartment ? "Yes" : "No"
                  }
                  onValueChange={(value) =>
                    setValue(
                      "customerDetails.presentDuringService",
                      value as "Yes" | "No",
                      {
                        shouldValidate: true,
                      }
                    )
                  }>
                  <SelectTrigger className='hover:bg-gray-100 transition-transform duration-200 cursor-pointer'>
                    <SelectValue placeholder='Select Option' />
                  </SelectTrigger>
                  <SelectContent>
                    {["Yes", "No"].map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2 col-span-1 md:col-span-2'>
                <Label>Special Instructions</Label>
                <Textarea
                  placeholder='Any special instructions for the service'
                  value={customerDetails?.specialInstructions}
                  onChange={(e) =>
                    setValue(
                      "customerDetails.specialInstructions",
                      e.target.value,
                      {
                        shouldValidate: true,
                      }
                    )
                  }
                  rows={4}
                />
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "Review & Confirm",
        component: () => (
          <div className='space-y-4'>
            {blockTimer && (
              <div className='flex items-center justify-center space-x-2 mb-4 p-2 bg-yellow-50 border border-yellow-300 rounded-md'>
                <Clock className='h-4 w-4 text-yellow-600' />
                <span className='text-yellow-600'>
                  Time slot reserved for {formatTime(blockTimer)}
                </span>
              </div>
            )}
            <div className='border p-4 rounded-lg space-y-4'>
              <h3 className='font-medium text-lg'>Location Details</h3>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <span className='text-sm text-gray-500'>Area</span>
                  <p>{areas.find((a) => a.id === area)?.name}</p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>District</span>
                  <p>
                    {
                      districts.find((d) =>
                        d.id === bookingData
                          ? bookingData.district_id
                          : district
                      )?.name
                    }
                  </p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>Property</span>
                  <p>
                    {
                      properties.find((p) =>
                        p.id === bookingData
                          ? bookingData.property_id
                          : property
                      )?.name
                    }
                  </p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>Residence Type</span>
                  <p>
                    {
                      residences.filter((r) =>
                        r.id === bookingData
                          ? bookingData.residence_type.id
                          : residenceType
                      )[0].type
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className='border p-4 rounded-lg space-y-4'>
              <h3 className='font-medium text-lg'>Service Details</h3>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <span className='text-sm text-gray-500'>Frequency</span>
                  <p>{frequencies.find((f) => f.id === frequency)?.label}</p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>Start Date</span>
                  <p>
                    {startDate ? moment(startDate).format("YYYY-MM-DD") : ""}
                  </p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>Duration</span>
                  <p>
                    {months} {months === 1 ? "Month" : "Months"}
                  </p>
                </div>
                {/* <div>
                  <span className='text-sm text-gray-500'>End Date</span>
                  <p>
                    {startDate
                      ? moment(startDate)
                          .add(months, "months")
                          .format("YYYY-MM-DD")
                      : ""}
                  </p>
                </div> */}
              </div>
            </div>

            <div className='border p-4 rounded-lg space-y-4'>
              <h3 className='font-medium text-lg'>Selected Time Slots</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                {selectedSlotsData.map((slot, index) => (
                  <div key={index} className='bg-blue-50 p-2 rounded'>
                    <span className='text-sm text-gray-500'>{slot.day}</span>
                    <p>
                      {slot.start_time} - {slot.end_time}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className='border p-4 rounded-lg space-y-4'>
              <h3 className='font-medium text-lg'>Customer Details</h3>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <span className='text-sm text-gray-500'>Name</span>
                  <p>
                    {customerDetails?.salutation} {customerDetails?.fullName}
                  </p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>Mobile Number</span>
                  <p>{customerDetails?.mobileNo}</p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>Email</span>
                  <p>{customerDetails?.email}</p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>
                    Apartment Number
                  </span>
                  <p>{customerDetails?.apartmentNumber}</p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>WhatsApp Number</span>
                  <p>
                    {customerDetails?.whatsappSame
                      ? customerDetails?.mobileNo
                      : customerDetails?.whatsappNumber}
                  </p>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>
                    Present During Service
                  </span>
                  <p>{customerDetails?.presentDuringService}</p>
                </div>
              </div>
              {customerDetails?.specialInstructions && (
                <div>
                  <span className='text-sm text-gray-500'>
                    Special Instructions
                  </span>
                  <p>{customerDetails?.specialInstructions}</p>
                </div>
              )}
            </div>
          </div>
        ),
      },
    ],
  };

  const steps = STEPS[type];

  const handleNext = async () => {
    const formValues = form.getValues();
    if (currentStep < steps.length - 1) {
      if (type === "new" && !formValues.subService) {
        toast.error("Please select the service");
        return;
      } else if (currentStep === 0) {
        try {
          setGlobalLoading(true);
          const userId = user?.id; // Assuming you have user info
          if (!userId) return true; // Skip check if no user
          const hasSameLocationBooking = activeBookings.some((booking: any) => {
            return (
              booking.area_id === formValues.area &&
              booking.district_id === formValues.district &&
              booking.property_id === formValues.property &&
              booking.appartment_number === customerDetails.apartmentNumber &&
              booking.appartment_number === user.apartment_number &&
              booking.service.id === formValues.subService
            );
          });
          if (
            hasSameLocationBooking &&
            type === "new" &&
            selectedSubservice[0].name === "Regular Cleaning"
          ) {
            // toast.error(
            //   "You already have a booking at this place, please select different address!"
            // );
            setAlreadyExistsModal(true);
            return;
          } else {
            if (bookingData && startDate && months) {
              await fetchBundles(frequency, startDate);
              setValue("bundleId", "");
              setValue("timeSlotId", "");
              setSlotsBlocked(false);
            } else {
              if (
                frequency &&
                startDate &&
                property &&
                residenceType &&
                months
              ) {
                await fetchBundles(frequency, startDate);
                setValue("bundleId", "");
                setValue("timeSlotId", "");
                setSlotsBlocked(false);
              }
            }
            setCurrentStep((prev) => prev + 1);
          }
        } catch (error: any) {
          toast.error(error.message);
        } finally {
          setGlobalLoading(false);
        }
        return;
      }
      if (type === "new" && currentStep === 1) {
        await fetchBundles(frequency, startDate);
        setValue("bundleId", "");
        setValue("timeSlotId", "");
        setSlotsBlocked(false);
      }

      setCurrentStep((prev) => prev + 1);
    } else {
      onSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      setUserSelectedDate(false);
    }
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-2xl max-h-[500px] overflow-y-scroll'>
        <DialogHeader>
          <DialogTitle>
            {type === "new" ? "Book New Service" : "Renew Service"} - Step{" "}
            {currentStep + 1} of {steps.length}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <div className='space-y-4'>
            <div className='py-4'>
              <h3 className='text-lg font-medium'>
                {steps[currentStep].title}
              </h3>
              <div className='py-4'>{steps[currentStep].component()}</div>
            </div>

            <div className='flex justify-between items-center gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={handleBack}
                disabled={currentStep === 0}>
                <ChevronLeft className='h-4 w-4 mr-2' />
                Back
              </Button>
              {type === "new" &&
                currentStep === steps.length - 2 &&
                !blockId && (
                  <div className='flex justify-center '>
                    <Button
                      type='button'
                      onClick={blockTimeSlot}
                      disabled={
                        !validateStep(3) || loading.blockingSlot || slotsBlocked
                      }
                      className='w-full md:w-auto'>
                      {loading.blockingSlot ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Blocking Schedule...
                        </>
                      ) : blockId ? (
                        "Schedule Blocked"
                      ) : (
                        "Block Schedule"
                      )}
                    </Button>
                  </div>
                )}

              {type === "renew" &&
                currentStep === steps.length - 2 &&
                !blockId && (
                  <div className='flex justify-center '>
                    <Button
                      type='button'
                      onClick={blockTimeSlot}
                      disabled={
                        blockId !== null || loading.blockingSlot || slotsBlocked
                      }
                      className='w-full md:w-auto'>
                      {loading.blockingSlot ? (
                        <>
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          Blocking Schedule...
                        </>
                      ) : blockId ? (
                        "Schedule Blocked"
                      ) : (
                        "Block Schedule"
                      )}
                    </Button>
                  </div>
                )}

              {!loading.confirmBooking && !globalLoading ? (
                <Button
                  disabled={
                    type === "new"
                      ? currentStep === 1
                        ? !userSelectedDate
                        : !validateStep(currentStep)
                      : !validateRenewalStep(currentStep)
                  }
                  type='button'
                  onClick={handleNext}>
                  {isLastStep ? "Confirm" : "Next"}
                  {!isLastStep && (
                    <ChevronRight className='h-4 w-4 ml-2 z-50' />
                  )}
                </Button>
              ) : (
                <>
                  <Loader2 className='mr-2 h-6 w-6 animate-spin' />
                  {!globalLoading && "Confirming booking..."}
                </>
              )}
            </div>
          </div>
        </Form>
      </DialogContent>
      <ServicePackageModal
        isOpen={alreadyExistsModal}
        onClose={() => {
          setAlreadyExistsModal(false);
        }}
        onBookNew={() => {
          setAlreadyExistsModal(false);
        }}
        onRenew={() => {
          onClose(null, 0);
          setAlreadyExistsModal(false);
          openRenew();
        }}
      />
    </Dialog>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Package } from "./CancelPackageModal";
import { Label } from "./ui/label";
import {
  format,
  addDays,
  parseISO,
  isAfter,
  isBefore,
  isSameDay,
  isEqual,
} from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import TeamAvailabilityAction from "@/actions/team-availability";
import RescheduleTimeslotsAction from "@/actions/reschedule-timeslots";
import ReschedulesAction from "@/actions/reschedule";
import { toast } from "sonner";
import moment from "moment";
import CalendarAction from "@/actions/calendar";
import CustomDatePicker from "./ui/custom-date-picker";
import Loader from "./ui/loader";
import { DateStatus } from "@/types";

// Shimmer loading effect component
const Shimmer = () => (
  <div className='animate-pulse'>
    <div className='h-10 bg-gray-200 rounded-md mb-4'></div>
    <div className='h-20 bg-gray-200 rounded-md'></div>
  </div>
);

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  return format(date, "do MMMM yyyy");
};

const formatTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(":");
  const hour = parseInt(hours, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${suffix}`;
};

function formatTimeTo24Hrs(timeString: string): string {
  // Split the time string into components
  const [time, modifier] = timeString.split(" ");
  let [hours, minutes] = time.split(":");

  // Convert hours to a number
  let hoursNum = parseInt(hours, 10);

  // Handle PM times
  if (modifier === "PM" && hoursNum !== 12) {
    hoursNum += 12;
  }

  // Handle AM times (e.g., "12:30 AM" should be "00:30")
  if (modifier === "AM" && hoursNum === 12) {
    hoursNum = 0;
  }

  // Format hours and minutes to two digits
  const formattedHours = hoursNum.toString().padStart(2, "0");
  const formattedMinutes = minutes.padStart(2, "0");

  // Return the time in 24-hour format
  return `${formattedHours}:${formattedMinutes}`;
}
interface TeamAvailability {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  team: {
    id: string;
    name: string;
  };
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface ReschedulePackageModalProps {
  pkg: Package;
  onSuccess: (booking: Package) => void;
  onClose: () => void;
}

// Steps for the reschedule process
enum RescheduleStep {
  SELECT_SERVICE_DATE,
  SELECT_DATE,
  SELECT_TIMESLOT,
  REVIEW_SUMMARY,
}

const ReschedulePackageModal = ({
  pkg,
  onSuccess,
  onClose,
}: ReschedulePackageModalProps) => {
  // Current step in the reschedule flow
  const [currentStep, setCurrentStep] = useState<RescheduleStep>(
    RescheduleStep.SELECT_SERVICE_DATE
  );

  const [timeSlotLoading, setTimeSlotLoading] = useState(true);
  const [userSelectedDate, setUserSelectedDate] = useState<boolean>(false);
  // Service date selection
  const [selectedAvailability, setSelectedAvailability] =
    useState<TeamAvailability | null>(null);
  const [teamAvailabilities, setTeamAvailabilities] = useState<
    TeamAvailability[]
  >([]);

  // Date selection
  const [newStartDate, setNewStartDate] = useState<Date | undefined>(undefined);

  // Effect to fetch time slots when this step is rendered
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedAvailability || !newStartDate) return;

      try {
        if (selectedAvailability.team.id && newStartDate) {
          setTimeSlotLoading(true);

          // Call the server action with necessary data
          const response = await RescheduleTimeslotsAction(
            selectedAvailability.team.id,
            format(newStartDate, "yyyy-MM-dd"),
            pkg.serviceMinutes
          );

          // Transform the response into time slots format
          const slots = response.map((slot: any) => ({
            id: `${slot.id}_${slot.start_time}-${slot.end_time}`,
            time: `${formatTime(slot.start_time)} - ${formatTime(
              slot.end_time
            )}`,
            available: slot.is_available,
          }));

          setAvailableTimeSlots(slots);
          setCurrentStep(RescheduleStep.SELECT_TIMESLOT);
        }
      } catch (error) {
        console.error("Error fetching time slots:", error);
        // Set a fallback or empty state
        setAvailableTimeSlots([]);
      } finally {
        setTimeSlotLoading(false);
      }
    };

    fetchTimeSlots();
  }, [selectedAvailability, newStartDate, pkg.serviceMinutes]);

  // Time slot selection
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamAvailabilities = async () => {
      try {
        if (pkg.teamAvailabilities && pkg.teamAvailabilities.length > 0) {
          setLoading(true);
          const availabilities = await TeamAvailabilityAction(
            pkg.teamAvailabilities
          );

          // Sort availabilities by date for easier processing
          availabilities.sort(
            (a: any, b: any) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          );

          setTeamAvailabilities(availabilities);
        }
      } catch (error) {
        console.error("Error fetching team availabilities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamAvailabilities();
  }, [pkg.teamAvailabilities]);

  useEffect(() => {
    if (selectedAvailability) {
      fetchCalendar();
    }
  }, [selectedAvailability]);
  const handleServiceDateSelect = (availability: TeamAvailability) => {
    setSelectedAvailability(availability);
    setCurrentStep(RescheduleStep.SELECT_DATE);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setNewStartDate(date);
    if (date) {
      setCurrentStep(RescheduleStep.SELECT_TIMESLOT);
    }
  };

  const handleTimeSlotSelect = (slotId: string) => {
    setSelectedTimeSlot(slotId);
    setCurrentStep(RescheduleStep.REVIEW_SUMMARY);
  };

  const handleBackButton = () => {
    switch (currentStep) {
      case RescheduleStep.SELECT_DATE:
        setCurrentStep(RescheduleStep.SELECT_SERVICE_DATE);
        break;
      case RescheduleStep.SELECT_TIMESLOT:
        setCurrentStep(RescheduleStep.SELECT_DATE);
        break;
      case RescheduleStep.REVIEW_SUMMARY:
        setCurrentStep(RescheduleStep.SELECT_TIMESLOT);
        break;
      default:
        break;
    }
  };

  const [disableConfirm, setDisableConfirm] = useState(false);
  const handleReschedule = async () => {
    try {
      setDisableConfirm(true);
      if (!selectedAvailability || !newStartDate || !selectedTimeSlot) {
        alert("Please complete all selections");
        return;
      }

      const selectedTime =
        availableTimeSlots.find((slot) => slot.id === selectedTimeSlot)?.time ||
        "";
      const timeSplit = selectedTime.split("-");
      const startTime = formatTimeTo24Hrs(timeSplit[0].trim());
      const endTime = formatTimeTo24Hrs(timeSplit[1].trim());
      const scheduleId = selectedTimeSlot.split("_").at(0) || "";
      const rescheduleRes = await ReschedulesAction(
        selectedAvailability.id,
        scheduleId,
        startTime,
        endTime
      );
      toast.success("Reschedule successfully", {
        description: "Your service date has been rescheduled.",
        duration: 5000, // 5 seconds
      });
      setDisableConfirm(false);
      onSuccess(pkg);
      onClose();
    } catch (error: any) {
      toast.error("Unable to reschedule", {
        description: error.message,
        duration: 5000, // 5 seconds
      });
      setDisableConfirm(false);
      onClose();
    }
  };

  // Function to determine if a date should be disabled in the calendar
  const isDateDisabled = (date: Date): boolean => {
    if (!selectedAvailability) return true;

    const selectedServiceDate = parseISO(selectedAvailability.date);
    const minDate = addDays(selectedServiceDate, 1);

    // Get the last service date
    const lastServiceDate =
      teamAvailabilities.length > 0
        ? parseISO(teamAvailabilities[teamAvailabilities.length - 1].date)
        : new Date(pkg.endDate);

    const maxDate = addDays(lastServiceDate, 7);

    const isLastDate = isSameDay(date, lastServiceDate);

    // If it's the last date, allow the next 7 days
    if (isLastDate) {
      const next7Days = addDays(date, 7);
      if (isBefore(date, next7Days)) {
        return false;
      }
    }

    // Check if date is out of bounds
    if (isBefore(date, minDate) || isAfter(date, maxDate)) {
      return true;
    }

    // Check if the date is a service date or day after a service
    for (const availability of teamAvailabilities) {
      const serviceDate = parseISO(availability.date);

      // Disable the service date itself
      if (isSameDay(date, serviceDate)) {
        return true;
      }

      // Disable the day immediately after the service date
      if (isSameDay(date, addDays(serviceDate, 1))) {
        return true;
      }
    }

    return false;
  };

  const [calendar, setCalendar] = useState<Record<string, DateStatus>>({});
  const fetchCalendar = async () => {
    try {
      setLoading(true);

      const endDate = teamAvailabilities[teamAvailabilities.length - 1].date;
      const response = await CalendarAction(
        selectedAvailability?.date as string,
        endDate,
        undefined,
        undefined,
        undefined,
        undefined,
        pkg.booking_id || pkg.id,
        pkg.team_id
      );
      const unavailableDates = response.data;
      setCalendar(unavailableDates);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setLoading(false);
    }
  };

  // Render functions for each step
  const renderServiceDateSelection = () => (
    <div>
      <Label className='text-sm font-medium mb-2 block'>
        Select a service date to reschedule
      </Label>
      {loading ? (
        <>
          <Shimmer />
          <Shimmer />
        </>
      ) : teamAvailabilities.length === 0 ? (
        <p className='text-sm text-gray-500'>No service dates found</p>
      ) : (
        <div className='space-y-2 overflow-y-scroll max-h-[300px]'>
          {teamAvailabilities.map((availability) => (
            <div
              key={availability.id}
              className={cn(
                "p-3 border rounded-md cursor-pointer transition-colors",
                selectedAvailability?.id === availability.id
                  ? "border-blue-500 bg-blue-50"
                  : "hover:bg-gray-50"
              )}
              onClick={() => handleServiceDateSelect(availability)}>
              <div className='flex justify-between items-center'>
                <div>
                  <p className='font-medium'>{availability.team.name}</p>
                  <p className='text-sm text-gray-500'>
                    {formatDate(availability.date)}
                  </p>
                  <p className='text-sm text-gray-500'>
                    {formatTime(availability.start_time)} -{" "}
                    {formatTime(availability.end_time)}
                  </p>
                </div>
                {selectedAvailability?.id === availability.id && (
                  <div className='h-4 w-4 rounded-full bg-blue-500'></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDateSelection = () => {
    if (!selectedAvailability) return null;

    const selectedServiceDate = parseISO(selectedAvailability.date);
    const minSelectableDate = selectedServiceDate;

    // Get the last service date
    const lastServiceDate =
      teamAvailabilities.length > 0
        ? parseISO(teamAvailabilities[teamAvailabilities.length - 1].date)
        : new Date(pkg.endDate);

    let maxSelectableDate = addDays(lastServiceDate, 7);

    return (
      <div className='w-full'>
        <div className='flex items-center mb-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleBackButton}
            className='mr-2'>
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <Label className='text-sm font-medium'>Select New Date</Label>
        </div>

        <div className='text-sm text-gray-500 mb-4'>
          <p>
            Selected service: {selectedAvailability.team.name} on{" "}
            {formatDate(selectedAvailability.date)}
          </p>
          <p className='mt-1'>Please select a new date.</p>
          <p className='mt-1 text-xs'>
            Note: Dates with scheduled services and the day immediately after
            each service are unavailable.
          </p>
        </div>

        <div className='flex items-center justify-center w-full'>
          {!loading ? (
            <CustomDatePicker
              startDate={moment(selectedAvailability.date).toDate()}
              setStartDate={(d: any) => {
                setNewStartDate(d);
              }}
              minDate={minSelectableDate}
              maxDate={maxSelectableDate}
              dateStatusMap={calendar}
              setUserSelected={setUserSelectedDate}
            />
          ) : (
            <Loader />
          )}
        </div>
      </div>
    );
  };

  const renderTimeSlotSelection = () => {
    if (!selectedAvailability || !newStartDate) return null;
    return (
      <div>
        <div className='flex items-center mb-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleBackButton}
            className='mr-2'>
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <Label className='text-sm font-medium'>Select Time Slot</Label>
        </div>

        <div className='text-sm text-gray-500 mb-4'>
          <p>Selected service: {selectedAvailability?.team.name}</p>
          <p>New date: {format(newStartDate as Date, "do MMMM yyyy")}</p>
          <p className='mt-1'>Please select a preferred time slot:</p>
        </div>

        {timeSlotLoading ? (
          // Shimmer effect while loading
          <div className='grid grid-cols-2 gap-3 mt-4'>
            {[...Array(6)].map((_, index) => (
              <div
                key={`shimmer-${index}`}
                className='animate-pulse p-3 h-12 bg-gray-200 rounded-md'
              />
            ))}
          </div>
        ) : availableTimeSlots.length === 0 ? (
          // No time slots available
          <div className='text-center py-8'>
            <p className='text-gray-500'>
              No available time slots for this date
            </p>
            <Button
              variant='outline'
              onClick={() => setCurrentStep(RescheduleStep.SELECT_DATE)}
              className='mt-4'>
              Choose Another Date
            </Button>
          </div>
        ) : (
          // Display available time slots
          <div className='grid grid-cols-2 gap-3 mt-4'>
            {availableTimeSlots.map((slot) => (
              <div
                key={slot.id}
                className={cn(
                  "p-3 border rounded-md cursor-pointer transition-colors text-center",
                  selectedTimeSlot === slot.id
                    ? "border-blue-500 bg-blue-50"
                    : slot.available
                    ? "hover:bg-gray-50"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
                onClick={() => {
                  if (slot.available) {
                    handleTimeSlotSelect(slot.id);
                  }
                }}>
                {formatTime(slot.time)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSummary = () => {
    if (!selectedAvailability || !newStartDate || !selectedTimeSlot)
      return null;

    const selectedTime =
      availableTimeSlots.find((slot) => slot.id === selectedTimeSlot)?.time ||
      "";

    return (
      <div>
        <div className='flex items-center mb-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleBackButton}
            className='mr-2'>
            <ArrowLeft className='h-4 w-4' />
          </Button>
          <Label className='text-sm font-medium'>Review and Confirm</Label>
        </div>

        <div className='bg-gray-50 p-4 rounded-md mb-6'>
          <h4 className='font-medium mb-3'>Reschedule Summary</h4>

          <div className='space-y-2'>
            <div className='flex'>
              <div className='w-1/3 text-gray-500'>Service:</div>
              <div className='w-2/3 font-medium'>
                {selectedAvailability.team.name}
              </div>
            </div>

            <div className='flex'>
              <div className='w-1/3 text-gray-500'>Original Date:</div>
              <div className='w-2/3'>
                {formatDate(selectedAvailability.date)}
              </div>
            </div>

            <div className='flex'>
              <div className='w-1/3 text-gray-500'>Original Time:</div>
              <div className='w-2/3'>
                {formatTime(selectedAvailability.start_time)} -{" "}
                {formatTime(selectedAvailability.end_time)}
              </div>
            </div>

            <hr className='my-2' />

            <div className='flex'>
              <div className='w-1/3 text-gray-500'>New Date:</div>
              <div className='w-2/3 font-medium'>
                {format(newStartDate, "do MMMM yyyy")}
              </div>
            </div>

            <div className='flex'>
              <div className='w-1/3 text-gray-500'>New Time:</div>
              <div className='w-2/3 font-medium'>
                {formatTime(selectedTime)}
              </div>
            </div>
          </div>
        </div>

        <p className='text-sm text-gray-500 mb-6'>
          Please review the changes above. Click &apos;Confirm Reschedule&apos;
          to proceed with these changes or go back to make adjustments.
        </p>
      </div>
    );
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className='max-w-2xl max-h-[800px] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Reschedule Package</DialogTitle>
        </DialogHeader>

        <div className='space-y-6 w-full'>
          <div className='w-full'>
            <Label className='text-sm font-medium'>Current Package Dates</Label>
            <p className='text-sm mt-1'>
              {formatDate(pkg.startDate)} - {formatDate(pkg.endDate)}
            </p>
          </div>

          {currentStep === RescheduleStep.SELECT_SERVICE_DATE &&
            renderServiceDateSelection()}
          {currentStep === RescheduleStep.SELECT_DATE && renderDateSelection()}
          {currentStep === RescheduleStep.SELECT_TIMESLOT &&
            renderTimeSlotSelection()}
          {currentStep === RescheduleStep.REVIEW_SUMMARY && renderSummary()}
        </div>

        <div className='flex justify-end gap-2 mt-4'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>

          {currentStep === RescheduleStep.REVIEW_SUMMARY && (
            <Button disabled={disableConfirm} onClick={handleReschedule}>
              Confirm Reschedule
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReschedulePackageModal;

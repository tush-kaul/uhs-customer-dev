"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { Label } from "./ui/label";
import {
  format,
  addDays,
  parseISO,
  isAfter,
  isBefore,
  isSameDay,
  addMonths,
} from "date-fns";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import moment from "moment";
import RescheduleTimeslotsAction from "@/actions/reschedule-timeslots";
import CalendarAction from "@/actions/calendar";
import CustomDatePicker from "./ui/custom-date-picker";
import { Spinner } from "./ui/spinner";
import Loader from "./ui/loader";
import ReschedulesAction from "@/actions/reschedule";
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

export interface BookingItem {
  id: string;
  booking_number: string;
  date: string;
  start_time: string;
  end_time: string;
  service_name: string;
  team: string;
  apart_type: string;
  status: string;
  team_id: string;
  booking_id: string;
  [key: string]: any;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface RescheduleBookingModalProps {
  booking: BookingItem;
  onSuccess: (booking: BookingItem) => void;
  onClose: () => void;
}

// Steps for the reschedule process
enum RescheduleStep {
  SELECT_DATE,
  SELECT_TIMESLOT,
  REVIEW_SUMMARY,
}

const RescheduleBookingModal = ({
  booking,
  onSuccess,
  onClose,
}: RescheduleBookingModalProps) => {
  // Current step in the reschedule flow
  const [currentStep, setCurrentStep] = useState<RescheduleStep>(
    RescheduleStep.SELECT_DATE
  );

  const [timeSlotLoading, setTimeSlotLoading] = useState(false);

  // Date selection
  const [newStartDate, setNewStartDate] = useState<Date | undefined>(undefined);

  // Time slot selection
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [userSelectedDate, setUserSelectedDate] = useState<boolean>(false);
  // Loading states
  const [loading, setLoading] = useState(false);
  const [calendar, setCalendar] = useState<Record<string, DateStatus>>({});

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = moment(startTime, "HH:mm:ss");
    const end = moment(endTime, "HH:mm:ss");
    return end.diff(start, "minutes");
  };
  // Effect to fetch time slots when date is selected
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!newStartDate) return;

      try {
        setTimeSlotLoading(true);

        const serviceDuration = calculateDuration(
          booking.start_time,
          booking.end_time
        );

        const response = await RescheduleTimeslotsAction(
          booking.team_id,
          format(newStartDate, "yyyy-MM-dd"),
          serviceDuration
        );

        // Transform the response into time slots format
        const slots = response.map((slot: any) => ({
          id: `${slot.id}_${slot.start_time}-${slot.end_time}`,
          time: `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`,
          available: slot.is_available,
        }));
        setAvailableTimeSlots(slots);
        handleDateSelect(newStartDate);
      } catch (error) {
        console.error("Error fetching time slots:", error);
        setAvailableTimeSlots([]);
      } finally {
        setTimeSlotLoading(false);
      }
    };

    fetchTimeSlots();
  }, [newStartDate, booking.team]);

  // Fetch calendar availability
  console.log("booking", booking);
  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        setLoading(true);
        const response = await CalendarAction(
          moment(booking.date).format("YYYY-MM-DD"),
          moment(booking.end_date).add(7, "days").format("YYYY-MM-DD"),
          undefined,
          undefined,
          undefined,
          undefined,
          booking.booking_id,
          booking.team_id
        );
        const unavailableDates = response.data;
        setCalendar(unavailableDates);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching calendar:", error);
        setLoading(false);
      }
    };

    fetchCalendar();
  }, [booking.date]);

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
      if (!newStartDate || !selectedTimeSlot) {
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
        booking.id,
        scheduleId,
        startTime,
        endTime
      );

      toast.success("Reschedule successfully", {
        description: "Your booking has been rescheduled.",
        duration: 5000,
      });
      onSuccess({
        ...booking,
        start_time: startTime,
        end_time: endTime,
        date: rescheduleRes.updatedTeamAvailability.date,
      });
      setDisableConfirm(false);
      onClose();
    } catch (error: any) {
      toast.error("Unable to reschedule", {
        description: error.message,
        duration: 5000,
      });
      setDisableConfirm(false);
      onClose();
    }
  };

  // Function to determine if a date should be disabled in the calendar

  const renderDateSelection = () => {
    if (!booking) return null;

    const selectedServiceDate = parseISO(booking.date);
    const minSelectableDate = addDays(selectedServiceDate, 1);

    // Get the last service date
    const lastServiceDate = addMonths(booking.date, 1);

    let maxSelectableDate = addDays(lastServiceDate, -1);

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
            Selected service: {booking.service_name} on{" "}
            {formatDate(booking.date)}
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
              startDate={moment(booking.date).toDate()}
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
    if (!newStartDate) return null;
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
          <p>Selected Booking: {booking.service_name}</p>
          <p>New Date: {format(newStartDate as Date, "do MMMM yyyy")}</p>
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
                {slot.time}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSummary = () => {
    if (!newStartDate || !selectedTimeSlot) return null;

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
              <div className='w-1/3 text-gray-500'>Booking Number:</div>
              <div className='w-2/3 font-medium'>{booking.booking_number}</div>
            </div>

            <div className='flex'>
              <div className='w-1/3 text-gray-500'>Service:</div>
              <div className='w-2/3 font-medium'>
                {booking.service_name} ({booking.apart_type})
              </div>
            </div>

            <div className='flex'>
              <div className='w-1/3 text-gray-500'>Team:</div>
              <div className='w-2/3'>{booking.team}</div>
            </div>

            <div className='flex'>
              <div className='w-1/3 text-gray-500'>Original Date:</div>
              <div className='w-2/3'>{formatDate(booking.date)}</div>
            </div>

            <div className='flex'>
              <div className='w-1/3 text-gray-500'>Original Time:</div>
              <div className='w-2/3'>
                {formatTime(booking.start_time)} -{" "}
                {formatTime(booking.end_time)}
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
          <DialogTitle>Reschedule Booking</DialogTitle>
        </DialogHeader>

        <div className='space-y-6 w-full'>
          {currentStep === RescheduleStep.SELECT_DATE && renderDateSelection()}
          {currentStep === RescheduleStep.SELECT_TIMESLOT &&
            renderTimeSlotSelection()}
          {currentStep === RescheduleStep.REVIEW_SUMMARY && renderSummary()}
        </div>

        <div className='flex justify-end items-center gap-2 mt-4'>
          {timeSlotLoading && <Loader />}
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

export default RescheduleBookingModal;

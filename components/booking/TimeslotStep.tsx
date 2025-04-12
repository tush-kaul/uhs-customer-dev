// components/Steps/TimeSlotStep.tsx
import React from "react";
import { Loader2, Clock } from "lucide-react";
import { TimeSlotDayType } from "@/types";
import { getSliceEndIndex } from "@/utils/constants";

type TimeSlotStepProps = {
  timeSlots: TimeSlotDayType[];
  selectedSlots: Record<string, string>;
  frequency: string;
  loading: boolean;
  handleTimeSlotSelect: (day: string, slot: any) => void;
  bookingData?: any;
  watch: (path?: string) => any;
};

export default function TimeSlotStep({
  timeSlots,
  selectedSlots,
  frequency,
  loading,
  handleTimeSlotSelect,
  bookingData,
  watch,
}: TimeSlotStepProps) {
  const requiredSlots = getSliceEndIndex(
    bookingData?.recurrence_plan || frequency || "one_time"
  );
  const selectedCount = Object.keys(selectedSlots).length;

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center py-12'>
        <Loader2 className='h-10 w-10 animate-spin text-primary mb-4' />
        <p className='text-gray-500'>Loading available time slots...</p>
      </div>
    );
  }

  if (!timeSlots || timeSlots.length === 0) {
    return (
      <div className='text-center py-12'>
        <div className='mb-4 flex justify-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-12 w-12 text-gray-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
        <h3 className='text-lg font-medium text-gray-900'>
          No time slots available
        </h3>
        <p className='mt-2 text-gray-500'>
          No time slots available for the selected date and bundle. Please try a
          different date or bundle.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Progress indicator */}
      <div className='flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200'>
        <div className='text-sm text-gray-700'>
          <span className='font-medium'>{selectedCount}</span> of{" "}
          <span className='font-medium'>{requiredSlots}</span> time slots
          selected
        </div>
        <div className='bg-gray-200 h-2 flex-1 mx-4 rounded-full overflow-hidden'>
          <div
            className='bg-primary h-full transition-all duration-300'
            style={{ width: `${(selectedCount / requiredSlots) * 100}%` }}
          />
        </div>
        <div className='text-sm font-medium'>
          {selectedCount === requiredSlots ? (
            <span className='text-green-600'>Complete</span>
          ) : (
            <span className='text-amber-600'>
              Select {requiredSlots - selectedCount} more
            </span>
          )}
        </div>
      </div>

      {timeSlots.slice(0, requiredSlots).map((ts) => (
        <div key={ts.day} className='space-y-2'>
          <div className='flex items-center gap-2'>
            <Clock className='h-5 w-5 text-gray-600' />
            <h3 className='font-medium text-lg'>{ts.day}</h3>
            <span className='text-sm text-gray-500'>{ts.date}</span>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
            {ts.timeSlots.map((slot, idx) => {
              // Create unique ID for each slot
              const slotId = `${slot.scheduleId}_${slot.startTime}-${slot.endTime}`;
              const isSelected = selectedSlots[ts.day] === slotId;

              return (
                <div
                  key={idx}
                  className={`
                      border p-3 rounded-lg cursor-pointer transition-all duration-200
                      ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "hover:bg-gray-50 border-gray-200"
                      }
                    `}
                  onClick={() => {
                    handleTimeSlotSelect(ts.day, slot);
                  }}>
                  <div className='flex justify-between items-center'>
                    <span className='font-medium'>{slot.startTime}</span>
                    <span className='text-gray-400'>to</span>
                    <span className='font-medium'>{slot.endTime}</span>
                  </div>

                  {isSelected && (
                    <div className='flex items-center mt-2 text-primary text-sm'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-4 w-4 mr-1'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M5 13l4 4L19 7'
                        />
                      </svg>
                      Selected
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

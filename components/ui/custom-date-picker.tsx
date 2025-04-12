import { DateStatus } from "@/types";
import moment from "moment";
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface CustomDatePickerProps {
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  minDate: Date;
  maxDate: Date;
  dateStatusMap: Record<string, DateStatus>;
  setUserSelected: (selected: boolean) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  startDate,
  setStartDate,
  minDate,
  maxDate,
  dateStatusMap,
  setUserSelected,
}) => {
  // Debug the dateStatusMap when it changes
  useEffect(() => {
    // Check a specific date for debugging
    const testDate = new Date(2025, 4, 13); // May 8, 2025
    const testDateStr = testDate.toISOString().split("T")[0];
  }, [dateStatusMap]);

  // Format date consistently
  const formatDateString = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  // Function to check if a date is outside the min/max range
  const isDateOutOfRange = (date: Date) => {
    return date < minDate || date > maxDate;
  };

  // Custom day class name to style dates
  const dayClassName = (date: Date) => {
    if (isDateOutOfRange(date)) {
      return "bg-gray-400 text-white "; // Gray for out-of-range dates
    }

    const dateString = moment(date).format("YYYY-MM-DD");
    const status = dateStatusMap[dateString];

    if (!status) {
      return "bg-gray-200 text-gray-600"; // Default color for dates without status
    }

    // First priority: Yellow for user bookings
    if (status.userBooked === true) {
      return "bg-yellow-500 text-white hover:bg-yellow-600";
    }
    // Second priority: Red for unavailable dates
    else if (status.available === false && status.userBooked === false) {
      return "bg-red-500 text-white cursor-not-allowed hover:bg-red-600";
    }
    // Third priority: Green for available dates
    else if (status.available === true) {
      return "bg-green-500 text-white hover:bg-green-600 cursor-pointer";
    }
    // Fallback
    else {
      return "bg-gray-200 text-gray-600";
    }
  };

  // Filter function to disable selection of unavailable dates
  const filterDate = (date: Date) => {
    if (isDateOutOfRange(date)) {
      return false;
    }
    const dateString = moment(date).format("YYYY-MM-DD");

    const status = dateStatusMap[dateString];

    // Only allow selection if date is available and not user booked
    return status?.available === true;
  };

  return (
    <div className='flex flex-col items-center'>
      <DatePicker
        selected={startDate}
        onChange={(date) => {
          setStartDate(date);
        }}
        minDate={minDate}
        maxDate={maxDate}
        inline
        dayClassName={dayClassName}
        filterDate={filterDate}
        showMonthDropdown
        showYearDropdown
        dropdownMode='select'
        // Force rerender when dateStatusMap changes
        key={Object.keys(dateStatusMap).length}
      />

      {/* Legend Container */}
      <div className='flex flex-wrap justify-center gap-4 mt-4'>
        {/* Available (Green) */}
        <div className='flex items-center'>
          <div className='w-4 h-4 bg-green-500 mr-2'></div>
          <span className='text-sm'>Available</span>
        </div>

        {/* Unavailable (Red) */}
        <div className='flex items-center'>
          <div className='w-4 h-4 bg-red-500 mr-2'></div>
          <span className='text-sm'>Unavailable</span>
        </div>

        {/* User Booked (Yellow) */}
        <div className='flex items-center'>
          <div className='w-4 h-4 bg-yellow-500 mr-2'></div>
          <span className='text-sm'>Your Booking</span>
        </div>

        {/* Out of Range (Gray) */}
        <div className='flex items-center'>
          <div className='w-4 h-4 bg-gray-400 mr-2'></div>
          <span className='text-sm'>Out of Range</span>
        </div>
      </div>
    </div>
  );
};

export default CustomDatePicker;

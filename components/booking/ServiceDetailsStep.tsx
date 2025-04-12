// components/Steps/ServiceDetailsStep.tsx
import React from "react";
import { Loader2 } from "lucide-react";
import moment from "moment";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CustomDatePicker from "@/components/ui/custom-date-picker";
import { DateStatus, FrequencyType, PricingType } from "@/types";
import { formatFrequency, SERVICE_DURATION } from "@/utils/constants";

type ServiceDetailsStepProps = {
  frequencies: FrequencyType[];
  pricings: PricingType[];
  loading: {
    frequencies: boolean;
    calendar: boolean;
  };
  calendar: Record<string, DateStatus>;
  months: number;
  userSelectedDate: boolean;
  setUserSelectedDate: (value: boolean) => void;
  selectedSubServiceName?: string;
  startDateMin?: Date;
  startDateMax?: Date;
  bookingData?: any;
  watch: (path?: string) => any;
  setValue: (
    name: string,
    value: any,
    options?: { shouldValidate?: boolean }
  ) => void;
};

export default function ServiceDetailsStep({
  frequencies,
  pricings,
  loading,
  calendar,
  months,
  userSelectedDate,
  setUserSelectedDate,
  selectedSubServiceName,
  startDateMin,
  startDateMax,
  bookingData,
  watch,
  setValue,
}: ServiceDetailsStepProps) {
  const frequency = watch("frequency");
  const startDate = watch("startDate");

  // Filter frequencies for Regular Cleaning
  const isRegularCleaning = selectedSubServiceName === "Regular Cleaning";
  const filteredFrequencies = isRegularCleaning
    ? frequencies
    : frequencies.filter((freq) => freq.id === "one_time");

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-2 md:col-span-2'>
          <Label>Frequency</Label>
          <Select
            value={bookingData ? bookingData.frequency : frequency}
            onValueChange={(value) =>
              setValue("frequency", value, { shouldValidate: true })
            }
            disabled={bookingData}>
            <SelectTrigger className='hover:bg-gray-100 transition-transform duration-200 cursor-pointer'>
              <SelectValue placeholder='Select Frequency' />
            </SelectTrigger>
            <SelectContent>
              {loading.frequencies ? (
                <SelectItem value='loading' disabled>
                  <Loader2 className='h-4 w-4 animate-spin' />
                </SelectItem>
              ) : (
                filteredFrequencies.map((freq) => (
                  <SelectItem key={freq.id} value={freq.id.toString()}>
                    {freq.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Pricing Information Card */}
        <div className='mt-2 md:col-span-2'>
          <h4 className='font-medium mb-2'>Pricing Information</h4>
          <div className='bg-slate-50 p-4 rounded-md border border-slate-200 shadow-sm'>
            {pricings.length > 0 ? (
              <div className='space-y-3'>
                {pricings.map((p) => (
                  <div key={p.id} className='flex justify-between items-center'>
                    <span className='font-medium'>
                      {formatFrequency(p.frequency)}:
                    </span>
                    <div className='flex flex-col items-end'>
                      <span className='font-semibold text-primary text-lg'>
                        {p.currency} {p.unit_amount}/-
                      </span>
                      <span className='text-gray-500 text-sm'>
                        {p.total_services}{" "}
                        {p.total_services > 1 ? "services" : "service"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-gray-500 text-center py-2'>
                Select service and residence type to view pricing
              </p>
            )}
          </div>
        </div>

        {frequency !== "one_time" && (
          <div className='space-y-2'>
            <Label>Duration (Months)</Label>
            <Select
              value={months?.toString()}
              onValueChange={(e) =>
                setValue("months", parseInt(e), { shouldValidate: true })
              }>
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
                setValue("startDate", d as Date, { shouldValidate: true });
              }}
              minDate={startDateMin || moment().toDate()}
              maxDate={startDateMax || moment().add(months, "months").toDate()}
              dateStatusMap={calendar}
              setUserSelected={setUserSelectedDate}
            />
          ) : (
            <div className='flex items-center justify-center p-4 border rounded-md'>
              <Loader2 className='h-6 w-6 animate-spin mr-2' />
              <span>Loading calendar...</span>
            </div>
          )}
        </div>
      </div>

      {/* Date selection indicator */}
      {!userSelectedDate && (
        <div className='mt-2 text-amber-500 text-sm flex items-center'>
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
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
            />
          </svg>
          Please select a start date
        </div>
      )}
    </div>
  );
}

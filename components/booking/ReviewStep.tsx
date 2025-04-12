// components/Steps/ReviewStep.tsx
import React from "react";
import {
  Clock,
  MapPin,
  Home,
  Calendar,
  Clock3,
  User,
  MessageSquare,
  CreditCard,
} from "lucide-react";
import moment from "moment";

import { formatTime, formatFrequency } from "../../utils/constants";
import {
  AreaType,
  DistrictType,
  PropertyType,
  FrequencyType,
  PricingType,
} from "@/types";

type ReviewStepProps = {
  areas: AreaType[];
  districts: DistrictType[];
  properties: PropertyType[];
  residences: any[];
  frequencies: FrequencyType[];
  selectedSlotsData: any[];
  blockTimer: number | null;
  pricings: PricingType[];
  bookingData?: any;
  watch: (path?: string) => any;
};

export default function ReviewStep({
  areas,
  districts,
  properties,
  residences,
  frequencies,
  selectedSlotsData,
  blockTimer,
  pricings,
  bookingData,
  watch,
}: ReviewStepProps) {
  const area = watch("area");
  const district = watch("district");
  const property = watch("property");
  const residenceType = watch("residenceType");
  const frequency = watch("frequency");
  const startDate = watch("startDate");
  const months = watch("months");
  const customerDetails = watch("customerDetails") || {};

  // Get frequency to display in pricing
  const displayFrequency = bookingData
    ? bookingData.recurrence_plan
    : frequency;

  // Get the selected pricing based on frequency
  const selectedPricing = pricings.find((p) =>
    p.frequency.includes(displayFrequency)
  );

  return (
    <div className='space-y-6'>
      {/* Timer banner */}
      {blockTimer && (
        <div className='flex items-center justify-center space-x-2 mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg'>
          <Clock className='h-5 w-5 text-amber-600' />
          <span className='text-amber-700 font-medium'>
            Time slot reserved for {formatTime(blockTimer)}
          </span>
        </div>
      )}

      {/* Location details card */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center'>
          <MapPin className='h-5 w-5 text-gray-600 mr-2' />
          <h3 className='font-medium text-gray-900'>Location Details</h3>
        </div>
        <div className='p-4 grid grid-cols-2 gap-4'>
          <div>
            <span className='text-sm text-gray-500 block mb-1'>Area</span>
            <p className='font-medium'>
              {areas.find((a) => a.id === area)?.name}
            </p>
          </div>
          <div>
            <span className='text-sm text-gray-500 block mb-1'>District</span>
            <p className='font-medium'>
              {districts.find((d) => d.id.toString() === district)?.name}
            </p>
          </div>
          <div>
            <span className='text-sm text-gray-500 block mb-1'>Property</span>
            <p className='font-medium'>
              {properties.find((p) => p.id.toString() === property)?.name}
            </p>
          </div>
          <div>
            <span className='text-sm text-gray-500 block mb-1'>
              Residence Type
            </span>
            <p className='font-medium'>
              {residences.find((r) => r.id === residenceType)?.type ||
                (bookingData &&
                  residences.find((r) => r.id === bookingData.residence_type_id)
                    ?.type)}
            </p>
          </div>
          <div>
            <span className='text-sm text-gray-500 block mb-1'>
              Apartment Number
            </span>
            <p className='font-medium'>{customerDetails?.apartmentNumber}</p>
          </div>
        </div>
      </div>

      {/* Service details card */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center'>
          <Home className='h-5 w-5 text-gray-600 mr-2' />
          <h3 className='font-medium text-gray-900'>Service Details</h3>
        </div>
        <div className='p-4 grid grid-cols-2 gap-4'>
          <div>
            <span className='text-sm text-gray-500 block mb-1'>Frequency</span>
            <p className='font-medium'>
              {frequencies.find((f) => f.id === frequency)?.label}
            </p>
          </div>
          <div>
            <span className='text-sm text-gray-500 block mb-1'>Start Date</span>
            <p className='font-medium'>
              {startDate ? moment(startDate).format("YYYY-MM-DD") : ""}
            </p>
          </div>
          <div>
            <span className='text-sm text-gray-500 block mb-1'>Duration</span>
            <p className='font-medium'>
              {months} {months === 1 ? "Month" : "Months"}
            </p>
          </div>
          <div>
            <span className='text-sm text-gray-500 block mb-1'>End Date</span>
            <p className='font-medium'>
              {startDate
                ? moment(startDate).add(months, "months").format("YYYY-MM-DD")
                : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Selected time slots card */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center'>
          <Clock3 className='h-5 w-5 text-gray-600 mr-2' />
          <h3 className='font-medium text-gray-900'>Selected Time Slots</h3>
        </div>
        <div className='p-4 grid grid-cols-1 sm:grid-cols-2 gap-3'>
          {selectedSlotsData.length > 0 ? (
            selectedSlotsData.map((slot, index) => (
              <div
                key={index}
                className='bg-blue-50 p-3 rounded-md border border-blue-100'>
                <span className='text-sm text-gray-600 block mb-1'>
                  {slot.day}
                </span>
                <p className='font-medium text-blue-800'>
                  {slot.start_time?.replace(":00", "")} -{" "}
                  {slot.end_time?.replace(":00", "")}
                </p>
              </div>
            ))
          ) : (
            <p className='text-gray-500 col-span-2 text-center py-2'>
              No time slots selected
            </p>
          )}
        </div>
      </div>

      {/* Customer details card */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center'>
          <User className='h-5 w-5 text-gray-600 mr-2' />
          <h3 className='font-medium text-gray-900'>Customer Details</h3>
        </div>
        <div className='p-4 grid grid-cols-2 gap-4'>
          <div>
            <span className='text-sm text-gray-500 block mb-1'>Name</span>
            <p className='font-medium'>
              {customerDetails?.salutation} {customerDetails?.fullName}
            </p>
          </div>
          <div>
            <span className='text-sm text-gray-500 block mb-1'>
              Mobile Number
            </span>
            <p className='font-medium'>{customerDetails?.mobileNo}</p>
          </div>
          <div>
            <span className='text-sm text-gray-500 block mb-1'>Email</span>
            <p className='font-medium'>{customerDetails?.email}</p>
          </div>
          <div>
            <span className='text-sm text-gray-500 block mb-1'>
              WhatsApp Number
            </span>
            <p className='font-medium'>
              {customerDetails?.whatsappSame
                ? customerDetails?.mobileNo
                : customerDetails?.whatsappNumber}
            </p>
          </div>
          <div>
            <span className='text-sm text-gray-500 block mb-1'>
              Present During Service
            </span>
            <p className='font-medium'>
              {customerDetails?.presentDuringService}
            </p>
          </div>
        </div>

        {customerDetails?.specialInstructions && (
          <div className='border-t border-gray-200 p-4'>
            <div className='flex items-start'>
              <MessageSquare className='h-5 w-5 text-gray-500 mr-2 mt-0.5' />
              <div>
                <span className='text-sm text-gray-500 block mb-1'>
                  Special Instructions
                </span>
                <p className='text-gray-700'>
                  {customerDetails?.specialInstructions}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Price card */}
      <div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
        <div className='border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center'>
          <CreditCard className='h-5 w-5 text-gray-600 mr-2' />
          <h3 className='font-medium text-gray-900'>Total Price</h3>
        </div>
        <div className='p-4'>
          {selectedPricing ? (
            <div className='flex items-center justify-between'>
              <div>
                <span className='text-sm text-gray-500 block mb-1'>
                  {formatFrequency(selectedPricing.frequency)} (
                  {selectedPricing.total_services} services)
                </span>
                <p className='text-2xl font-bold text-primary'>
                  {selectedPricing.currency} {selectedPricing.total_amount}
                </p>
              </div>
              <div className='bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200'>
                Ready to book
              </div>
            </div>
          ) : (
            <p className='text-gray-500 text-center py-2'>
              No pricing information available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// components/booking/BookingCard.tsx
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface BookingCardProps {
  item: any;
  handleOpenModal: (
    booking: any,
    type: "cancel" | "reschedule" | "renew"
  ) => void;
  formatTime: (time: string) => string;
  ImagePathSetting: Record<string, string>;
  getStatusClassName: (item: any) => string;
  getStatusText: (item: any) => string;
  showActionButtons: (item: any) => boolean;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  item,
  handleOpenModal,
  formatTime,
  ImagePathSetting,
  getStatusClassName,
  getStatusText,
  showActionButtons,
}) => {
  return (
    <div className='bg-white rounded-lg shadow p-4 space-y-3'>
      {/* Service details */}
      <div className='flex items-center gap-3'>
        <div className='flex-shrink-0'>
          <Image
            src={`/icons/${ImagePathSetting[item?.service_name]}.svg`}
            alt={item.service_name}
            className='w-10 h-10 rounded-full object-cover'
            width={50}
            height={50}
          />
        </div>
        <div className='flex-grow'>
          <p className='font-medium'>{item.service_name}</p>
          <p className='text-sm text-gray-500'>#{item.booking_number}</p>
        </div>
      </div>

      {/* Date and Apartment info */}
      <div className='grid grid-cols-2 gap-2 text-sm'>
        <div>
          <p className='text-gray-500 font-medium'>Date & Time</p>
          <p>{formatDate(item.date)}</p>
          <p className='text-gray-600'>
            {formatTime(item.start_time)} - {formatTime(item.end_time)}
          </p>
        </div>
        <div>
          <p className='text-gray-500 font-medium'>Details</p>
          <p>Apt: {item.apart_type}</p>
          <p>Team: {item.team}</p>
        </div>
      </div>

      {/* Status */}
      <div className='flex flex-wrap gap-2'>
        <span className={getStatusClassName(item)}>{getStatusText(item)}</span>

        {item.status === "upcoming" && item.is_rescheduled === true && (
          <span className='px-2 py-1 inline-block rounded-full text-xs text-center bg-purple-200 text-purple-800'>
            rescheduled
          </span>
        )}
      </div>

      {/* Action buttons */}
      {showActionButtons(item) && (
        <div className='flex justify-end gap-3'>
          {item.status !== "rescheduled" && (
            <Button
              onClick={() => handleOpenModal(item, "reschedule")}
              size='sm'
              variant='outline'
              className='text-blue-500 border-blue-500'>
              Reschedule
            </Button>
          )}
          <Button
            onClick={() => handleOpenModal(item, "cancel")}
            size='sm'
            variant='outline'
            className='text-red-500 border-red-500'>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

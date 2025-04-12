/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

"use client";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ExternalLink, Edit, Trash2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import CancelModal from "@/components/CancelModal";
import RescheduleModal from "@/components/RescheduleModal";
import { Booking, formatTime } from "./all-bookings/DataTable";
import { GetAllBookingAction } from "@/actions/booking";
import { useUserData } from "@/hooks/user-provider";
import ReschedulePackageModal from "./ReschedulePackageModal";
import RescheduleBookingModal from "@/components/RescheduleModal";

export default function MobileBookingsList() {
  // Mapping for service names to icon file names.
  const iconMapping: Record<string, string> = {
    "Deep Cleaning": "residential",
    "Car Wash": "car-wash",
    "Regular Cleaning": "residential",
    "Specialized Cleaning": "specialised",
  };

  // State for modal flow.
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalType, setModalType] = useState<"cancel" | "reschedule" | null>(
    null
  );
  const { dataLoading, setDataLoading } = useUserData();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  console.log("bookings", data);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        setError(null);

        const result = await GetAllBookingAction();

        setData(result);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setError("Failed to load bookings. Please try again.");
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, []);
  const handleOpenModal = (booking: Booking, type: "cancel" | "reschedule") => {
    console.log(booking);
    setSelectedBooking(booking);
    setModalType(type);
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
    setModalType(null);
  };

  return (
    <div className='divide-y'>
      {data.map((booking) => (
        <div key={booking.id} className='p-4'>
          <div className='flex items-start justify-between mb-3'>
            <div className='flex items-center min-w-[76%]'>
              <div className='mr-3'>
                <img
                  // Try to get the icon using the mapping; fallback to booking.serviceIcon if needed
                  src={`/icons/${
                    iconMapping[booking.service_name] || booking.serviceIcon
                  }.svg`}
                  alt={booking.service_name}
                  width={36}
                  height={36}
                  className='w-auto'
                />
              </div>
              <div>
                <div className='text-[14px] font-medium'>
                  {booking.service_name}
                </div>
                <div className='text-xs text-[#64748b]'>
                  {formatTime(booking.start_time)} to{" "}
                  {formatTime(booking.end_time)}
                </div>
              </div>
            </div>
            {booking.status !== "completed" &&
              booking.status !== "cancelled" &&
              booking.is_cancelled !== true && (
                <div className='pl-1 flex space-x-1 justify-start'>
                  {booking.status !== "rescheduled" && (
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 text-[#0089f1]'
                      onClick={() => handleOpenModal(booking, "reschedule")}>
                      <Edit className='h-4 w-4' />
                    </Button>
                  )}
                  <Button
                    variant='ghost'
                    size='icon'
                    className='h-8 w-8 text-[#ef3a4b]'
                    onClick={() => handleOpenModal(booking, "cancel")}>
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              )}
          </div>
          <div className='grid grid-cols-2 gap-1 mb-3'>
            <div>
              <div className='text-xs text-[#64748b]'>Service Date</div>
              <div>{formatDate(booking.date)}</div>
            </div>
            <div>
              <div className='text-xs text-[#64748b] mb-2'>Status</div>
              <div className='flex flex-col gap-2 items-start'>
                <span
                  className={`px-2 py-0.5 inline-block rounded-full text-xs text-center  ${
                    booking.status === "completed"
                      ? "bg-green-200 text-green-800"
                      : booking.status === "active"
                      ? "bg-yellow-200 text-yellow-800"
                      : booking.status === "upcoming"
                      ? "bg-blue-200 text-blue-800"
                      : booking.status === "scheduled" &&
                        booking.is_cancelled !== true
                      ? "bg-gray-200 text-gray-800"
                      : booking.status === "rescheduled"
                      ? "bg-purple-200 text-purple-800"
                      : booking.is_cancelled === true
                      ? "bg-red-200 text-red-800"
                      : "bg-red-200 text-red-800"
                  }`}>
                  {booking.is_cancelled === true &&
                  booking.status === "scheduled"
                    ? "cancelled"
                    : booking.status.replace("_", " ")}
                </span>

                {booking.status === "upcoming" &&
                  booking.is_rescheduled === true && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs items-center text-center bg-purple-200 text-purple-800`}>
                      rescheduled
                    </span>
                  )}
              </div>
            </div>
            <div>
              <div className='text-xs text-[#64748b]'>Service No.</div>
              <div>{booking.booking_number}</div>
            </div>
          </div>
          <div className='min-w-fit group group-hover:scale-[96%] transition-transform'>
            <button className='flex text-[#0089f1] text-sm p-0 m-0 w-full justify-start gap-2 items-baseline group'>
              <span>View Booked Package</span>
              <ExternalLink className='w-3 h-3' />
            </button>
          </div>
        </div>
      ))}

      {/* Modals */}
      {modalType === "cancel" && selectedBooking && (
        <CancelModal
          booking={selectedBooking as any}
          onClose={handleCloseModal}
        />
      )}
      {modalType === "reschedule" && selectedBooking && (
        <RescheduleBookingModal
          onSuccess={() => {}}
          booking={selectedBooking as any}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

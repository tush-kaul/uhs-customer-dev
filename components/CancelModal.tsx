"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Booking } from "./all-bookings/DataTable";
import { BookingItem } from "./RescheduleModal";
import { useState } from "react";
import { toast } from "sonner";
import { CancelSingleBookingAction } from "@/actions/cancel-booking";
import Loader from "./ui/loader";

const CancelModal = ({
  booking,
  onClose,
}: {
  booking: BookingItem;
  onClose: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const handleCancelBooking = async () => {
    try {
      setLoading(true);
      await CancelSingleBookingAction(booking.id);
      onClose();
      window.location.reload();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Unable to cancel!", {
        description: "Your booking could not be cancelled.",
        duration: 5000, // 5 seconds
      });
    }
  };
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='max-w-xs md:max-w-md'>
        <DialogHeader>
          <DialogTitle>Cancel Booking</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to cancel the booking for{" "}
          <b>{booking.service_name}</b>?
        </p>
        <div className='flex justify-end gap-3 mt-4'>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
          {loading ? (
            <Loader />
          ) : (
            <Button
              className='bg-red-500 text-white'
              onClick={handleCancelBooking}>
              Confirm Cancel
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelModal;

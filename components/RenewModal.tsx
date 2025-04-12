"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Booking } from "./all-bookings/DataTable";

const RenewModal = ({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>Cancel Booking</DialogTitle>
        </DialogHeader>
        <p>
          Are you sure you want to cancel the booking for{" "}
          <b>{booking.service}</b>?
        </p>
        <div className='flex justify-end gap-3 mt-4'>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
          <Button
            className='bg-red-500 text-white'
            onClick={() => {
              console.log("Booking canceled:", booking.id);
              onClose();
            }}>
            Confirm Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RenewModal;

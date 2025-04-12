// components/ServicePackageModal.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

type ServicePackageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onBookNew: () => void;
  onRenew: () => void;
};

export default function ServicePackageModal({
  isOpen,
  onClose,
  onBookNew,
  onRenew,
}: ServicePackageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center text-amber-600'>
            <AlertTriangle className='h-5 w-5 mr-2' />
            Existing Booking Detected
          </DialogTitle>
        </DialogHeader>

        <div className='py-4'>
          <p className='mb-4'>
            You already have an active booking at this location. What would you
            like to do?
          </p>

          <div className='space-y-4'>
            <div
              className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer'
              onClick={onRenew}>
              <h3 className='font-medium mb-1'>Renew Existing Booking</h3>
              <p className='text-sm text-gray-600'>
                Extend your current service with the same terms and conditions.
              </p>
            </div>

            <div
              className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer'
              onClick={onBookNew}>
              <h3 className='font-medium mb-1'>Book New Service</h3>
              <p className='text-sm text-gray-600'>
                Create a separate booking with different details if needed.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

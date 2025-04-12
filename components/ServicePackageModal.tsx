import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ServicePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookNew: () => void;
  onRenew: () => void;
  locationName?: string;
}

export const ServicePackageModal: React.FC<ServicePackageModalProps> = ({
  isOpen,
  onClose,
  onBookNew,
  onRenew,
  locationName = "this location",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Package Already Exists</DialogTitle>
          <DialogDescription>
            Same service package exists at {locationName}.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-4 py-4'>
          <p className='text-sm text-muted-foreground'>Would you like to:</p>
          <div className='flex flex-col space-y-2'>
            <Button
              variant='outline'
              onClick={onBookNew}
              className='justify-start text-left font-normal'>
              Book new service (at different location)
            </Button>
            <Button
              variant='outline'
              onClick={onRenew}
              className='justify-start text-left font-normal'>
              Renew existing Package
            </Button>
          </div>
        </div>
        <DialogFooter className='sm:justify-start'>
          <Button type='button' variant='ghost' onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServicePackageModal;

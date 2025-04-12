/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CancelBookingAction,
  CancelSingleBookingAction,
} from "@/actions/cancel-booking";
import { toast } from "sonner";
import Loader from "./ui/loader";
import { Calendar, Clock } from "lucide-react";
import { useServiceDates } from "@/hooks/booking";
import { formatTime } from "./all-bookings/DataTable";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export interface Package {
  id: string;
  service: any;
  days: string[];
  startDate: string;
  endDate: string;
  status: string;
  duration: string;
  team: string;
  serviceIcon?: string;
  ref: string;
  teamAvailabilities: string[];
  serviceMinutes: number;
  [key: string]: any;
}

interface CancelPackageModalProps {
  pkg: Package;
  onSuccess: () => void;
  onClose: () => void;
}

const CancelPackageModal = ({
  pkg,
  onSuccess,
  onClose,
}: CancelPackageModalProps) => {
  const [loading, setLoading] = useState(false);
  const [cancelType, setCancelType] = useState<"full" | "single">("full");
  const [selectedServiceDate, setSelectedServiceDate] = useState<string | null>(
    null
  );

  // Fetch service dates for this package
  const { data: serviceDates, isLoading: serviceDatesLoading } =
    useServiceDates(pkg.id, [pkg]);

  const handleCancel = async () => {
    try {
      setLoading(true);

      if (cancelType === "full") {
        // Cancel the entire package
        await CancelBookingAction(pkg.ref.toString());
        toast.success("Package cancelled successfully!", {
          description: "Your package has been cancelled.",
          duration: 5000,
        });
      } else {
        // Cancel individual service date
        if (!selectedServiceDate) {
          toast.error("Please select a service date to cancel", {
            duration: 5000,
          });
          setLoading(false);
          return;
        }

        // Process the selected service date cancellation
        await CancelSingleBookingAction(selectedServiceDate);

        toast.success("Service date cancelled successfully!", {
          description: "The selected service date has been cancelled.",
          duration: 5000,
        });
      }
      onSuccess();
      onClose();
    } catch (error) {
      setLoading(false);
      toast.error("Unable to cancel!", {
        description:
          cancelType === "full"
            ? "Your package could not be cancelled."
            : "The service date could not be cancelled.",
        duration: 5000,
      });
    }
  };

  const selectServiceDate = (id: string) => {
    setSelectedServiceDate(id === selectedServiceDate ? null : id);
  };

  const isPastDate = (dateString: string) => {
    const serviceDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return serviceDate < today;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className='max-w-md md:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Cancel Package</DialogTitle>
        </DialogHeader>

        <div className='py-2'>
          <h3 className='font-medium mb-3'>{pkg.service.name}</h3>
          <p className='text-sm text-gray-600 mb-4'>
            Please select what you would like to cancel:
          </p>

          <RadioGroup
            value={cancelType}
            onValueChange={(value) => {
              setCancelType(value as "full" | "single");
              setSelectedServiceDate(null); // Reset selection when changing cancel type
            }}
            className='mb-4'>
            <div className='flex items-center space-x-2 mb-2'>
              <RadioGroupItem value='full' id='r1' />
              <Label htmlFor='r1'>Cancel entire package</Label>
            </div>
            <div className='flex items-center space-x-2'>
              <RadioGroupItem value='single' id='r2' />
              <Label htmlFor='r2'>Cancel a single service date</Label>
            </div>
          </RadioGroup>

          {cancelType === "single" && (
            <div className='mt-4 border rounded-md p-3 bg-gray-50'>
              <h4 className='font-medium mb-2 flex items-center'>
                <Calendar className='h-4 w-4 mr-1' /> Select a service date to
                cancel
              </h4>

              {serviceDatesLoading ? (
                <div className='h-20 flex items-center justify-center'>
                  <Loader />
                </div>
              ) : serviceDates && serviceDates.length > 0 ? (
                <div className='max-h-60 overflow-y-auto space-y-2'>
                  {serviceDates.map((serviceDate: any) => {
                    const isPast = isPastDate(serviceDate.date);
                    return (
                      <RadioGroup
                        key={serviceDate.id}
                        className={`flex items-center p-2 rounded cursor-pointer ${
                          isPast
                            ? "bg-gray-100 opacity-70"
                            : selectedServiceDate === serviceDate.id
                            ? "bg-blue-50 border border-blue-200"
                            : "bg-white border hover:bg-gray-50"
                        }`}
                        onClick={() =>
                          !isPast && selectServiceDate(serviceDate.id)
                        }>
                        <RadioGroupItem
                          id={`date-${serviceDate.id}`}
                          value={serviceDate.id}
                          checked={selectedServiceDate === serviceDate.id}
                          disabled={isPast}
                          className='mr-2'
                        />
                        <div className='flex-grow'>
                          <Label
                            htmlFor={`date-${serviceDate.id}`}
                            className={`${
                              isPast ? "text-gray-400" : "text-gray-800"
                            }`}>
                            {serviceDate.date}
                          </Label>
                          <div className='flex items-center text-xs text-gray-500'>
                            <Clock className='h-3 w-3 mr-1' />
                            <span>
                              {formatTime(serviceDate.start_time)} -{" "}
                              {formatTime(serviceDate.end_time)}
                            </span>
                          </div>
                        </div>
                        {isPast && (
                          <span className='text-xs text-gray-400 italic ml-2'>
                            Past date
                          </span>
                        )}
                      </RadioGroup>
                    );
                  })}
                </div>
              ) : (
                <p className='text-sm text-gray-500'>
                  No service dates found for this package.
                </p>
              )}

              {selectedServiceDate && (
                <div className='mt-2 text-sm text-blue-600'>
                  1 date selected for cancellation
                </div>
              )}
            </div>
          )}
        </div>

        <div className='flex justify-end gap-3 mt-4'>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
          {loading ? (
            <Loader />
          ) : (
            <Button
              className='bg-red-500 text-white hover:bg-red-600'
              onClick={handleCancel}
              disabled={cancelType === "single" && !selectedServiceDate}>
              {cancelType === "full"
                ? "Cancel Entire Package"
                : "Cancel Selected Date"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CancelPackageModal;

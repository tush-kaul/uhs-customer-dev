// components/Steps/CustomerDetailsStep.tsx
import React from "react";
import { Clock } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  formatTime,
  PRESENT_DURING_SERVICE_OPTIONS,
  SALUTATION_OPTIONS,
} from "@/utils/constants";

type CustomerDetailsStepProps = {
  blockTimer: number | null;
  bookingData?: any;
  watch: (path?: string) => any;
  setValue: (
    name: string,
    value: any,
    options?: { shouldValidate?: boolean }
  ) => void;
};

export default function CustomerDetailsStep({
  blockTimer,
  bookingData,
  watch,
  setValue,
}: CustomerDetailsStepProps) {
  const customerDetails = watch("customerDetails") || {};

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

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        <div className='space-y-3'>
          <Label>Salutation</Label>
          <Select
            value={customerDetails?.salutation || "Mr."}
            onValueChange={(value) =>
              setValue("customerDetails.salutation", value, {
                shouldValidate: true,
              })
            }>
            <SelectTrigger className='hover:bg-gray-100 transition-transform duration-200 cursor-pointer'>
              <SelectValue placeholder='Select Salutation' />
            </SelectTrigger>
            <SelectContent>
              {SALUTATION_OPTIONS.map((salute) => (
                <SelectItem key={salute} value={salute}>
                  {salute}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-3'>
          <Label>Full Name</Label>
          <Input
            disabled
            placeholder='Full Name'
            value={customerDetails?.fullName || ""}
          />
        </div>

        <div className='space-y-3'>
          <Label>Mobile Number</Label>
          <Input
            disabled
            placeholder='Mobile Number'
            value={customerDetails?.mobileNo || ""}
          />
        </div>

        <div className='space-y-3'>
          <Label>Email</Label>
          <Input
            disabled
            placeholder='Email'
            type='email'
            value={customerDetails?.email || ""}
          />
        </div>

        <div className='space-y-3'>
          <div className='flex items-center space-x-2'>
            <input
              type='checkbox'
              id='whatsappSame'
              checked={customerDetails?.whatsappSame || false}
              onChange={(e) =>
                setValue("customerDetails.whatsappSame", e.target.checked, {
                  shouldValidate: true,
                })
              }
              className='h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary'
            />
            <Label htmlFor='whatsappSame' className='text-sm'>
              WhatsApp same as mobile number
            </Label>
          </div>
        </div>

        {!customerDetails?.whatsappSame && (
          <div className='space-y-3'>
            <Label>WhatsApp Number</Label>
            <Input
              placeholder='WhatsApp Number'
              value={customerDetails?.whatsappNumber || ""}
              onChange={(e) =>
                setValue("customerDetails.whatsappNumber", e.target.value, {
                  shouldValidate: true,
                })
              }
            />
          </div>
        )}

        <div className='space-y-3 col-span-1 md:col-span-2'>
          <Label>Will you be present during the service?</Label>
          <Select
            value={customerDetails?.presentDuringService || "Yes"}
            onValueChange={(value) =>
              setValue(
                "customerDetails.presentDuringService",
                value as "Yes" | "No",
                {
                  shouldValidate: true,
                }
              )
            }>
            <SelectTrigger className='hover:bg-gray-100 transition-transform duration-200 cursor-pointer'>
              <SelectValue placeholder='Select Option' />
            </SelectTrigger>
            <SelectContent>
              {PRESENT_DURING_SERVICE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-3 col-span-1 md:col-span-2'>
          <Label>Special Instructions (optional)</Label>
          <Textarea
            placeholder='Any special instructions for the service'
            value={customerDetails?.specialInstructions || ""}
            onChange={(e) =>
              setValue("customerDetails.specialInstructions", e.target.value, {
                shouldValidate: true,
              })
            }
            rows={4}
            className='resize-none'
          />
        </div>
      </div>
    </div>
  );
}

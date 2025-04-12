/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { Package } from "./CancelPackageModal";

export const serviceFormSchema: any = z.object({
  serviceType: z.enum(["new", "renew"]),
  area: z.string().min(1, "Required"),
  subarea: z.string().min(1, "Required"),
  district: z.string().min(1, "Required"),
  property: z.string().min(1, "Required"),
  residenceType: z.string().min(1, "Required"),
  frequency: z.string().min(1, "Required"),
  bundleId: z.string().min(1, "Required"),
  timeSlotId: z.string().min(1, "Required"),
  service: z.string().min(1, "Required"),
  subService: z.string().min(1, "Required"),
  startDate: z.date(),
  months: z.number().min(1),
  customerDetails: z.object({
    salutation: z.string(),
    fullName: z.string().min(2, "Full name is required"),
    mobileNo: z.string().regex(/^\d{8}$/, "Mobile number must be 8 digits"),
    email: z.string().email("Invalid email"),
    apartmentNumber: z.string().min(1, "Required"),
    whatsappSame: z.boolean(),
    whatsappNumber: z.string().optional(),
    presentDuringService: z.enum(["Yes", "No"]),
    specialInstructions: z.string().optional(),
    files: z.any().optional(),
  }),
  renewalData: z
    .object({
      packageId: z.string().optional(),
      selectedPackage: z
        .enum(["monthly", "quarterly", "half-yearly", "yearly"])
        .optional(),
      renewalDuration: z.number().optional(),
      newFrequency: z.string().optional(),
    })
    .optional(),
});

export type ServiceFormValues = z.infer<typeof serviceFormSchema>;

export interface ServiceWizardProps {
  open: boolean;
  onClose: (savedData: ServiceFormValues | null, step: number) => void;
  type: "new" | "renew";
  initialData?: ServiceFormValues;
  initialStep?: number;
  bookingData?: any | null;
  isFromBooking?: boolean;
  openRenew: () => void;
}

// types.ts
export type ServiceWizardProps = {
  type: "new" | "renew";
  open: boolean;
  onClose: (data: any, step: number) => void;
  initialData?: any;
  initialStep?: number;
  bookingData?: any;
  isFromBooking?: boolean;
  openRenew: () => void;
};

export type AreaType = {
  id: string;
  name: string;
};

export type DistrictType = {
  id: string;
  name: string;
  areaId: number;
};

export type PropertyType = {
  id: string;
  name: string;
  districtId: number;
};

export type ResidenceType = {
  id: string;
  type: string;
};

export type FrequencyType = {
  id: string;
  label: string;
};

export type TimeSlotType = {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
  scheduleId: string;
};

export type ServiceType = {
  id: string;
  name: string;
  description?: string;
  photo_url?: string;
};

export type PricingType = {
  id: string;
  frequency: string;
  unit_amount: number;
  total_amount: number;
  currency: string;
  total_services: number;
};

export type BundleType = {
  id: string;
  title: string;
};

export type TimeSlotDayType = {
  day: string;
  date: string;
  timeSlots: TimeSlotType[];
};

export type CustomerDetailsType = {
  salutation: string;
  fullName: string;
  mobileNo: string;
  email: string;
  apartmentNumber: string;
  whatsappSame: boolean;
  whatsappNumber: string;
  presentDuringService: "Yes" | "No";
  specialInstructions: string;
  files: any[];
};

export type FormValuesType = {
  serviceType: "new" | "renew";
  area: string;
  district: string;
  property: string;
  residenceType: string;
  frequency: string;
  startDate: Date;
  months: number;
  bundleId: string;
  timeSlotId: string;
  service: string;
  subService: string;
  customerDetails: CustomerDetailsType;
};

export type DateStatus = {
  available: boolean;
  userBooked: boolean;
};

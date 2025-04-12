// utils/validation.ts
import { FormValuesType } from "../types";
import { getSliceEndIndex } from "./constants";

export const validateLocationStep = (
  formValues: Partial<FormValuesType>,
  bookings: any[] = []
): boolean => {
  // First check if all required location fields are filled
  const requiredFieldsFilled = !!(
    formValues.area &&
    formValues.district &&
    formValues.property &&
    formValues.residenceType &&
    formValues.service &&
    formValues.subService &&
    formValues.customerDetails?.apartmentNumber
  );

  // If any required field is missing, return false immediately
  if (!requiredFieldsFilled) {
    return false;
  }

  // Check if any existing booking has the same location

  // Return true only if required fields are filled AND there's no duplicate location
  return requiredFieldsFilled;
};

export const validateServiceDetailsStep = (
  formValues: Partial<FormValuesType>,
  userSelectedDate: boolean
): boolean => {
  return !!(
    formValues.frequency &&
    formValues.startDate &&
    formValues.months &&
    userSelectedDate
  );
};

export const validateBundleStep = (bundleId: string): boolean => {
  return !!bundleId;
};

export const validateTimeSlotStep = (
  selectedSlots: Record<string, string>,
  frequency: string
): boolean => {
  return Object.keys(selectedSlots).length === getSliceEndIndex(frequency);
};

export const validateCustomerDetailsStep = (
  blockId: string | null
): boolean => {
  return !!blockId;
};

export const validateAllSteps = (
  step: number,
  formValues: Partial<FormValuesType>,
  selectedSlots: Record<string, string>,
  blockId: string | null,
  userSelectedDate: boolean,
  bookingData?: any,
  bookings: any[] = []
): boolean => {
  switch (step) {
    case 0:
      return validateLocationStep(formValues, bookings);
    case 1:
      return validateServiceDetailsStep(formValues, userSelectedDate);
    case 2:
      return validateBundleStep(formValues.bundleId || "");
    case 3:
      return validateTimeSlotStep(
        selectedSlots,
        formValues.frequency || bookingData?.recurrence_plan || "one_time"
      );
    case 4:
      return validateCustomerDetailsStep(blockId);
    default:
      return true;
  }
};

export const validateRenewalStep = (
  step: number,
  formValues: Partial<FormValuesType>,
  selectedSlots: Record<string, string>,
  blockId: string | null,
  userSelectedDate: boolean,
  bookingData?: any,
  bookings: any[] = []
): boolean => {
  switch (step) {
    case 0:
      return !!(formValues.startDate && formValues.months && userSelectedDate);
    case 1:
      return !!formValues.bundleId;
    case 2:
      return (
        Object.keys(selectedSlots).length ===
        getSliceEndIndex(
          bookingData?.recurrence_plan || formValues.frequency || "one_time"
        )
      );
    case 3:
      return !!blockId;
    default:
      return true;
  }
};

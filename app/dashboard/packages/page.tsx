"use client";

import DataPackages from "@/components/packages/DataPackages";
import MobilePackagesList from "@/components/MobilePackagesList";
import { ServiceFormValues } from "@/components/schema";
import SearchBar from "@/components/SearchBar";
import ServiceButton from "@/components/ServiceButton";
import UserHeader from "@/components/UserHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";
import { RenewDrawer } from "@/components/RenewDrawer";
import ServiceWizard from "@/components/booking/ServiceWizard";
import { useUserQuery } from "@/lib/tanstack/queries";

const Packages = () => {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardType, setWizardType] = useState<"new" | "renew">("new");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "expired" | "upcoming" | "completed"
  >("all");
  const [renewDrawerOpen, setRenewDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  // State to hold the saved wizard progress (form data and current step) for each type.
  const [savedWizardState, setSavedWizardState] = useState<{
    [key in "new" | "renew"]?: {
      data: ServiceFormValues;
      step: number;
    };
  }>({});

  const openWizard = (type: "new" | "renew") => {
    setWizardType(type);
    setWizardOpen(true);
  };

  // Callback when the wizard is closed.
  // If savedData is not null then we save the progress.
  // If savedData is null then the form has been submitted successfully.
  const handleWizardClose = (
    savedData: ServiceFormValues | null,
    step: number
  ) => {
    setSavedWizardState((prev) => {
      const newState = { ...prev };
      delete newState[wizardType];
      return newState;
    });
    setSelectedBooking(null);
    setWizardOpen(false);
  };
  const handleSelectBooking = (booking: any) => {
    setSelectedBooking(booking);
    setRenewDrawerOpen(false);

    // Create initial data for the wizard based on the selected booking
    const initialData: Partial<ServiceFormValues> = {
      subService: booking.service.id,
      area: booking.area.id,
      district: booking.district.id,
      property: booking.property.id,
      residenceType: booking.residence_type.id,
      frequency: booking.frequency,
    };

    // Update wizard state with the selected booking data
    setSavedWizardState((prev) => ({
      ...prev,
      renew: {
        data: initialData as ServiceFormValues,
        step: 0,
      },
    }));

    // Open the wizard
    setWizardType("renew");
    setWizardOpen(true);

    // Show toast notification
    toast.success(`Selected booking: ${booking.booking_number}`);
  };

  return (
    <div className='max-w-full lg:max-w-7xl  p-0 md:p-6 md:pl-4'>
      <UserHeader />

      {/* Service Buttons */}
      <div className='flex items-center justify-between p-2 flex-col md:flex-row gap-4 mb-6'>
        <SearchBar />
        <div className='flex items-center md:flex-row flex-col-reverse gap-4 w-full md:w-auto'>
          <Select
            value={statusFilter}
            onValueChange={(
              value: "all" | "active" | "expired" | "upcoming" | "completed"
            ) => setStatusFilter(value)}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Filter by status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All Packages</SelectItem>
              <SelectItem value='active'>Active</SelectItem>
              <SelectItem value='expired'>Expired</SelectItem>
              <SelectItem value='completed'>Completed</SelectItem>
              <SelectItem value='upcoming'>Upcoming</SelectItem>
            </SelectContent>
          </Select>
          <ServiceButton
            title='Book New Service'
            color='bg-[#ea682a] hover:bg-[#b04c1d] text-white'
            onClick={() => openWizard("new")}
          />
          <ServiceButton
            title='Renew Existing Package'
            color='bg-[#1e293b]/95 hover:bg-[#0f172a] text-white'
            onClick={() => setRenewDrawerOpen(true)}
          />
        </div>
      </div>

      <RenewDrawer
        isOpen={renewDrawerOpen}
        onClose={() => setRenewDrawerOpen(false)}
        onSelectBooking={handleSelectBooking}
      />
      {wizardOpen && (
        <ServiceWizard
          type={wizardType}
          open={wizardOpen}
          onClose={handleWizardClose}
          initialData={savedWizardState[wizardType]?.data}
          initialStep={savedWizardState[wizardType]?.step || 0}
          bookingData={selectedBooking}
          openRenew={() => {
            setRenewDrawerOpen(true);
          }}
        />
      )}

      <div className=' p-2 bg-white mx-4 rounded-lg mb-6'>
        <h2 className='text-lg font-semibold '>
          {statusFilter === "all" && "All Packages"}
          {statusFilter === "active" && "Active Packages"}
          {statusFilter === "expired" && "Expired Packages"}
          {statusFilter === "completed" && "Completed Packaged"}
          {statusFilter === "upcoming" && "Upcoming Packages"}
        </h2>
      </div>
      <div className=' p-2 bg-white mx-4 rounded-lg'>
        <DataPackages statusFilter={statusFilter} />
      </div>
    </div>
  );
};
export default Packages;

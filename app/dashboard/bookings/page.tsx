"use client";
import ServiceWizard from "@/components/booking/ServiceWizard";
import DataTable from "@/components/all-bookings/DataTable";
import MobileBookingsList from "@/components/MobileBookingsList";
import { RenewDrawer } from "@/components/RenewDrawer";
import { ServiceFormValues } from "@/components/schema";
import SearchBar from "@/components/SearchBar";
import ServiceButton from "@/components/ServiceButton";
import UserHeader from "@/components/UserHeader";
// import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useUserQuery } from "@/lib/tanstack/queries";

const Booking = () => {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardType, setWizardType] = useState<"new" | "renew">("new");
  const [selectedPkg, setSelectedPkg] = useState<any | null>(null);
  // State to hold the saved wizard progress (form data and current step) for each type.
  const [renewDrawerOpen, setRenewDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

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

  const handleWizardClose = (
    savedData: ServiceFormValues | null,
    step: number
  ) => {
    if (savedData) {
      setSavedWizardState((prev) => ({
        ...prev,
        [wizardType]: { data: savedData, step },
      }));
    } else {
      // Clear saved state on final submission.
      setSavedWizardState((prev) => {
        const newState = { ...prev };
        delete newState[wizardType];
        return newState;
      });
    }
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
      <div className='flex items-center justify-between p-2 flex-col md:flex-row gap-4 mb-6'>
        <SearchBar />
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
      {/* Desktop view booking table */}
      <div className=' p-2 bg-white mx-4 rounded-lg mb-4'>
        <h2 className='text-lg font-semibold '>All Bookings</h2>
      </div>
      <div className=' p-2 bg-white mx-4 rounded-lg'>
        <DataTable />
      </div>
      {/* Mobile view booking list */}
      {/* <div className='md:hidden '>
        <MobileBookings
        List />
      </div> */}
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
    </div>
  );
};
export default Booking;

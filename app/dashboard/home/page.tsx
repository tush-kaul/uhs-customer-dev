"use client";

import { BookingAction } from "@/actions/booking";
import ServiceWizard from "@/components/booking/ServiceWizard";
import DataTable from "@/components/all-bookings/DataTable";
import DataPackages from "@/components/packages/DataPackages";
import MobileBookingsList from "@/components/MobileBookingsList";
import MobilePackagesList from "@/components/MobilePackagesList";
import { RenewDrawer } from "@/components/RenewDrawer";
import { ServiceFormValues } from "@/components/schema";
import SearchBar from "@/components/SearchBar";
import ServiceFilters from "@/components/SearchFilters";

import ServiceButton from "@/components/ServiceButton";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserHeader from "@/components/UserHeader";
import { data } from "@/lib/utils";
import { getCurrentUser } from "@/utils/user";
import { ChevronDown, Search, X } from "lucide-react";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useUserQuery } from "@/lib/tanstack/queries";

// Define types for bookings
export interface Booking {
  id: string;
  date: string;
  booking_number: string;
  service: any;
  status: "active" | "expired" | "upcoming" | "scheduled";
  [key: string]: any;
}

// Side drawer component for renewing bookings

export default function Home() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardType, setWizardType] = useState<"new" | "renew">("new");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "expired" | "upcoming"
  >("active");
  const [savedWizardState, setSavedWizardState] = useState<{
    [key in "new" | "renew"]?: {
      data: ServiceFormValues;
      step: number;
    };
  }>({});

  // Add state for drawer
  const [renewDrawerOpen, setRenewDrawerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const openWizard = async (type: "new" | "renew") => {
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
      setSavedWizardState((prev) => {
        const newState = { ...prev };
        delete newState[wizardType];
        return newState;
      });
    }
    setWizardOpen(false);
  };

  // Handle selecting a booking from the drawer
  const handleSelectBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setRenewDrawerOpen(false);

    // Create initial data for the wizard based on the selected booking
    console.log("booking", booking);
    const initialData: Partial<ServiceFormValues> = {
      subService: booking.service.id,
      service: booking.service.id,
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
    <div className='max-w-full lg:max-w-7xl p-0 md:p-6 md:pl-4'>
      {/* Header */}
      <UserHeader />
      {/* Service Filters */}
      <div className='mb-6 p-2 overflow-x-auto'>
        <ServiceFilters />
      </div>

      {/* Service Buttons */}
      <div className='flex flex-1 items-center justify-between p-2 flex-col md:flex-row gap-4 mb-6'>
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

      {/* Renew Drawer */}
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
          key={`wizard-${Date.now()}`}
        />
      )}
      {/* <ServiceWizard
        open={wizardOpen}
        onClose={handleWizardClose}
        bookingData={selectedBooking}
        type={wizardType}
        openRenew={() => {
          setRenewDrawerOpen(true);
        }}
      /> */}
      {/* <ServiceWizard
        type={wizardType}
        open={wizardOpen}
        onClose={handleWizardClose}
        initialData={savedWizardState[wizardType]?.data}
        initialStep={savedWizardState[wizardType]?.step || 0}
      /> */}

      {/* Packages Table */}
      <div className='bg-white rounded-lg shadow-sm mb-6'>
        <div className='p-4 flex justify-between items-center border-b'>
          <h2 className='text-lg md:text-xl font-bold text-[#1e293b]'>
            Active Packages
          </h2>
          <div className='flex items-center space-x-2'></div>
        </div>
        <div className='overflow-x-auto'>
          <div className=' md:block'>
            <DataPackages statusFilter='home' />
          </div>
          {/* <div className='w-full md:hidden'>
            <MobilePackagesList statusFilter={statusFilter} />
          </div> */}
        </div>
      </div>
      {/* Bookings Table */}
      <div className='bg-white rounded-lg shadow-sm mb-6'>
        <div className='p-4 flex justify-between items-center border-b mb-4'>
          <h2 className='text-lg md:text-xl font-bold text-[#1e293b]'>
            All Bookings
          </h2>
          <div className='flex items-center space-x-2'>
            <Button
              variant='ghost'
              size='sm'
              className='text-[#64748b] hidden md:flex'>
              A-Z <ChevronDown className='w-4 h-4 ml-1' />
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <div className=' md:block'>
            <DataTable />
          </div>
          {/* <div className='w-full md:hidden'>
            <MobileBookingsList />
          </div> */}
        </div>
      </div>
    </div>
  );
}

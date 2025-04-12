/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { useUserData } from "@/hooks/user-provider";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Users,
  Clock,
  Info,
  MapPin,
  Filter,
} from "lucide-react";
import moment from "moment";
import { toast } from "sonner";
import ServiceWizard from "../booking/ServiceWizard";
import { Button } from "../ui/button";
import CancelPackageModal, {
  Package as PackageType,
} from "../CancelPackageModal";
import ReschedulePackageModal from "../ReschedulePackageModal";
import { useBookings, useServiceDates } from "@/hooks/booking";
import { formatTime } from "../all-bookings/DataTable";
import { ShimmerCard, ShimmerRow } from "./ShimmerLoaders";
import { ExpandedPackageDetails } from "./ExpandedPackageDetails";
import { PackageCard } from "./PackageCard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, X } from "lucide-react";
import { ServiceFormValues } from "../schema";

type Package = PackageType | null;

// Image path mapping
const ImagePathSetting: Record<string, string> = {
  "Deep Cleaning": "residential",
  "Car Wash": "car-wash",
  "Regular Cleaning": "residential",
  "Specialized Cleaning": "specialised",
};

const DataPackages = ({ statusFilter }: { statusFilter: string }) => {
  const [selectedPackage, setSelectedPackage] = useState<Package>(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const { setDataLoading } = useUserData();
  const [modalType, setModalType] = useState<
    "cancel" | "reschedule" | "renew" | null | any
  >(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [savedWizardState, setSavedWizardState] = useState<
    | {
        [key in "new" | "renew"]?: {
          data: ServiceFormValues;
          step: number;
        };
      }
    | any
  >({});
  // Filtering state

  const [propertyFilter, setPropertyFilter] = useState<string>("all");
  const [apartmentFilter, setApartmentFilter] = useState<string>("all");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [availableProperties, setAvailableProperties] = useState<string[]>([]);
  const [availableApartments, setAvailableApartments] = useState<string[]>([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Use React Query hooks for data fetching
  const {
    data: rawData,
    isLoading: dataLoading,
    error,
    refetch,
  } = useBookings(statusFilter);

  // Filter data based on all filters
  const data = React.useMemo(() => {
    if (!rawData) return [];

    return rawData.filter((item: any) => {
      // Property filter
      const propertyMatch =
        propertyFilter === "all" || item.property?.name === propertyFilter;

      // Apartment filter
      const apartmentMatch =
        apartmentFilter === "all" || item.appartment_number === apartmentFilter;

      return propertyMatch && apartmentMatch;
    });
  }, [rawData, propertyFilter, apartmentFilter]);

  // Extract available filter options from the data
  useEffect(() => {
    if (rawData && rawData.length > 0) {
      // Extract unique properties
      const properties = rawData
        .map((item: any) => item.property?.name)
        .filter(Boolean)
        .filter(
          (property: string, index: number, self: string[]) =>
            self.indexOf(property) === index
        );
      setAvailableProperties(properties);

      // Extract unique apartment types
      const apartments = rawData
        .map((item: any) => item.appartment_number)
        .filter(Boolean)
        .filter(
          (apartment: string, index: number, self: string[]) =>
            self.indexOf(apartment) === index
        );
      setAvailableApartments(apartments);
    }
  }, [rawData]);

  // Use a separate query for expanded row data
  const {
    data: expandedData,
    isLoading: expandedDataLoading,
    refetch: refetchExpanded,
  } = useServiceDates(expandedRow, data);

  // Pass loading state to global context
  React.useEffect(() => {
    setDataLoading(dataLoading);
  }, [dataLoading, setDataLoading]);

  const handleOpenModal = (
    pkg: Package,
    type: "cancel" | "reschedule" | "renew"
  ) => {
    setSelectedBooking(pkg);
    setSelectedPackage(pkg);
    // Create initial data for the wizard based on the selected booking
    const initialData: Partial<ServiceFormValues> = {
      subService: pkg?.service.id,
      area: pkg?.area.id,
      district: pkg?.district.id,
      property: pkg?.property.id,
      residenceType: pkg?.residence_type.id,
      frequency: pkg?.frequency,
    };

    // Update wizard state with the selected booking data
    setSavedWizardState((prev: any) => ({
      ...prev,
      renew: {
        data: initialData as ServiceFormValues,
        step: 0,
      },
    }));

    setModalType(type);
    setWizardOpen(true);
  };

  const handleCloseModal = () => {
    setSavedWizardState((prev: any) => {
      const newState: any = { ...prev };
      delete newState[modalType];
      return newState;
    });
    setSelectedPackage(null);
    setModalType(null);
    setWizardOpen(false);
  };

  const toggleRowExpansion = (itemId: string) => {
    setExpandedRow(expandedRow === itemId ? null : itemId);
  };

  const handlePropertyChange = (value: string) => {
    setPropertyFilter(value);
  };

  const handleApartmentChange = (value: string) => {
    setApartmentFilter(value);
  };

  // Reset all filters
  const resetFilters = () => {
    setPropertyFilter("all");
    setApartmentFilter("all");
  };

  // Filters component for desktop
  const DesktopFilters = () => (
    <div className='hidden md:flex items-center gap-4 mb-4 flex-wrap'>
      {/* Property filter */}
      <div className='flex items-center gap-2'>
        <div className='flex items-center'>
          <Calendar className='h-4 w-4 mr-1 text-gray-500' />
          <span className='text-sm font-medium'>Property:</span>
        </div>
        <Select value={propertyFilter} onValueChange={handlePropertyChange}>
          <SelectTrigger className='h-8 w-[180px]'>
            <SelectValue placeholder='Select property' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Properties</SelectItem>
            {availableProperties.map((property) => (
              <SelectItem key={property} value={property}>
                {property}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Apartment filter */}
      <div className='flex items-center gap-2'>
        <div className='flex items-center'>
          <Users className='h-4 w-4 mr-1 text-gray-500' />
          <span className='text-sm font-medium'>Apartment:</span>
        </div>
        <Select value={apartmentFilter} onValueChange={handleApartmentChange}>
          <SelectTrigger className='h-8 w-[180px]'>
            <SelectValue placeholder='Select apartment' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Apartments</SelectItem>
            {availableApartments.map((apartment) => (
              <SelectItem key={apartment} value={apartment}>
                {apartment}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reset filters button - only show if at least one filter is active */}
      {(propertyFilter !== "all" || apartmentFilter !== "all") && (
        <Button
          variant='ghost'
          size='sm'
          onClick={resetFilters}
          className='flex items-center gap-1 h-8'>
          <X className='h-3.5 w-3.5' />
          Reset filters
        </Button>
      )}
    </div>
  );

  // Mobile filters component
  const MobileFilters = () => (
    <div className='md:hidden mb-4'>
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            size='sm'
            className='flex items-center gap-1 h-8 w-full justify-between'>
            <div className='flex items-center gap-1'>
              <Filter className='h-3.5 w-3.5' />
              <span>Filters</span>
            </div>
            {(propertyFilter !== "all" || apartmentFilter !== "all") && (
              <div className='bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'>
                {(propertyFilter !== "all" ? 1 : 0) +
                  (apartmentFilter !== "all" ? 1 : 0)}
              </div>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-72 p-3'>
          <div className='flex justify-between items-center mb-3'>
            <h3 className='font-medium'>Filters</h3>
            {(propertyFilter !== "all" || apartmentFilter !== "all") && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => {
                  resetFilters();
                  setIsFilterOpen(false);
                }}
                className='text-xs h-7 px-2'>
                Reset all
              </Button>
            )}
          </div>

          {/* Property filter */}
          <div className='mb-3'>
            <h4 className='text-sm font-medium mb-1 flex items-center'>
              <Calendar className='h-3.5 w-3.5 mr-1 text-gray-500' /> Property
            </h4>
            <div className='space-y-1 max-h-36 overflow-y-auto'>
              <Button
                variant={propertyFilter === "all" ? "default" : "ghost"}
                size='sm'
                className='w-full justify-start'
                onClick={() => handlePropertyChange("all")}>
                All Properties
                {propertyFilter === "all" && (
                  <Check className='ml-auto h-4 w-4' />
                )}
              </Button>
              {availableProperties.map((property) => (
                <Button
                  key={property}
                  variant={propertyFilter === property ? "default" : "ghost"}
                  size='sm'
                  className='w-full justify-start'
                  onClick={() => handlePropertyChange(property)}>
                  {property}
                  {propertyFilter === property && (
                    <Check className='ml-auto h-4 w-4' />
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Apartment filter */}
          <div className='mb-3'>
            <h4 className='text-sm font-medium mb-1 flex items-center'>
              <Users className='h-3.5 w-3.5 mr-1 text-gray-500' /> Apartment
            </h4>
            <div className='space-y-1 max-h-36 overflow-y-auto'>
              <Button
                variant={apartmentFilter === "all" ? "default" : "ghost"}
                size='sm'
                className='w-full justify-start'
                onClick={() => handleApartmentChange("all")}>
                All Apartments
                {apartmentFilter === "all" && (
                  <Check className='ml-auto h-4 w-4' />
                )}
              </Button>
              {availableApartments.map((apartment) => (
                <Button
                  key={apartment}
                  variant={apartmentFilter === apartment ? "default" : "ghost"}
                  size='sm'
                  className='w-full justify-start'
                  onClick={() => handleApartmentChange(apartment)}>
                  {apartment}
                  {apartmentFilter === apartment && (
                    <Check className='ml-auto h-4 w-4' />
                  )}
                </Button>
              ))}
            </div>
          </div>

          <div className='flex justify-end mt-4 gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setIsFilterOpen(false)}>
              Cancel
            </Button>
            <Button
              variant='default'
              size='sm'
              onClick={() => setIsFilterOpen(false)}>
              Apply Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Mobile filter pills - show active filters */}
      <div className='flex flex-wrap gap-2 mt-2'>
        {propertyFilter !== "all" && (
          <div className='bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full flex items-center gap-1'>
            {propertyFilter}
            <button onClick={() => setPropertyFilter("all")}>
              <X className='h-3 w-3' />
            </button>
          </div>
        )}
        {apartmentFilter !== "all" && (
          <div className='bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full flex items-center gap-1'>
            {apartmentFilter}
            <button onClick={() => setApartmentFilter("all")}>
              <X className='h-3 w-3' />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Status badge component with tooltip for pending status
  const StatusBadge = ({ status }: { status: string }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const getStatusColor = (status: string) => {
      switch (status) {
        case "completed":
        case "expired":
          return "bg-green-200 text-green-800";
        case "cancelled":
          return "bg-red-200 text-red-800";
        case "in_progress":
          return "bg-orange-200 text-orange-800";
        case "active":
          return "bg-blue-200 text-blue-800";
        case "renewed":
          return "bg-cyan-200 text-cyan-800";
        case "scheduled":
          return "bg-gray-200 text-gray-800";
        case "upcoming":
          return "bg-purple-200 text-purple-800";
        case "pending":
          return "bg-yellow-200 text-yellow-800";
        default:
          return "bg-yellow-200 text-yellow-800";
      }
    };

    const displayStatus = status.replace("_", " ");

    if (status === "pending") {
      return (
        <div className='flex items-center gap-1'>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              status
            )}`}>
            {displayStatus}
          </span>
          <TooltipProvider delayDuration={0}>
            <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
              <TooltipTrigger asChild>
                <button
                  type='button'
                  className='flex items-center justify-center cursor-help p-1'
                  onClick={(e) => {
                    e.stopPropagation();
                    setTooltipOpen(!tooltipOpen);
                  }}>
                  <Info className='h-4 w-4 text-yellow-600' />
                </button>
              </TooltipTrigger>
              <TooltipContent className='bg-white p-2 shadow-lg rounded border border-gray-200 max-w-xs z-50'>
                <p className='text-xs text-gray-800'>
                  This booking will be cleared after 10 minutes. Please continue
                  with the booking process.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(
          status
        )}`}>
        {displayStatus}
      </span>
    );
  };

  // Render the desktop table view
  const renderDesktopTable = () => (
    <div className='hidden md:block overflow-x-auto'>
      <Table className='min-w-full'>
        <TableHeader>
          <TableRow className='bg-gray-100'>
            <TableHead className='w-10'></TableHead>
            <TableHead className='whitespace-nowrap'>Name</TableHead>
            <TableHead className='whitespace-nowrap'>Start Date</TableHead>
            <TableHead className='whitespace-nowrap'>End Date</TableHead>
            <TableHead className='whitespace-nowrap'>Location</TableHead>
            <TableHead className='whitespace-nowrap'>Payment</TableHead>
            <TableHead className='whitespace-nowrap'>Status</TableHead>
            <TableHead className='whitespace-nowrap'>Team</TableHead>
            <TableHead className='whitespace-nowrap'>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dataLoading ? (
            <ShimmerRow />
          ) : (
            data
              ?.sort((a: any, b: any) => {
                const numA = parseInt(a.booking_number.split("-")[1], 10);
                const numB = parseInt(b.booking_number.split("-")[1], 10);
                return numB - numA; // Descending order
              })
              .map((item: any) => (
                <React.Fragment key={item.id}>
                  <TableRow className='hover:bg-gray-50'>
                    <TableCell className='align-top'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => toggleRowExpansion(item.id)}
                        className='p-0 h-6 w-6'>
                        {expandedRow === item.id ? (
                          <ChevronUp className='h-4 w-4' />
                        ) : (
                          <ChevronDown className='h-4 w-4' />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className='align-top'>
                      <div className='flex items-center gap-3'>
                        <Image
                          src={`/icons/${
                            ImagePathSetting[item.service.name]
                          }.svg`}
                          alt={item.service.name}
                          className='w-10 h-10 rounded-full object-cover'
                          width={50}
                          height={50}
                        />
                        <div>
                          <p className='font-medium break-words max-w-[150px]'>
                            {item.service.name}
                          </p>
                          <p className='text-sm text-gray-500'>
                            #{item.booking_number}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className='align-top'>
                      <p className='break-words whitespace-normal'>
                        {item.startDate}
                      </p>
                    </TableCell>
                    <TableCell className='align-top'>
                      <p className='break-words whitespace-normal'>
                        {item.endDate}
                      </p>
                    </TableCell>
                    <TableCell className='align-top'>
                      <div className='break-words whitespace-normal max-w-[120px]'>
                        {item.residence_type?.location || item.location || "-"}
                      </div>
                    </TableCell>
                    <TableCell className='align-top'>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold inline-block
                        ${
                          item.paymentStatus === "paid"
                            ? "bg-green-200 text-green-800"
                            : item.paymentStatus === "unpaid"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}>
                        {item.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell className='align-top'>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell className='align-top'>
                      <div className='break-words whitespace-normal max-w-[120px]'>
                        {item.team.name}
                      </div>
                    </TableCell>
                    <TableCell className='align-top'>
                      <div className='flex gap-2'>
                        {item.status === "pending" ? (
                          <Button
                            variant='link'
                            size='sm'
                            className='text-blue-500 h-auto w-auto p-0 text-left'>
                            Continue Booking
                          </Button>
                        ) : (
                          <>
                            {item.status !== "completed" &&
                              item.status !== "expired" && (
                                <Button
                                  onClick={() =>
                                    handleOpenModal(item, "reschedule")
                                  }
                                  variant='link'
                                  size='sm'
                                  className='text-blue-500 h-auto w-auto p-0 text-left'>
                                  Reschedule
                                </Button>
                              )}
                            {!item.has_renewed &&
                              !item.is_renewed &&
                              item.status !== "completed" &&
                              item.status !== "expired" && (
                                <Button
                                  onClick={() => handleOpenModal(item, "renew")}
                                  variant='link'
                                  size='sm'
                                  className='text-green-500 h-auto w-auto p-0 text-left'>
                                  Renew
                                </Button>
                              )}
                            {item.status !== "completed" &&
                              item.status !== "expired" && (
                                <Button
                                  onClick={() =>
                                    handleOpenModal(item, "cancel")
                                  }
                                  variant='link'
                                  size='sm'
                                  className='text-red-500 h-auto w-auto p-0 text-left'>
                                  Cancel
                                </Button>
                              )}
                            {item.has_renewed && (
                              <span className='text-xs whitespace-normal'>
                                This package has been <b>renewed</b>
                              </span>
                            )}
                            {item.is_renewed && (
                              <span className='text-xs whitespace-normal'>
                                This is a <b>renewed</b> package
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedRow === item.id && (
                    <TableRow className='bg-gray-50'>
                      <TableCell colSpan={10} className='p-4'>
                        <ExpandedPackageDetails
                          item={item}
                          expandedData={expandedData}
                          isLoading={expandedDataLoading}
                          formatTime={formatTime}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  // Modified MobileStatusBadge component for mobile view
  const MobileStatusBadge = ({ status }: { status: string }) => {
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const getStatusColor = (status: string) => {
      switch (status) {
        case "completed":
        case "expired":
          return "bg-green-200 text-green-800";
        case "cancelled":
          return "bg-red-200 text-red-800";
        case "in_progress":
          return "bg-orange-200 text-orange-800";
        case "active":
          return "bg-blue-200 text-blue-800";
        case "renewed":
          return "bg-cyan-200 text-cyan-800";
        case "scheduled":
          return "bg-gray-200 text-gray-800";
        case "upcoming":
          return "bg-purple-200 text-purple-800";
        case "pending":
          return "bg-yellow-200 text-yellow-800";
        default:
          return "bg-yellow-200 text-yellow-800";
      }
    };

    const displayStatus = status.replace("_", " ");

    if (status === "pending") {
      return (
        <div className='flex items-center gap-1'>
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              status
            )}`}>
            {displayStatus}
          </span>
          <TooltipProvider delayDuration={0}>
            <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
              <TooltipTrigger asChild>
                <button
                  type='button'
                  className='flex items-center justify-center cursor-help p-1'
                  onClick={(e) => {
                    e.stopPropagation();
                    setTooltipOpen(!tooltipOpen);
                  }}>
                  <Info className='h-4 w-4 text-yellow-600' />
                </button>
              </TooltipTrigger>
              <TooltipContent
                side='top'
                className='bg-white p-2 shadow-lg rounded border border-gray-200 max-w-xs z-50'>
                <p className='text-xs text-gray-800'>
                  This booking will be cleared after 10 minutes. Please continue
                  with the booking process.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold inline-block ${getStatusColor(
          status
        )}`}>
        {displayStatus}
      </span>
    );
  };

  // Modified PackageCard component to use the new MobileStatusBadge
  const ModifiedPackageCard = ({
    item,
    expandedRow,
    expandedData,
    expandedDataLoading,
    toggleRowExpansion,
    handleOpenModal,
    formatTime,
    ImagePathSetting,
  }: any) => (
    <div className='bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden'>
      <div className='p-4'>
        <div className='flex items-center justify-between mb-2'>
          <div className='flex items-center gap-3'>
            <Image
              src={`/icons/${ImagePathSetting[item.service.name]}.svg`}
              alt={item.service.name}
              className='w-10 h-10 rounded-full object-cover'
              width={50}
              height={50}
            />
            <div>
              <p className='font-medium'>{item.service.name}</p>
              <p className='text-sm text-gray-500'>#{item.booking_number}</p>
            </div>
          </div>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => toggleRowExpansion(item.id)}
            className='p-0 h-8 w-8 rounded-full'>
            {expandedRow === item.id ? (
              <ChevronUp className='h-5 w-5' />
            ) : (
              <ChevronDown className='h-5 w-5' />
            )}
          </Button>
        </div>

        <div className='grid grid-cols-2 gap-2 mb-2 text-sm'>
          <div>
            <span className='text-gray-500'>Start Date:</span>
            <p>{item.startDate}</p>
          </div>
          <div>
            <span className='text-gray-500'>End Date:</span>
            <p>{item.endDate}</p>
          </div>
        </div>

        {/* Add location to mobile card */}
        <div className='grid grid-cols-2 gap-2 mb-2 text-sm'>
          <div>
            <span className='text-gray-500'>Location:</span>
            <p>{item.residence_type?.location || item.location || "-"}</p>
          </div>
          <div>
            <span className='text-gray-500'>Property:</span>
            <p>
              {item.residence_type?.property_name || item.property_name || "-"}
            </p>
          </div>
        </div>
        <div className='text-sm mb-2'>
          <span className='text-gray-500'>Apartment:</span>
          <p>{item.residence_type?.type || item.apartment_type || "-"}</p>
        </div>

        <div className='flex items-center justify-between mt-3'>
          <div className='flex gap-2'>
            <span
              className={`px-2 py-1 rounded-full text-xs font-semibold
              ${
                item.paymentStatus === "paid"
                  ? "bg-green-200 text-green-800"
                  : item.paymentStatus === "unpaid"
                  ? "bg-red-200 text-red-800"
                  : "bg-yellow-200 text-yellow-800"
              }`}>
              {item.paymentStatus}
            </span>
            <MobileStatusBadge status={item.status} />
          </div>
        </div>

        {expandedRow === item.id && (
          <div className='mt-4 pt-3 border-t border-gray-200'>
            <div className='mb-3'>
              <h4 className='font-medium mb-2 flex items-center'>
                <Users className='h-4 w-4 mr-1' /> Team
              </h4>
              <p className='text-sm'>{item.team.name}</p>
            </div>

            {expandedDataLoading ? (
              <div className='h-20 bg-gray-100 animate-pulse rounded'></div>
            ) : (
              expandedData && (
                <div className='space-y-3'>
                  <h4 className='font-medium mb-2 flex items-center'>
                    <Calendar className='h-4 w-4 mr-1' /> Service Dates
                  </h4>
                  <div className='space-y-2'>
                    {expandedData.map((serviceDate: any) => (
                      <div
                        key={serviceDate.id}
                        className='bg-gray-50 p-2 rounded text-sm'>
                        <div className='flex justify-between items-center'>
                          <span>{serviceDate.date}</span>
                          <div className='flex items-center'>
                            <Clock className='h-3 w-3 mr-1 text-gray-500' />
                            <span>
                              {formatTime(serviceDate.start_time)} -{" "}
                              {formatTime(serviceDate.end_time)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}

            <div className='flex gap-2 mt-4 pt-3 border-t border-gray-200'>
              {item.status === "pending" ? (
                <Button
                  variant='default'
                  size='sm'
                  className='text-white bg-blue-500 border-blue-500 hover:bg-blue-600'>
                  Continue Booking
                </Button>
              ) : (
                <>
                  {item.status !== "completed" && item.status !== "expired" && (
                    <Button
                      onClick={() => handleOpenModal(item, "reschedule")}
                      variant='outline'
                      size='sm'
                      className='text-blue-500 border-blue-200'>
                      Reschedule
                    </Button>
                  )}
                  {!item.has_renewed &&
                    !item.is_renewed &&
                    item.status !== "completed" &&
                    item.status !== "expired" && (
                      <Button
                        onClick={() => handleOpenModal(item, "renew")}
                        variant='outline'
                        size='sm'
                        className='text-green-500 border-green-200'>
                        Renew
                      </Button>
                    )}
                  {item.status !== "completed" && item.status !== "expired" && (
                    <Button
                      onClick={() => handleOpenModal(item, "cancel")}
                      variant='outline'
                      size='sm'
                      className='text-red-500 border-red-200'>
                      Cancel
                    </Button>
                  )}
                </>
              )}
            </div>
            {(item.has_renewed || item.is_renewed) &&
              item.status !== "pending" && (
                <div className='mt-2 text-xs text-gray-600'>
                  {item.has_renewed ? (
                    <span>
                      This package has been <b>renewed</b>
                    </span>
                  ) : (
                    <span>
                      This is a <b>renewed</b> package
                    </span>
                  )}
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );

  // Render mobile cards
  const renderMobileCards = () => (
    <div className='block md:hidden'>
      {dataLoading ? (
        <>
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
        </>
      ) : (
        data
          ?.sort((a: any, b: any) => {
            const numA = parseInt(a.booking_number.split("-")[1], 10);
            const numB = parseInt(b.booking_number.split("-")[1], 10);
            return numB - numA; // Descending order
          })
          .map((item: any) => (
            <ModifiedPackageCard
              key={item.id}
              item={item}
              expandedRow={expandedRow}
              expandedData={expandedData}
              expandedDataLoading={expandedDataLoading}
              toggleRowExpansion={toggleRowExpansion}
              handleOpenModal={handleOpenModal}
              formatTime={formatTime}
              ImagePathSetting={ImagePathSetting}
            />
          ))
      )}
    </div>
  );

  // Render error state
  const renderError = () =>
    error && (
      <div className='text-center py-8'>
        <p className='text-red-500'>
          {error.message || "Failed to load bookings. Please try again."}
        </p>
        <Button onClick={() => refetch()} variant='outline' className='mt-4'>
          Retry
        </Button>
      </div>
    );

  // Render empty state
  const renderEmptyState = () =>
    !dataLoading &&
    data?.length === 0 &&
    !error && (
      <div className='text-center py-16'>
        <div className='mx-auto w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4'>
          <Calendar className='h-10 w-10 text-gray-400' />
        </div>
        <h3 className='text-lg font-medium text-gray-900'>No packages found</h3>
        <p className='mt-1 text-sm text-gray-500'>
          {propertyFilter !== "all" || apartmentFilter !== "all"
            ? "No packages match your filter criteria."
            : statusFilter === "all"
            ? "You don't have any packages yet."
            : `You don't have any ${statusFilter.replace("_", " ")} packages.`}
        </p>
        {(propertyFilter !== "all" || apartmentFilter !== "all") && (
          <Button
            variant='outline'
            size='sm'
            onClick={resetFilters}
            className='mt-4'>
            Reset Filters
          </Button>
        )}
      </div>
    );

  return (
    <div>
      {/* Filters */}
      <DesktopFilters />
      <MobileFilters />

      {renderMobileCards()}
      {renderDesktopTable()}
      {renderError()}
      {renderEmptyState()}

      {/* Modals */}
      {modalType === "cancel" && selectedPackage && (
        <CancelPackageModal
          onSuccess={() => {
            refetchExpanded();
          }}
          onClose={handleCloseModal}
          pkg={selectedPackage}
        />
      )}

      {modalType === "reschedule" && selectedPackage && (
        <ReschedulePackageModal
          onClose={handleCloseModal}
          onSuccess={() => {
            refetchExpanded();
          }}
          pkg={selectedPackage}
        />
      )}

      {modalType === "renew" && selectedPackage && (
        <ServiceWizard
          type={modalType}
          open={wizardOpen}
          onClose={handleCloseModal}
          initialData={savedWizardState[modalType]?.data}
          initialStep={savedWizardState[modalType]?.step || 0}
          bookingData={selectedPackage}
          openRenew={() => {}}
        />
      )}
    </div>
  );
};

export default DataPackages;

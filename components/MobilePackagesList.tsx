/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { ChevronDown, ChevronUp, Edit, Trash2, RefreshCw } from "lucide-react";
import CancelPackageModal from "./CancelPackageModal";
import ReschedulePackageModal from "./ReschedulePackageModal";
import { useState, useEffect, useTransition } from "react";

import { BookingAction } from "@/actions/booking";
import ServiceWizard from "./service-wizard";
import { useUserData } from "@/hooks/user-provider";
import { Skeleton } from "@/components/ui/skeleton";
import TeamAvailabilityAction from "@/actions/team-availability";
import moment from "moment";
import { formatTime } from "./all-bookings/DataTable";
import { apiRequest } from "@/lib/api";

interface Package {
  id: string;
  service: any;
  days: string[];
  startDate: string;
  endDate: string;
  status: string;
  duration: string;
  team: any;
  serviceIcon?: string;
  ref: string;
  teamAvailabilities: string[];
  serviceMinutes: number;
  frequency?: string;
  residenceType?: string;
  area?: any;
  expiryDate?: string;
  [key: string]: any;
}

interface ServiceDate {
  date: string;
  status: string;
}

export default function MobilePackagesList({
  statusFilter,
}: {
  statusFilter: string;
}) {
  // State for modal flow.
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [modalType, setModalType] = useState<
    "cancel" | "reschedule" | "renew" | null
  >(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const { dataLoading, setDataLoading } = useUserData();
  const [error, setError] = useState<string | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [expandedPackageId, setExpandedPackageId] = useState<string | null>(
    null
  );
  const [serviceDates, setServiceDates] = useState<Record<string, any[]>>({});

  const [loadingServiceDates, setLoadingServiceDates] = useState<
    Record<number, boolean>
  >({});

  // Fetch data on component mount.
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        setError(null);

        const result = await BookingAction(
          "recurrence_plan=once&recurrence_plan=twice&recurrence_plan=three&recurrence_plan=four&recurrence_plan=five&recurrence_plan=six",
          statusFilter === "all" ? undefined : statusFilter
        );

        setPackages(result);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setError("Failed to load bookings. Please try again.");
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [statusFilter]);

  // Map the service name to an icon filename.
  const iconMapping: Record<string, string> = {
    "Deep Cleaning": "residential",
    "Car Wash": "car-wash",
    "Regular Cleaning": "residential",
    "Specialized Cleaning": "specialised",
  };

  const handleOpenModal = (
    pkg: Package,
    type: "cancel" | "reschedule" | "renew"
  ) => {
    setSelectedPackage(pkg);
    setModalType(type);
    if (type === "renew") {
      setWizardOpen(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedPackage(null);
    setModalType(null);
  };

  const toggleExpand = async (packageId: string) => {
    if (expandedPackageId === packageId) {
      setExpandedPackageId(null);
    } else {
      setExpandedPackageId(packageId);

      // Fetch service dates if not already loaded
      if (!serviceDates[packageId]) {
        fetchServiceDates(packageId);
      }
    }
  };

  const fetchServiceDates = async (packageId: string) => {
    try {
      setLoadingServiceDates((prev) => ({ ...prev, [packageId]: true }));

      const dates = await TeamAvailabilityAction(
        packages.filter((p) => p.id === packageId)[0].teamAvailabilities
      );

      setServiceDates((prev) => ({
        ...prev,
        [packageId]: dates,
      }));
    } catch (error) {
      console.error("Failed to fetch service dates:", error);
    } finally {
      setLoadingServiceDates((prev) => ({ ...prev, [packageId]: false }));
    }
  };

  return (
    <div className='divide-y'>
      {dataLoading ? (
        // Shimmer effect while loading
        <div className='p-4'>
          <div className='animate-pulse flex space-x-4'>
            <div className='flex-1 space-y-6 py-1'>
              <div className='h-10 bg-gray-200 rounded'></div>
              <div className='h-10 bg-gray-200 rounded'></div>
              <div className='h-10 bg-gray-200 rounded'></div>
              <div className='h-10 bg-gray-200 rounded'></div>
            </div>
          </div>
        </div>
      ) : (
        packages.map((pkg: any) => (
          <div key={pkg.id} className='p-4'>
            <div className='flex items-start justify-between mb-3 gap-2 md:gap-0'>
              <div className='flex items-center'>
                <div className='mr-3'>
                  <img
                    src={`/icons/${
                      iconMapping[pkg.service.name] || pkg.serviceIcon
                    }.svg`}
                    alt={pkg.service.name}
                    width={24}
                    height={24}
                    className='w-auto'
                  />
                </div>
                <div>
                  <div className='text-[14px] font-medium'>
                    {pkg.service.name}
                  </div>
                </div>
              </div>
              <div className='flex md:space-x-2'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-[#0089f1] cursor-pointer'
                  onClick={() => handleOpenModal(pkg, "reschedule")}>
                  <Edit className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-[#ef3a4b] cursor-pointer'
                  onClick={() => handleOpenModal(pkg, "cancel")}>
                  <Trash2 className='h-4 w-4' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 text-[#0089f1] cursor-pointer'
                  onClick={() => handleOpenModal(pkg, "renew")}>
                  <RefreshCw className='h-4 w-4' />
                </Button>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-2 mb-3'>
              <div>
                <div className='text-xs text-[#64748b]'>Start Date</div>
                <div>{formatDate(pkg.startDate)}</div>
              </div>
              <div>
                <div className='text-xs text-[#64748b]'>End Date</div>
                <div>{formatDate(pkg.endDate)}</div>
              </div>
              <div>
                <div className='text-xs text-[#64748b]'>Payment</div>
                <div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      pkg.paymentStatus === "paid"
                        ? "bg-green-200 text-green-800"
                        : pkg.status === "unpaid"
                        ? "bg-red-200 text-red-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}>
                    {pkg.paymentStatus}
                  </span>
                </div>
              </div>
              <div>
                <div className='text-xs text-[#64748b]'>Duration</div>
                <div className='text-blue-500'>
                  {pkg.serviceMinutes} minutes
                </div>
              </div>
            </div>

            {/* Expandable Button */}
            <Button
              variant='link'
              className='text-[#0089f1] p-0 h-auto flex items-center text-sm mb-2'
              onClick={() => toggleExpand(pkg.id)}>
              {expandedPackageId === pkg.id
                ? "Hide Details"
                : "View Package Details"}
              {expandedPackageId === pkg.id ? (
                <ChevronUp className='w-4 h-4 ml-1' />
              ) : (
                <ChevronDown className='w-4 h-4 ml-1' />
              )}
            </Button>

            {/* Expandable Content */}
            {expandedPackageId === pkg.id && (
              <div className='mt-3 pt-3 border-t border-gray-100 text-sm'>
                <h4 className='font-medium mb-2'>Package Details</h4>

                <div className='grid grid-cols-2 gap-x-4 gap-y-2 mb-4'>
                  <div>
                    <div className='text-xs text-[#64748b]'>Frequency</div>
                    <div>{pkg.recurrence_plan || "Weekly"}</div>
                  </div>
                  <div>
                    <div className='text-xs text-[#64748b]'>Residence Type</div>
                    <div>{pkg.residenceType || "Apartment"}</div>
                  </div>
                  <div>
                    <div className='text-xs text-[#64748b]'>Area</div>
                    <div>
                      {pkg.property.name +
                        ", " +
                        pkg.district.name +
                        " " +
                        pkg.area?.name || "100-150 sqm"}
                    </div>
                  </div>
                  <div>
                    <div className='text-xs text-[#64748b]'>Expiry</div>
                    <div>{formatDate(pkg.endDate)}</div>
                  </div>
                </div>

                <h4 className='font-medium mb-2'>Team Information</h4>
                <div className='mb-4'>
                  <div className='text-xs text-[#64748b]'>Team</div>
                  <div>{pkg.team.name || "Team Alpha"}</div>
                </div>
                <div className='mb-4'>
                  <div className='text-xs text-[#64748b]'>
                    Team Members ({pkg.team.Users.length})
                  </div>
                  <div>
                    {pkg.team.Users.flatMap((u: any) => u.name).join(", ")}
                  </div>
                </div>

                <h4 className='font-medium mb-2'>Service Dates</h4>
                {loadingServiceDates[pkg.id] ? (
                  <div className='space-y-2'>
                    <Skeleton className='h-6 w-full' />
                    <Skeleton className='h-6 w-full' />
                    <Skeleton className='h-6 w-full' />
                  </div>
                ) : serviceDates[pkg.id].length > 0 ? (
                  <div className='space-y-2'>
                    <ul className='list-disc text-sm space-y-2'>
                      {serviceDates[pkg.id].map((dateInfo, index) => (
                        <li
                          key={index}
                          className='flex justify-between items-start'>
                          <div>
                            <p className='font-medium'>
                              {moment(dateInfo.date).format("ddd, DD MMM YYYY")}
                            </p>
                            <p className='text-xs text-gray-500'>
                              {formatTime(dateInfo.start_time)} -{" "}
                              {formatTime(dateInfo.end_time)}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ml-2
                                                               ${
                                                                 dateInfo.status ===
                                                                 "completed"
                                                                   ? "bg-green-200 text-green-800"
                                                                   : dateInfo.status ===
                                                                     "upcoming"
                                                                   ? "bg-blue-200 text-blue-800"
                                                                   : "bg-gray-200 text-gray-800"
                                                               }`}>
                            {dateInfo.status || "unknown"}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className='text-gray-500'>No upcoming service dates</div>
                )}

                <h4 className='font-medium mb-2 mt-4'>Service Information</h4>
                <div className='space-y-2'>
                  <div>
                    <div className='text-xs text-[#64748b]'>Service Type</div>
                    <div>{pkg.service.name}</div>
                  </div>
                  <div>
                    <div className='text-xs text-[#64748b]'>Duration</div>
                    <div>{pkg.duration}</div>
                  </div>
                  {pkg.serviceMinutes && (
                    <div>
                      <div className='text-xs text-[#64748b]'>
                        Service Minutes
                      </div>
                      <div>{pkg.serviceMinutes} minutes</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))
      )}

      {/* Modals */}
      {modalType === "cancel" && selectedPackage && (
        <CancelPackageModal
          onSuccess={() => {}}
          pkg={selectedPackage}
          onClose={handleCloseModal}
        />
      )}
      {modalType === "reschedule" && selectedPackage && (
        <ReschedulePackageModal
          pkg={selectedPackage}
          onClose={handleCloseModal}
          onSuccess={() => {}}
        />
      )}
      {modalType === "renew" && selectedPackage && wizardOpen && (
        <ServiceWizard
          type='renew'
          open={wizardOpen}
          onClose={() => {
            setWizardOpen(false);
          }}
          openRenew={() => {}}
          initialStep={0}
          bookingData={selectedPackage}
        />
      )}
    </div>
  );
}

// components/PackageCard.tsx
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import moment from "moment";
import { ExpandedPackageDetails } from "./ExpandedPackageDetails";

interface PackageCardProps {
  item: any;
  expandedRow: string | null;
  expandedData: any;
  expandedDataLoading: boolean;
  toggleRowExpansion: (id: string) => void;
  handleOpenModal: (pkg: any, type: "cancel" | "reschedule" | "renew") => void;
  formatTime: (time: string) => string;
  ImagePathSetting: Record<string, string>;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  item,
  expandedRow,
  expandedData,
  expandedDataLoading,
  toggleRowExpansion,
  handleOpenModal,
  formatTime,
  ImagePathSetting,
}) => {
  return (
    <div
      key={item.id}
      className='border rounded-lg mb-4 shadow-sm overflow-hidden'>
      <div className='p-4 bg-white'>
        <div className='flex items-center justify-between mb-3'>
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
              <ChevronUp className='h-4 w-4' />
            ) : (
              <ChevronDown className='h-4 w-4' />
            )}
          </Button>
        </div>

        <div className='grid grid-cols-2 gap-2 text-sm mb-3'>
          <div>
            <span className='text-gray-500'>Start Date:</span>
            <p>{item.startDate}</p>
          </div>
          <div>
            <span className='text-gray-500'>End Date:</span>
            <p>{item.endDate}</p>
          </div>
          <div>
            <span className='text-gray-500'>Payment:</span>
            <div>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1
                ${
                  item.paymentStatus === "paid"
                    ? "bg-green-200 text-green-800"
                    : item.paymentStatus === "unpaid"
                    ? "bg-red-200 text-red-800"
                    : "bg-yellow-200 text-yellow-800"
                }`}>
                {item.paymentStatus}
              </span>
            </div>
          </div>
          <div>
            <span className='text-gray-500'>Status:</span>
            <div>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1
                ${
                  item.status === "completed" || item.status === "expired"
                    ? "bg-green-200 text-green-800"
                    : item.status === "cancelled"
                    ? "bg-red-200 text-red-800"
                    : item.status === "in_progress"
                    ? "bg-orange-200 text-orange-800"
                    : item.status === "active"
                    ? "bg-blue-200 text-blue-800"
                    : item.status === "renewed"
                    ? " bg-cyan-200 text-cyan-800"
                    : item.status === "scheduled"
                    ? "bg-gray-200 text-gray-800"
                    : item.status === "upcoming"
                    ? "bg-purple-200 text-purple-800"
                    : "bg-yellow-200 text-yellow-800"
                }`}>
                {item.status.replace("_", " ")}
              </span>
            </div>
          </div>
          <div>
            <span className='text-gray-500'>Team:</span>
            <p>{item.team.name}</p>
          </div>
        </div>

        <div className='flex flex-wrap gap-2 mt-2'>
          {item.status !== "completed" && item.status !== "expired" && (
            <>
              <Button
                onClick={() => handleOpenModal(item, "reschedule")}
                variant='outline'
                size='sm'
                className='text-blue-600 border-blue-600'>
                Reschedule
              </Button>
              <Button
                onClick={() => handleOpenModal(item, "cancel")}
                variant='outline'
                size='sm'
                className='text-red-600 border-red-600'>
                Cancel
              </Button>
            </>
          )}
          {!item.has_renewed &&
            !item.is_renewed &&
            item.status !== "completed" &&
            item.status !== "expired" && (
              <Button
                onClick={() => handleOpenModal(item, "renew")}
                variant='outline'
                size='sm'
                className='text-green-600 border-green-600'>
                Renew
              </Button>
            )}
          {item.has_renewed && (
            <span className='px-2 py-1 text-xs'>
              This package has been <b>renewed</b>
            </span>
          )}
          {item.is_renewed && (
            <span className='px-2 py-1 text-xs'>
              This is a <b>renewed</b> package
            </span>
          )}
        </div>
      </div>

      {expandedRow === item.id && (
        <div className='bg-gray-50 p-4 border-t'>
          <ExpandedPackageDetails
            item={item}
            expandedData={expandedData}
            isLoading={expandedDataLoading}
            formatTime={formatTime}
            isMobile={true}
          />
        </div>
      )}
    </div>
  );
};

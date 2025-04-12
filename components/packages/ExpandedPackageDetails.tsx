// components/ExpandedPackageDetails.tsx
import React from "react";
import { Calendar, Users, Clock, Info } from "lucide-react";
import moment from "moment";
import { Shimmer } from "./ShimmerLoaders";

interface ExpandedPackageDetailsProps {
  item: any;
  expandedData: any;
  isLoading: boolean;
  formatTime: (time: string) => string;
  isMobile?: boolean;
}

export const ExpandedPackageDetails: React.FC<ExpandedPackageDetailsProps> = ({
  item,
  expandedData,
  isLoading,
  formatTime,
  isMobile = false,
}) => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
      <div className='space-y-4'>
        <div>
          <h3 className='text-sm font-semibold flex items-center gap-1'>
            <Calendar className='h-4 w-4' /> Service Dates
          </h3>
          <div className={`${isMobile ? "pl-3" : "pl-5"} mt-2`}>
            {isLoading ? (
              <Shimmer lines={3} />
            ) : expandedData ? (
              <ul
                className={`list-disc text-sm space-y-${isMobile ? "3" : "2"}`}>
                {expandedData.map((dateInfo: any, index: number) => (
                  <li
                    key={index}
                    className='flex flex-wrap justify-between items-start gap-2'>
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
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                      ${
                        dateInfo.status === "completed"
                          ? "bg-green-200 text-green-800"
                          : dateInfo.status === "active"
                          ? "bg-yellow-200 text-yellow-800"
                          : dateInfo.status === "upcoming"
                          ? "bg-blue-200 text-blue-800"
                          : dateInfo.status === "scheduled" &&
                            dateInfo.is_cancelled !== true
                          ? "bg-gray-200 text-gray-800"
                          : dateInfo.status === "rescheduled"
                          ? "bg-purple-200 text-purple-800"
                          : dateInfo.is_cancelled === true
                          ? "bg-red-200 text-red-800"
                          : "bg-red-200 text-red-800"
                      }`}>
                      {dateInfo.status || "unknown"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className='text-sm text-gray-500'>No service dates found</p>
            )}
          </div>
        </div>

        <div>
          <h3 className='text-sm font-semibold flex items-center gap-1'>
            <Info className='h-4 w-4' /> Additional Details
          </h3>
          <div
            className={`${isMobile ? "pl-3" : "pl-5"} mt-2 space-y-1 text-sm`}>
            {isLoading ? (
              <Shimmer lines={4} />
            ) : (
              <>
                <p>
                  <span className='font-medium'>Expiry Date:</span>{" "}
                  {moment(item.end_date).format("DD MMM YYYY")}
                </p>
                <p>
                  <span className='font-medium'>Residence Type:</span> Apt. -{" "}
                  {item.appartment_number},{" "}
                  {item.residence_type.type || "Standard"}
                </p>
                <p className='break-words'>
                  <span className='font-medium'>Service Area:</span>{" "}
                  {item.property.name +
                    ", " +
                    item.district.name +
                    " " +
                    item.area.name || "N/A"}
                </p>
                <p>
                  <span className='font-medium'>Frequency:</span>{" "}
                  {item.recurrence_plan === "once"
                    ? "Once a week"
                    : item.recurrence_plan === "twice"
                    ? "2 times a week"
                    : item.recurrence_plan === "three"
                    ? "3 times a week"
                    : item.recurrence_plan === "four"
                    ? "4 times a week"
                    : item.recurrence_plan === "five"
                    ? "5 times a week"
                    : item.recurrence_plan === "six"
                    ? "6 times a week"
                    : "One Time"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className='space-y-4'>
        <div>
          <h3 className='text-sm font-semibold flex items-center gap-1'>
            <Users className='h-4 w-4' /> Team Details
          </h3>
          <div
            className={`${isMobile ? "pl-3" : "pl-5"} mt-2 space-y-1 text-sm`}>
            {isLoading ? (
              <Shimmer lines={3} />
            ) : (
              <>
                <p>
                  <span className='font-medium'>Team Name:</span>{" "}
                  {item.team.name}
                </p>
                <p>
                  <span className='font-medium'>Team Members:</span>{" "}
                  {item.team.Users.flatMap((u: any) => u.name).join(", ")}
                </p>
                <p>
                  <span className='font-medium'>Team Size:</span>{" "}
                  {item.team.Users.length +
                    (item.team.Users.length > 1 ? " members" : " member") ||
                    "3 members"}
                </p>
              </>
            )}
          </div>
        </div>

        <div>
          <h3 className='text-sm font-semibold flex items-center gap-1'>
            <Clock className='h-4 w-4' /> Service Information
          </h3>
          <div
            className={`${isMobile ? "pl-3" : "pl-5"} mt-2 space-y-1 text-sm`}>
            {isLoading ? (
              <Shimmer lines={5} />
            ) : (
              <>
                <p>
                  <span className='font-medium'>Service Name:</span>{" "}
                  {item.service.name}
                </p>
                <p>
                  <span className='font-medium'>Cleaning Supply Included:</span>{" "}
                  {item.cleaning_supply_included ? "Yes" : "No"}
                </p>
                <p>
                  <span className='font-medium'>Service Duration:</span>{" "}
                  {item.serviceMinutes} minutes
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

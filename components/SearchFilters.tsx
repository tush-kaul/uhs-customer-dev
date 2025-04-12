"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { GetStatsAction } from "@/actions/booking";

// Shimmer loading component
const ShimmerLoader = () => (
  <div className='animate-pulse flex space-x-4 w-full'>
    {[1, 2, 3].map((item) => (
      <div key={item} className='h-24 bg-gray-200 rounded-md flex-1'></div>
    ))}
  </div>
);

const Stats = ({
  selectedFilter,
  statsDataRes,
}: {
  selectedFilter: string;
  statsDataRes: any;
}) => {
  const statsItems = [
    {
      label: "Services Booked",
      value: statsDataRes.booked_count,
      change: statsDataRes.booked_percentage_change,
      color: "text-red-500",
      bgColor: "bg-red-50",
      icon: ArrowUpRight,
    },
    {
      label: "Completed Services",
      value: statsDataRes.completed_count,
      change: statsDataRes.completed_percentage_change,
      color: "text-green-500",
      bgColor: "bg-green-50",
      icon: ArrowUpRight,
    },
    {
      label: "Pending Services",
      value: statsDataRes.pending_count,
      change: statsDataRes.pending_percentage_change,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      icon: ArrowUpRight,
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      {statsItems.map((item, index) => {
        const Icon = item.icon;
        const isPositive = item.change >= 0;

        return (
          <div
            key={index}
            className={`
              ${item.bgColor} 
              rounded-lg 
              p-4 
              border 
              border-transparent 
              hover:border-${item.color.replace("text-", "")} 
              transition-all 
              duration-300 
              ease-in-out
            `}>
            <div className='flex justify-between items-center mb-2'>
              <h3 className='text-gray-600 text-sm font-medium'>
                {item.label}
              </h3>
              <div className='flex items-center'>
                {isPositive ? (
                  <ArrowUpRight className='text-green-500 w-4 h-4 mr-1' />
                ) : (
                  <ArrowDownRight className='text-red-500 w-4 h-4 mr-1' />
                )}
                <span
                  className={`text-xs font-semibold ${
                    isPositive ? "text-green-500" : "text-red-500"
                  }`}>
                  {Math.abs(item.change)}%
                </span>
              </div>
            </div>
            <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        );
      })}
    </div>
  );
};

const ServiceFilters = () => {
  const filters = [
    ["Regular Cleaning", "residential"],
    ["Deep Cleaning", "residential"],
    ["Specialised Cleaning", "specialised"],
    ["Car Wash Services", "car-wash"],
  ];

  const [selectedFilter, setSelectedFilter] = useState(filters[0][0]);
  const [isLoading, setIsLoading] = useState(true);
  const [servicesData, setServicesData] = useState<any | null>(null);
  const [error, setError] = useState(null);

  // Fetch services function
  const fetchServices = async (filter: string) => {
    setIsLoading(true);
    try {
      const response = await GetStatsAction(filter);
      setServicesData(response);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching services:", err);
      setError(err.message);
      setServicesData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial data and on filter change
  useEffect(() => {
    fetchServices(selectedFilter);
  }, [selectedFilter]);

  return (
    <div
      className='bg-white rounded-lg p-4 mb-6 shadow-sm overflow-x-auto w-full'
      suppressHydrationWarning>
      <RadioGroup
        defaultValue={filters[0][0]}
        suppressHydrationWarning
        className='flex justify-between w-full overflow-x-auto whitespace-nowrap pb-3 space-x-4'
        value={selectedFilter}
        onValueChange={setSelectedFilter}>
        {filters.map(([label, icon], index) => {
          const isSelected = selectedFilter === label;

          return (
            <div
              key={index}
              onClick={() => setSelectedFilter(label)}
              className={`flex items-center justify-start gap-6 md:gap-3 cursor-pointer border rounded-md px-3 py-3 transition-all flex-shrink-0
                ${
                  index === 1
                    ? "min-w-[210px] md:min-w-[22%]"
                    : index === 2
                    ? "min-w-[240px] md:min-w-[25%]"
                    : index === 3
                    ? "min-w-[225px] md:min-w-[22%]"
                    : "min-w-[260px] md:min-w-[23%]"
                }
                ${
                  isSelected
                    ? "bg-[#f8fbff] border-[#ea682a] shadow-md"
                    : "border-gray-300"
                }`}>
              <RadioGroupItem
                value={label}
                id={label}
                suppressHydrationWarning
                className={`w-5 h-5 border-2 rounded-full transition-colors cursor-pointer
                  ${
                    isSelected ? "border-[#ea682a]" : "border-gray-400 bg-white"
                  }`}
              />

              <div className='flex w-full items-center'>
                <Image
                  src={`/icons/${icon}.svg`}
                  alt={label}
                  width={20}
                  height={20}
                  className='mr-2 text-[#64748b] h-8 w-8 md:h-10 md:w-10'
                />
                <label
                  htmlFor={label}
                  className='flex items-center cursor-pointer w-full h-full text-sm md:text-base'>
                  {label}
                </label>
              </div>
            </div>
          );
        })}
      </RadioGroup>

      <div className='h-4'></div>

      {isLoading ? (
        <ShimmerLoader />
      ) : error ? (
        <div className='text-red-500'>Error: {error}</div>
      ) : (
        <Stats selectedFilter={selectedFilter} statsDataRes={servicesData} />
      )}
    </div>
  );
};

export default ServiceFilters;

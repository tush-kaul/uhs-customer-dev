// import { Play } from "lucide-react";

"use client";

interface StatsProps {
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  statsDataRes: any;
}

export const Stats = ({
  selectedFilter,
  setSelectedFilter,
  statsDataRes,
}: StatsProps) => {
  const statsData = [
    {
      name: "Regular Cleaning",
      data: [
        {
          label: "Services Booked",
          value: statsDataRes.booked_count,
          change: statsDataRes.booked_percentage_change,
          color: "text-red-500",
        },
        {
          label: "Completed Services",
          value: statsDataRes.completed_count,
          change: statsDataRes.completed_percentage_change,
          color: "text-green-500",
        },
        {
          label: "Pending Services",
          value: statsDataRes.pending_count,
          change: statsDataRes.pending_percentage_change,
          color: "text-blue-500",
        },
      ],
    },
    {
      name: "Deep Cleaning",
      data: [
        {
          label: "Services Booked",
          value: statsDataRes.booked_count,
          change: statsDataRes.booked_percentage_change,
          color: "text-red-500",
        },
        {
          label: "Completed Services",
          value: statsDataRes.completed_count,
          change: statsDataRes.completed_percentage_change,
          color: "text-green-500",
        },
        {
          label: "Pending Services",
          value: statsDataRes.pending_count,
          change: statsDataRes.pending_percentage_change,
          color: "text-blue-500",
        },
      ],
    },
    {
      name: "Specialised Cleaning",
      data: [
        {
          label: "Services Booked",
          value: statsDataRes.booked_count,
          change: statsDataRes.booked_percentage_change,
          color: "text-red-500",
        },
        {
          label: "Completed Services",
          value: statsDataRes.completed_count,
          change: statsDataRes.completed_percentage_change,
          color: "text-green-500",
        },
        {
          label: "Pending Services",
          value: statsDataRes.pending_count,
          change: statsDataRes.pending_percentage_change,
          color: "text-blue-500",
        },
      ],
    },
    {
      name: "Car Wash Services",
      data: [
        {
          label: "Services Booked",
          value: statsDataRes.booked_count,
          change: statsDataRes.booked_percentage_change,
          color: "text-red-500",
        },
        {
          label: "Completed Services",
          value: statsDataRes.completed_count,
          change: statsDataRes.completed_percentage_change,
          color: "text-green-500",
        },
        {
          label: "Pending Services",
          value: statsDataRes.pending_count,
          change: statsDataRes.pending_percentage_change,
          color: "text-blue-500",
        },
      ],
    },
  ];

  // console.log(selectedFilter);

  return (
    <div
      className='grid grid-cols-1 md:grid-cols-3 gap-3'
      onClick={() => setSelectedFilter(selectedFilter)}>
      {selectedFilter &&
        statsData
          .find((stat) => stat.name === selectedFilter)

          ?.data.map((item, index) => {
            // console.log(selectedFilter);
            return (
              <div key={index} className='bg-white p-4 rounded-lg shadow-sm'>
                <div className='flex justify-between items-center'>
                  <h3 className='text-gray-500 text-sm'>{item.label}</h3>
                  <span className={`text-xs font-medium ${item.color}`}>
                    {item.change}%
                  </span>
                </div>
                <p className='text-2xl font-bold mt-2'>{item.value}</p>
              </div>
            );
          })}
    </div>
  );
};

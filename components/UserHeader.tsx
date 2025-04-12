"use client";
import React from "react";
import { toast } from "sonner";
import { useUserQuery } from "@/lib/tanstack/queries";

const ShimmerEffect = () => {
  return (
    <div className='animate-pulse'>
      <div className='h-4 bg-gray-300 rounded w-20 mb-2'></div>
      <div className='h-6 bg-gray-300 rounded w-40'></div>
    </div>
  );
};

const UserHeader = () => {
  // Use the React Query hook for user data instead of useState + useEffect
  const {
    data: user,
    isLoading: dataLoading,
    error,
  } = useUserQuery(true, null, null);

  // Handle query errors
  React.useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load user data"
      );
    }
  }, [error]);

  return (
    <div className='p-2 flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4'>
      <div>
        {dataLoading ? (
          <ShimmerEffect />
        ) : user ? (
          <>
            <h1 className='text-xl md:text-2xl font-bold text-[#1e293b]'>
              Welcome, {user.name}
            </h1>
            <p className='text-[#64748b] text-sm md:text-base'>
              Monitor all of your service bookings and packages here
            </p>
          </>
        ) : (
          <p className='text-[#64748b] text-sm md:text-base'>
            User data not available
          </p>
        )}
      </div>
    </div>
  );
};

export default UserHeader;

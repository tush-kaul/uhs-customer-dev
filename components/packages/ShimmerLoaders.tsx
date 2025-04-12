// components/ShimmerLoaders.tsx
import React from "react";

/**
 * Generic shimmer component for loading state
 *
 * @param lines Number of shimmer lines to display
 * @param height CSS height class for the shimmer lines
 */
export const Shimmer = ({
  lines = 3,
  height = "h-4",
}: {
  lines?: number;
  height?: string;
}) => (
  <div className='space-y-2 w-full'>
    {Array(lines)
      .fill(0)
      .map((_, i) => (
        <div
          key={i}
          className={`${height} bg-gray-200 rounded animate-pulse`}></div>
      ))}
  </div>
);

/**
 * Shimmer card for mobile view loading state
 */
export const ShimmerCard = () => (
  <div className='border rounded-lg mb-4 shadow-sm overflow-hidden'>
    <div className='p-4 bg-white'>
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-gray-200 animate-pulse'></div>
          <div className='space-y-2'>
            <div className='h-4 w-24 bg-gray-200 rounded animate-pulse'></div>
            <div className='h-3 w-16 bg-gray-200 rounded animate-pulse'></div>
          </div>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-2'>
        <div className='h-12 bg-gray-200 rounded animate-pulse'></div>
        <div className='h-12 bg-gray-200 rounded animate-pulse'></div>
        <div className='h-12 bg-gray-200 rounded animate-pulse'></div>
        <div className='h-12 bg-gray-200 rounded animate-pulse'></div>
      </div>
    </div>
  </div>
);

/**
 * Shimmer row for table loading state
 */
export const ShimmerRow = () => (
  <tr>
    <td colSpan={9}>
      <div className='animate-pulse flex space-x-4'>
        <div className='flex-1 space-y-6 py-1'>
          <div className='h-10 bg-gray-200 rounded'></div>
          <div className='h-10 bg-gray-200 rounded'></div>
          <div className='h-10 bg-gray-200 rounded'></div>
          <div className='h-10 bg-gray-200 rounded'></div>
          <div className='h-10 bg-gray-200 rounded'></div>
          <div className='h-10 bg-gray-200 rounded'></div>
          <div className='h-10 bg-gray-200 rounded'></div>
        </div>
      </div>
    </td>
  </tr>
);

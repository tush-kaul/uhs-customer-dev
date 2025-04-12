// components/booking/ShimmerComponents.tsx
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";

interface TableShimmerProps {
  rowCount?: number;
}

export const TableShimmer: React.FC<TableShimmerProps> = ({ rowCount = 5 }) => {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, index) => (
        <TableRow key={index} className='hover:bg-gray-50'>
          <TableCell className='py-4'>
            <div className='flex items-center gap-3'>
              <div className='min-w-[40px] w-10 h-10 bg-gray-200 rounded-full animate-pulse'></div>
              <div>
                <div className='h-4 bg-gray-200 rounded w-24 animate-pulse'></div>
                <div className='h-3 bg-gray-200 rounded w-16 mt-2 animate-pulse'></div>
              </div>
            </div>
          </TableCell>
          <TableCell className='py-4'>
            <div className='h-4 bg-gray-200 rounded w-32 animate-pulse'></div>
            <div className='h-3 bg-gray-200 rounded w-24 mt-2 animate-pulse'></div>
          </TableCell>
          <TableCell className='py-4'>
            <div className='h-4 bg-gray-200 rounded w-16 animate-pulse'></div>
          </TableCell>
          <TableCell className='py-4'>
            <div className='h-4 bg-gray-200 rounded w-20 animate-pulse'></div>
          </TableCell>
          <TableCell className='py-4'>
            <div className='h-4 bg-gray-200 rounded w-24 animate-pulse'></div>
          </TableCell>
          <TableCell className='py-4'>
            <div className='h-4 bg-gray-200 rounded w-16 animate-pulse'></div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

interface CardShimmerProps {
  cardCount?: number;
}

export const CardShimmer: React.FC<CardShimmerProps> = ({ cardCount = 3 }) => {
  return (
    <>
      {Array.from({ length: cardCount }).map((_, index) => (
        <div
          key={index}
          className='bg-white rounded-lg shadow p-4 space-y-3 animate-pulse'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-gray-200 rounded-full'></div>
            <div className='flex-1'>
              <div className='h-4 bg-gray-200 rounded w-2/3'></div>
              <div className='h-3 bg-gray-200 rounded w-1/2 mt-2'></div>
            </div>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <div className='space-y-1'>
              <div className='h-3 bg-gray-200 rounded w-1/2'></div>
              <div className='h-4 bg-gray-200 rounded w-3/4'></div>
            </div>
            <div className='space-y-1'>
              <div className='h-3 bg-gray-200 rounded w-1/2'></div>
              <div className='h-4 bg-gray-200 rounded w-3/4'></div>
            </div>
          </div>
          <div className='h-6 bg-gray-200 rounded w-1/3'></div>
          <div className='flex justify-end gap-2'>
            <div className='h-8 bg-gray-200 rounded w-24'></div>
            <div className='h-8 bg-gray-200 rounded w-24'></div>
          </div>
        </div>
      ))}
    </>
  );
};

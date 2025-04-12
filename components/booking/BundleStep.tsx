// components/Steps/BundleStep.tsx
import React from "react";
import { Loader2 } from "lucide-react";
import { BundleType } from "@/types";

type BundleStepProps = {
  bundles: any[];
  loading: boolean;
  watch: (path?: string) => any;
  setValue: (
    name: string,
    value: any,
    options?: { shouldValidate?: boolean }
  ) => void;
};

export default function BundleStep({
  bundles,
  loading,
  watch,
  setValue,
}: BundleStepProps) {
  const bundleId = watch("bundleId");

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center py-12'>
        <Loader2 className='h-10 w-10 animate-spin text-primary mb-4' />
        <p className='text-gray-500'>Loading service bundles...</p>
      </div>
    );
  }

  if (!bundles.length || !bundles[0]?.bundles?.length) {
    return (
      <div className='text-center py-12'>
        <div className='mb-4 flex justify-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-12 w-12 text-gray-400'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
        </div>
        <h3 className='text-lg font-medium text-gray-900'>
          No bundles available
        </h3>
        <p className='mt-2 text-gray-500'>
          No service bundles are available for the selected criteria. Please try
          a different date or service type.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {bundles[0]?.bundles.map((bundle: BundleType) => (
          <div
            key={bundle.id}
            className={`
              border p-4 rounded-lg cursor-pointer transition-all duration-200
              ${
                bundleId === bundle.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "hover:bg-gray-50 border-gray-200"
              }
            `}
            onClick={() =>
              setValue("bundleId", bundle.id, { shouldValidate: true })
            }>
            <h3 className='font-medium'>{bundle.title}</h3>
            {bundleId === bundle.id && (
              <div className='flex items-center mt-2 text-primary text-sm'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 mr-1'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M5 13l4 4L19 7'
                  />
                </svg>
                Selected
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

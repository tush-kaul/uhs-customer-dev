// components/UI/ServiceSelector.tsx
import React from "react";
import { Loader2 } from "lucide-react";
import { ServiceType } from "@/types";

type ServiceSelectorProps = {
  services: ServiceType[];
  loading: boolean;
  selectedService: string;
  onChange: (value: string) => void;
};

export default function ServiceSelector({
  services,
  loading,
  selectedService,
  onChange,
}: ServiceSelectorProps) {
  if (loading) {
    return (
      <div className='flex justify-center py-8'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
      {services.map((service) => (
        <div
          key={service.id}
          onClick={() => onChange(service.id)}
          className={`
            relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200
            border-2 ${
              selectedService === service.id
                ? "border-primary shadow-md scale-[1.01]"
                : "border-gray-200 hover:border-gray-300"
            }
            group
          `}>
          <div className='aspect-video bg-gray-100 relative'>
            {service.photo_url ? (
              <img
                src={service.photo_url}
                alt={service.name}
                className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center bg-gray-200 text-gray-500'>
                {service.name.charAt(0)}
              </div>
            )}

            {/* Selected Indicator */}
            {selectedService === service.id && (
              <div className='absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-4 w-4 text-white'
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
              </div>
            )}
          </div>

          <div className='p-3'>
            <h3 className='font-medium'>{service.name}</h3>
            {service.description && (
              <p className='text-sm text-gray-500 mt-1'>
                {service.description}
              </p>
            )}
          </div>

          {/* Radio button (visually hidden but accessible) */}
          <input
            type='radio'
            name='service-selector'
            value={service.id}
            checked={selectedService === service.id}
            onChange={() => onChange(service.id)}
            className='sr-only'
          />
        </div>
      ))}
    </div>
  );
}

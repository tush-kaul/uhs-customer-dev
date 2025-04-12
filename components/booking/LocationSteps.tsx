// components/Steps/LocationStep.tsx
import React from "react";
import {
  FieldValues,
  useFormContext,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { Loader2 } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AreaType, DistrictType, PropertyType, ServiceType } from "@/types";
import ServiceSelector from "./ServiceSelector";

type LocationStepProps = {
  areas: AreaType[];
  districts: DistrictType[];
  properties: PropertyType[];
  residences: any[];
  services: ServiceType[];
  subServices: ServiceType[];
  loading: {
    areas: boolean;
    districts: boolean;
    properties: boolean;
    residence: boolean;
    service: boolean;
    subService: boolean;
  };
  onServiceChange: (value: string) => void;
  onSubServiceChange: (value: string) => void;
  setValue: any;
  watch: any;
};

export default function LocationStep({
  areas,
  districts,
  properties,
  residences,
  services,
  subServices,
  loading,
  onServiceChange,
  onSubServiceChange,
  watch,
  setValue,
}: LocationStepProps) {
  // Add fallbacks for watch function
  const watchWithFallback = (name: string) => {
    try {
      return watch ? watch(name) : "";
    } catch (e) {
      console.error("Error watching form field:", name, e);
      return "";
    }
  };

  const area = watchWithFallback("area");
  const district = watchWithFallback("district");
  const service = watchWithFallback("service");
  const subService = watchWithFallback("subService");
  const residenceType = watchWithFallback("residenceType");
  const customerDetails = watchWithFallback("customerDetails");
  console.log("LocationStep formContext:", {
    area,
    district,
    service,
    subService,
    residenceType,
    customerDetails,
  });
  return (
    <div className='space-y-6'>
      {/* Service Selection */}
      <div className='space-y-4'>
        <Label className='text-lg font-medium'>Select Service</Label>
        <ServiceSelector
          services={services}
          loading={loading.service}
          selectedService={service}
          onChange={onServiceChange}
        />
      </div>

      {/* Sub-Service Selection */}
      {service && (
        <div className='space-y-4'>
          <Label className='text-lg font-medium'>Select Sub-Service</Label>
          <ServiceSelector
            services={subServices}
            loading={loading.subService}
            selectedService={subService}
            onChange={onSubServiceChange}
          />
        </div>
      )}

      {/* Location Details */}
      <div className='space-y-4'>
        <Label className='text-lg font-medium'>Location Details</Label>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label>Area</Label>
            <Select
              value={area}
              onValueChange={(value) =>
                setValue("area", value, { shouldValidate: true })
              }>
              <SelectTrigger className='hover:bg-gray-100 transition-transform duration-200 cursor-pointer'>
                <SelectValue placeholder='Select Area' />
              </SelectTrigger>
              <SelectContent>
                {loading.areas ? (
                  <SelectItem value='loading' disabled>
                    <Loader2 className='h-4 w-4 animate-spin' />
                  </SelectItem>
                ) : (
                  areas.map((areaOption) => (
                    <SelectItem key={areaOption.id} value={areaOption.id}>
                      {areaOption.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>District</Label>
            <Select
              value={district}
              disabled={!area || loading.districts}
              onValueChange={(value) =>
                setValue("district", value, { shouldValidate: true })
              }>
              <SelectTrigger className='hover:bg-gray-100 transition-transform duration-200 cursor-pointer'>
                <SelectValue placeholder='Select District' />
              </SelectTrigger>
              <SelectContent>
                {loading.districts ? (
                  <SelectItem value='loading' disabled>
                    <Loader2 className='h-4 w-4 animate-spin' />
                  </SelectItem>
                ) : (
                  districts.map((districtOption) => (
                    <SelectItem
                      key={districtOption.id}
                      value={districtOption.id.toString()}>
                      {districtOption.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>Property</Label>
            <Select
              value={watch("property")}
              disabled={!district || loading.properties}
              onValueChange={(value) =>
                setValue("property", value, { shouldValidate: true })
              }>
              <SelectTrigger className='hover:bg-gray-100 transition-transform duration-200 cursor-pointer'>
                <SelectValue placeholder='Select Property' />
              </SelectTrigger>
              <SelectContent>
                {loading.properties ? (
                  <SelectItem value='loading' disabled>
                    <Loader2 className='h-4 w-4 animate-spin' />
                  </SelectItem>
                ) : (
                  properties.map((propertyOption) => (
                    <SelectItem
                      key={propertyOption.id}
                      value={propertyOption.id.toString()}>
                      {propertyOption.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>Residence Type</Label>
            <Select
              value={residenceType}
              onValueChange={(value) =>
                setValue("residenceType", value, { shouldValidate: true })
              }>
              <SelectTrigger className='hover:bg-gray-100 transition-transform duration-200 cursor-pointer'>
                <SelectValue placeholder='Select Residence Type' />
              </SelectTrigger>
              <SelectContent>
                {residences.map((res) => (
                  <SelectItem key={res.id} value={res.id}>
                    {res.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>Apartment Number</Label>
            <Input
              placeholder='Apartment Number'
              value={customerDetails?.apartmentNumber}
              onChange={(e) =>
                setValue("customerDetails.apartmentNumber", e.target.value, {
                  shouldValidate: true,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

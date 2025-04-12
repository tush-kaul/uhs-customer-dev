"use client";

import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import AlertMessage from "./layout/AlertMessage";
import { Spinner } from "./ui/spinner";
import { PropertyAction } from "@/actions/property";
import DistrictAction from "@/actions/district";
import AreaAction from "@/actions/area";
import ResidenceAction from "@/actions/residence";
import { useUserData } from "@/hooks/user-provider";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    whatsappNumber: "",
    usePhoneForWhatsapp: true,
    area: "",
    districtId: "",
    propertyId: "",
    residenceType: "",
    apartmentNumber: "",
    lat: 0.0,
    lng: 0.0,
  });

  // State for storing API data
  const [areas, setAreas] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [residences, setResidences] = useState<any[]>([]);
  const { userData, updateUserData } = useUserData();
  // Loading states for different API calls
  const [loading, setLoading] = useState({
    areas: false,
    districts: false,
    properties: false,
    residence: false,
    submit: false,
  });

  const router = useRouter();
  const [flashAlert, setFlashAlert] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);

  // Fetch areas on component mount
  useEffect(() => {
    fetchAreas();
    fetchResidences();
  }, []);

  // Fetch districts when area changes
  useEffect(() => {
    if (formData.area) {
      fetchDistricts(formData.area);
      // Reset district and property when area changes
      setFormData((prev) => ({ ...prev, districtId: "", propertyId: "" }));
      setProperties([]);
    }
  }, [formData.area]);

  // Fetch properties when district changes
  useEffect(() => {
    if (formData.districtId) {
      fetchProperties(formData.districtId);
      // Reset property when district changes
      setFormData((prev) => ({ ...prev, propertyId: "" }));
    }
  }, [formData.districtId]);

  const fetchResidences = async () => {
    try {
      setLoading((prev) => ({ ...prev, residence: true }));
      const response = await ResidenceAction();
      setResidences(response);
      setLoading((prev) => ({ ...prev, residence: false }));
    } catch (error) {
      console.error("Error fetching residences:", error);
      setLoading((prev) => ({ ...prev, residence: false }));
      toast.error("Failed to load residence types");
    }
  };

  const fetchAreas = async () => {
    try {
      setLoading((prev) => ({ ...prev, areas: true }));
      const response = await AreaAction();
      setAreas(response);
      setLoading((prev) => ({ ...prev, areas: false }));
    } catch (error) {
      console.error("Error fetching areas:", error);
      setLoading((prev) => ({ ...prev, areas: false }));
      toast.error("Failed to load areas");
    }
  };

  const fetchDistricts = async (areaId: string) => {
    try {
      setLoading((prev) => ({ ...prev, districts: true }));
      const response = await DistrictAction(areaId);
      setDistricts(response);
      setLoading((prev) => ({ ...prev, districts: false }));
    } catch (error) {
      console.error("Error fetching districts:", error);
      setLoading((prev) => ({ ...prev, districts: false }));
      toast.error("Failed to load districts");
    }
  };

  const fetchProperties = async (districtId: string) => {
    try {
      setLoading((prev) => ({ ...prev, properties: true }));
      const response = await PropertyAction(districtId);
      setProperties(response);
      setLoading((prev) => ({ ...prev, properties: false }));
    } catch (error) {
      console.error("Error fetching properties:", error);
      setLoading((prev) => ({ ...prev, properties: false }));
      toast.error("Failed to load properties");
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePhoneChange = (value: any) => {
    setFormData({
      ...formData,
      phone: value,
      whatsappNumber: formData.usePhoneForWhatsapp
        ? value
        : formData.whatsappNumber,
    });
  };

  const handleWhatsappChange = (value: any) => {
    setFormData({
      ...formData,
      whatsappNumber: value,
    });
  };

  const toggleUsePhoneForWhatsapp = () => {
    setFormData({
      ...formData,
      usePhoneForWhatsapp: !formData.usePhoneForWhatsapp,
      whatsappNumber: !formData.usePhoneForWhatsapp ? formData.phone : "",
    });
  };

  const validateForm = () => {
    if (!formData.name) {
      toast.error("Please enter your name");
      return false;
    }
    if (!formData.email || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!formData.phone || formData.phone.length < 6) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    if (!formData.area) {
      toast.error("Please select an area");
      return false;
    }
    if (!formData.districtId) {
      toast.error("Please select a district");
      return false;
    }
    if (!formData.propertyId) {
      toast.error("Please select a property");
      return false;
    }
    if (!formData.residenceType) {
      toast.error("Please select residence type");
      return false;
    }
    if (!formData.apartmentNumber) {
      toast.error("Please enter your apartment number");
      return false;
    }
    if (!formData.whatsappNumber) {
      toast.error("Please provide a WhatsApp number");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      setLoading((prev) => ({ ...prev, submit: true }));

      // Get the text values for the selected options if needed for display purposes
      const selectedArea = areas.find(
        (a) => a.id.toString() === formData.area.toString()
      );
      const selectedDistrict = districts.find(
        (d) => d.id.toString() === formData.districtId.toString()
      );
      const selectedProperty = properties.find(
        (p) => p.id.toString() === formData.propertyId.toString()
      );

      const response = await axios.post("/api/auth/signup", {
        name: formData.name,
        email: formData.email,
        phone: `+${formData.phone}`,
        whatsapp_number: `+${formData.whatsappNumber}`,

        areaId: formData.area,
        districtId: formData.districtId,
        propertyId: formData.propertyId,
        residenceType: formData.residenceType,
        apartment_number: formData.apartmentNumber,

        area: formData.area,
        district: formData.districtId,
        property: formData.propertyId,
        lat: selectedProperty.latitude,
        lng: selectedProperty.longitude,
        residenceTypeId: formData.residenceType,
      });

      if (response.data) {
        updateUserData({
          name: formData.name,
          email: formData.email,
          phone: `+${formData.phone}`,
          whatsapp_number: `+${formData.whatsappNumber}`,

          areaId: formData.area,
          districtId: formData.districtId,
          propertyId: formData.propertyId,
          residenceType: formData.residenceType,
          apartment_number: formData.apartmentNumber,

          area: selectedArea.id,
          district: selectedDistrict.id,
          property: selectedProperty.id,
          lat: selectedProperty.latitude,
          lng: selectedProperty.longitude,
          residenceTypeId: formData.residenceType,
        });
        toast.success("OTP sent successfully!");

        router.push(`/otp?phone=${formData.phone}&rc=_nus`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response.data.message.message);
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  return (
    <>
      <div className='flex-relative top-0'>
        {flashAlert && (
          <AlertMessage type={flashAlert.type} message={flashAlert.message} />
        )}
      </div>
      <p className='mt-2 text-2xl font-semibold text-gray-800'>
        Create your account
      </p>
      <p className='text-md text-gray-500 text-center'>
        Please fill in your details to sign up
      </p>

      <div className='w-full max-w-lg mt-6 flex flex-col gap-4'>
        {/* Personal Details */}
        <input
          type='text'
          name='name'
          value={formData.name}
          onChange={handleInputChange}
          placeholder='Full Name'
          className='w-full border bg-white rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500'
        />

        <input
          type='email'
          name='email'
          value={formData.email}
          onChange={handleInputChange}
          placeholder='Email Address'
          className='w-full border bg-white rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500'
        />

        <div className='w-full'>
          <label className='block text-sm text-gray-600 mb-1'>
            Phone Number
          </label>
          <PhoneInput
            country={"qa"}
            placeholder='12345678'
            value={formData.phone}
            onChange={handlePhoneChange}
            containerClass='w-full border rounded-lg px-3 py-2 bg-white flex items-center'
            inputClass='!w-full border-none focus:ring-0 outline-none'
            buttonClass='!bg-transparent !border-none'
          />
        </div>

        {/* Address Information - Cascading Dropdowns */}
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm text-gray-600 mb-1'>Area</label>
            <div className='relative'>
              <select
                name='area'
                value={formData.area}
                onChange={handleInputChange}
                disabled={loading.areas}
                className='w-full border bg-white rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100'>
                <option value=''>Select Area</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
              {loading.areas && (
                <div className='absolute right-2 top-1/2 transform -translate-y-1/2'>
                  <Spinner size='sm' className='bg-orange-600' />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className='block text-sm text-gray-600 mb-1'>District</label>
            <div className='relative'>
              <select
                name='districtId'
                value={formData.districtId}
                onChange={handleInputChange}
                disabled={!formData.area || loading.districts}
                className='w-full border bg-white rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100'>
                <option value=''>Select District</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
              {loading.districts && (
                <div className='absolute right-2 top-1/2 transform -translate-y-1/2'>
                  <Spinner size='sm' className='bg-orange-600' />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm text-gray-600 mb-1'>Property</label>
            <div className='relative'>
              <select
                name='propertyId'
                value={formData.propertyId}
                onChange={handleInputChange}
                disabled={!formData.districtId || loading.properties}
                className='w-full bg-white border rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100'>
                <option value=''>Select Property</option>
                {properties.map((property) => (
                  <option key={property.id} value={property.id}>
                    {property.name}
                  </option>
                ))}
              </select>
              {loading.properties && (
                <div className='absolute right-2 top-1/2 transform -translate-y-1/2'>
                  <Spinner size='sm' className='bg-orange-600' />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className='block text-sm text-gray-600 mb-1'>
              Residence Type
            </label>
            <div className='relative'>
              <select
                name='residenceType'
                value={formData.residenceType}
                onChange={handleInputChange}
                disabled={loading.residence}
                className='w-full border bg-white rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-100'>
                <option value=''>Select Type</option>
                {residences.length > 0 ? (
                  residences.map((residence) => (
                    <option key={residence.id} value={residence.id}>
                      {residence.type}
                    </option>
                  ))
                ) : (
                  <>
                    <option value='apartment'>Apartment</option>
                    <option value='villa'>Villa</option>
                    <option value='house'>House</option>
                    <option value='other'>Other</option>
                  </>
                )}
              </select>
              {loading.residence && (
                <div className='absolute right-2 top-1/2 transform -translate-y-1/2'>
                  <Spinner size='sm' className='bg-orange-600' />
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className='block text-sm text-gray-600 mb-1'>
            Apartment/Unit Number
          </label>
          <input
            type='text'
            name='apartmentNumber'
            value={formData.apartmentNumber}
            onChange={handleInputChange}
            placeholder='e.g. 123, Villa 45'
            className='w-full border bg-white rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-orange-500'
          />
        </div>

        {/* WhatsApp Number */}
        <div className='w-full'>
          <div className='flex items-center mb-1'>
            <input
              type='checkbox'
              id='usePhoneForWhatsapp'
              checked={formData.usePhoneForWhatsapp}
              onChange={toggleUsePhoneForWhatsapp}
              className='mr-2'
            />
            <label
              htmlFor='usePhoneForWhatsapp'
              className='text-sm text-gray-600'>
              Use same number for WhatsApp
            </label>
          </div>

          {!formData.usePhoneForWhatsapp && (
            <PhoneInput
              country={"qa"}
              placeholder='WhatsApp Number'
              value={formData.whatsappNumber}
              onChange={handleWhatsappChange}
              containerClass='w-full border rounded-lg px-3 py-2 bg-white flex items-center'
              inputClass='!w-full border-none focus:ring-0 outline-none'
              buttonClass='!bg-transparent !border-none'
            />
          )}
        </div>
      </div>

      <Button
        className='w-full max-w-lg mt-4 new-booking-color hover:bg-orange-600 text-white'
        onClick={handleSignup}
        disabled={loading.submit}>
        {loading.submit ? (
          <Spinner size='sm' className='mx-auto' />
        ) : (
          "Create Account"
        )}
      </Button>

      <p className='mt-4 text-sm text-gray-600 pb-4'>
        Already have an account?{" "}
        <button
          className='text-uhs-secondary font-medium hover:underline'
          onClick={() => router.push("/login")}>
          Login
        </button>
      </p>
    </>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import AlertMessage from "../layout/AlertMessage";
import { Spinner } from "./spinner";
import { toast } from "sonner";

export default function LoginForm1() {
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const [flashAlert, setFlashAlert] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    // Simulate API call to send OTP
    if (phone.length === 0) {
      toast.error("Enter valid phone number");
    } else {
      try {
        setLoading(true);
        const response = await axios.post("/api/auth/login", {
          phone: `+${phone}`,
        });

        if (response.data.success) {
          router.push(`/otp?phone=${phone}`);
        } else if (!response.data.success) {
          router.push("/signup");
        } else {
          setFlashAlert({
            type: "error",
            message: response.data.message.message,
          });
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        setFlashAlert({
          type: "error",
          message: `An unexpected error occurred. Please try again: ${error}`,
        });
      } finally {
        setLoading(false);
      }
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
        Login with mobile number
      </p>
      <p className='text-md text-gray-500 text-center'>
        Please confirm your country code and enter your mobile number
      </p>

      <PhoneInput
        country={"qa"}
        placeholder='12345678'
        value={phone}
        onChange={(value) => setPhone(value)}
        containerClass='w-full max-w-lg border rounded-lg px-3 py-2 mt-6 bg-white flex items-center'
        inputClass='!w-full border-none focus:ring-0 outline-none'
        buttonClass='!bg-transparent !border-none'
      />

      {!loading ? (
        <Button
          className='w-full max-w-lg mt-4 new-booking-color hover:bg-orange-600 text-white'
          onClick={handleSendOTP}>
          Send OTP
        </Button>
      ) : (
        <Spinner size='sm' className='bg-orange-600' />
      )}

      <p className='mt-4 text-sm text-gray-600'>
        Don't have an account?{" "}
        <button
          className='text-uhs-secondary font-medium hover:underline'
          onClick={() => router.push("/signup")}>
          Signup
        </button>
      </p>
    </>
  );
}

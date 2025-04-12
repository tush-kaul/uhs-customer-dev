"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";

import { Input } from "./ui/input";
import { Spinner } from "./ui/spinner";
import { toast } from "sonner";
import { OTPInput } from "./OTPInput";
import { useUserData } from "@/hooks/user-provider";

const OtpField = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone") || "";
  const src = searchParams.get("rc");

  const [loading, setLoading] = useState(false);
  const { userData } = useUserData();
  const handleVerifyOTP = async () => {
    if (otp.includes("")) {
      toast.error("Invalid otp");
    } else {
      const enteredOTP = otp.join("");
      setLoading(true);
      try {
        const response =
          src === "_nus"
            ? await axios.post("/api/auth/verify-signup-otp", {
                phone: `+${phone}`,
                otp: enteredOTP,
              })
            : await axios.post("/api/auth/verify-login-otp", {
                phone: `+${phone}`,
                otp: enteredOTP,
              });
        if (response.data.data) {
          if (response.data.data.token) {
            router.push(`/?token=${response.data.data.token}`);
          } else {
            router.push("/");
          }
        } else {
          toast.error(response.data.message.message);
        }
      } catch (error: any) {
        toast.error("Invalid OTP! Please try again");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className='flex-relative top-0'></div>
      <div className='flex gap-1'>
        <OTPInput otp={otp} setOtp={setOtp} />
      </div>

      {!loading ? (
        <Button
          className='w-full max-w-sm mt-4 new-booking-color hover:bg-orange-600 text-white'
          onClick={handleVerifyOTP}>
          Verify
        </Button>
      ) : (
        <Spinner size='sm' className='bg-orange-600' />
      )}
    </>
  );
};
export default OtpField;

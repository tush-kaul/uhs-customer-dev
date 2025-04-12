"use client";
import OtpField from "@/components/OtpField";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserData } from "@/hooks/user-provider";

export default function OTPPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get("phone");
  const phoneNumber = typeof phone === "string" ? phone : "";
  const src = searchParams.get("rc");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [flashAlert, setFlashAlert] = useState({ type: "", message: "" });
  const { userData } = useUserData();

  useEffect(() => {
    // Start the initial countdown when component mounts
    let interval: NodeJS.Timeout | null = null;

    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setCanResend(true);
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleSendOTP = async () => {
    // Simulate API call to send OTP
    if (!phoneNumber || phoneNumber.length === 0) {
      toast.error("Enter valid phone number");
    } else {
      try {
        setLoading(true);
        const response =
          src === "_nus"
            ? await axios.post("/api/auth/signup", userData)
            : await axios.post("/api/auth/login", {
                phone: `+${phoneNumber}`,
              });

        if (response.data.success) {
          router.push(`/otp?phone=${phoneNumber}`);
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

  const handleResendOTP = () => {
    if (canResend) {
      // Reset the timer and disable resend button
      setTimer(60);
      setCanResend(false);

      // Call the OTP send function
      handleSendOTP();
    }
  };

  return (
    <>
      <p className='mt-2 text-2xl font-semibold text-gray-800'>Enter OTP</p>
      <p className='text-md text-gray-500 text-center'>
        We have sent a OTP to your mobile number
      </p>

      <OtpField />

      <button
        onClick={handleResendOTP}
        disabled={!canResend || loading}
        className={`mt-4 text-sm font-sm ${
          canResend ? "hover:underline" : "opacity-70"
        }`}>
        {"Didn't receive code?"}{" "}
        <span className='text-uhs-secondary'>
          {canResend ? "Resend OTP" : `Resend OTP in ${timer}s`}
        </span>
      </button>
    </>
  );
}

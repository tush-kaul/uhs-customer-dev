import React, {
  useRef,
  useEffect,
  RefObject,
  ChangeEvent,
  KeyboardEvent,
  ClipboardEvent,
  Ref,
} from "react";
import { Input } from "@/components/ui/input";
import { useUserData } from "@/hooks/user-provider";

interface OTPInputProps {
  otp: string[];
  setOtp: React.Dispatch<React.SetStateAction<string[]>>;
  length?: number;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  otp,
  setOtp,
  length = 6,
}) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const { userData } = useUserData();
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, otp.length);
  }, [otp.length]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ): void => {
    const value = e.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);

    // If a digit was entered and there's a next input, focus on it
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    index: number
  ): void => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Clear the current position and move to previous
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Navigate left and right with arrow keys
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>): void => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");

    // Check if pasted data contains only numbers
    if (!/^\d*$/.test(pastedData)) return;

    // Fill the OTP array with pasted digits
    const newOtp = [...otp];
    for (let i = 0; i < Math.min(pastedData.length, otp.length); i++) {
      newOtp[i] = pastedData[i];
    }

    setOtp(newOtp);

    // Focus on the next empty input or the last one
    let lastFilledIndex = newOtp.findIndex((digit) => !digit);
    if (lastFilledIndex === -1) lastFilledIndex = otp.length - 1;

    if (inputRefs.current[lastFilledIndex]) {
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  return (
    <div className='flex justify-center items-center mt-6'>
      {otp.map((digit, index) => (
        <div key={index} className='relative mx-2'>
          <Input
            ref={(el: any) => (inputRefs.current[index] = el)}
            type='text'
            inputMode='numeric'
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className='w-12 h-12 text-center text-xl font-bold rounded-md border-0 bg-white focus:ring-0 focus:outline-none'
            style={{
              borderBottom: "2px solid #e5e7eb", // Default border
            }}
            autoFocus={index === 0}
          />
          <div
            className={`absolute bottom-0 left-0 w-full h-0.5 transition-all duration-300 ${
              digit ? "bg-orange-500" : "bg-gray-300"
            }`}
            style={{
              transform: digit ? "scaleX(1)" : "scaleX(0.7)",
              height: digit ? "2px" : "1px",
            }}
          />
          {index < otp.length - 1 && (
            <span className='absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-400'>
              -
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

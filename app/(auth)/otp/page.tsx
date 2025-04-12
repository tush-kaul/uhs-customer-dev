"use client";
import OTPPageContent from "@/components/OTPPageContent";
import { Suspense } from "react";

export default function OTPPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <OTPPageContent />
    </Suspense>
  );
}

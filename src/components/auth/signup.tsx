/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import api from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import OtpForm from "./otp-form";
import SignupForm from "./signup-form";
import Success from "./success";
import { focusToNextInput } from "@/utils/utils";

export default function Signup() {
  const [stage, setStage] = useState<"form" | "otp" | "success">("otp");

  const [otp, setOtp] = useState("");

  const handleOTPChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    let val = e.target.value.trim();
    const isDigit = /^\d$/.test(val);

    if (!isDigit && val !== "") return;

    val = isDigit ? val : " ";

    if (val.length === 1) {
      const newValue = otp.substring(0, idx) + val + otp.substring(idx + 1);

      setOtp(newValue);

      if (!isDigit) return;

      focusToNextInput(e.target);
    } else if (val.length === 6) {
      setOtp(val);

      e.target.blur();
    }
  };

  const {
    mutate: handleVerifyToken,
    isPending: otpLoading,
    isError: isOtpError,
    error: otpError,
  } = useMutation({
    mutationKey: ["otp-verification"],
    mutationFn: async () => await api.post("/auth/verify-otp", { otp }),
    onSuccess: (res) => {
      console.log("response", res);
      toast.success(res.data.message || "OTP verification successful.");
      setStage("success");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.userMessage ||
          error?.message ||
          "Signup failed. Please try again later."
      );
    },
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { mutate: handleSignUp, isPending: signupLoading } = useMutation({
    mutationKey: ["signup"],
    mutationFn: async () => await api.post("/auth/register", formData),
    onSuccess: (res) => {
      console.log("response", res);
      toast.success(
        res.data.message ||
          "Signup successful! Please check your email for the OTP."
      );
      setStage("otp");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.userMessage ||
          error?.message ||
          "Signup failed. Please try again later."
      );
    },
  });

  if (stage === "form")
    return (
      <SignupForm
        loading={signupLoading}
        formData={formData}
        handleChange={handleChange}
        handleSignup={handleSignUp}
      />
    );

  if (stage === "otp")
    return (
      <OtpForm
        title="Verify OTP"
        description={`We sent a code to ${formData.email}. Enter code to verify your email address`}
        action={{
          handleVerifyToken,
          loading: otpLoading,
          isError: isOtpError,
          error: otpError,
        }}
        handleChange={handleOTPChange}
        value={otp}
      />
    );

  return <Success />;
}

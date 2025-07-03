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
import { RE_DIGIT } from "@/utils/constants";

export default function Signup() {
  const [stage, setStage] = useState<"form" | "otp" | "success">("form");

  const [otp, setOtp] = useState("");

  const handleOTPChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const target = e.target;
    let targetValue = target.value.trim();
    const isTargetValueDigit = RE_DIGIT.test(targetValue);

    if (!isTargetValueDigit && targetValue !== "") return;

    const nextInputEl = target.nextElementSibling as HTMLInputElement | null;

    // only delete digit if next input element has no value
    if (!isTargetValueDigit && nextInputEl && nextInputEl.value !== "") return;

    targetValue = isTargetValueDigit ? targetValue : " ";

    const targetValueLength = targetValue.length;

    if (targetValueLength === 1) {
      const newValue =
        otp.substring(0, idx) + targetValue + otp.substring(idx + 1);

      setOtp(newValue);

      if (!isTargetValueDigit) return;

      focusToNextInput(target);
    } else if (targetValueLength === 6) {
      setOtp(targetValue);

      target.blur();
    }
  };

  const {
    mutate: handleVerifyToken,
    isPending: otpLoading,
    isError: isOtpError,
    error: otpError,
  } = useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: async () =>
      await api.post("/auth/verify-email", {
        otp,
        email: formData.email,
      }),
    onSuccess: (res) => {
      toast.success(res.data.message || "OTP verification successful.");
      setStage("success");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.userMessage ||
          error?.message ||
          "otp request failed. Please try again later."
      );
    },
  });

  const { mutate: handleResendOtp, isPending: isResendLoading } = useMutation({
    mutationKey: ["resend-otp"],
    mutationFn: async () =>
      await api.post("/auth/resend-otp", { email: formData.email }),
    onSuccess: (res) => {
      toast.success(
        res.data.message || "OTP sent successfully. Please check your email."
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.userMessage ||
          error?.message ||
          "otp request failed. Please try again later."
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
        handleResend={handleResendOtp}
        isResendLoading={isResendLoading}
      />
    );

  return (
    <Success
      title="Successfully verified"
      description="Your email has been verified successfully"
    />
  );
}

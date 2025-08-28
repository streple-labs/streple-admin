/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  forgotPassword,
  resendOtp,
  resetPassword,
  verifyOtp,
} from "@/utils/action";
import { focusToNextInput } from "@/utils/utils";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import ForgotPasswordForm from "./forgot-password-form";
import OtpForm from "./otp-form";
import ResetPasswordForm from "./reset-password-form";
import Success from "./success";

export default function ForgotPassword() {
  const [stage, setStage] = useState<
    "form" | "otp" | "reset-password" | "success"
  >("form");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { mutate: handleForgotPassword, isPending: forgotPasswordLoading } =
    useMutation({
      mutationKey: ["email-verification"],
      mutationFn: async () => await forgotPassword(formData.email),
      onSuccess: (res) => {
        if (res.success) {
          toast.success(res.message || "OTP sent to your email.");
          setStage("otp");
        } else toast.error(res.message);
      },
      onError: (error: any) => {
        console.error(error);
        toast.error("An unexpected error occurred. Please try again.");
      },
    });

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
    mutationKey: ["verify-otp"],
    mutationFn: async () =>
      await verifyOtp(
        {
          otp,
          email: formData.email,
        },
        "reset"
      ),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "OTP verification successful.");
        setStage("reset-password");
      } else toast.error(res.message);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
    },
  });

  const { mutate: handleResetPassword, isPending: resetPasswordLoading } =
    useMutation({
      mutationKey: ["reset-password"],
      mutationFn: async () =>
        await resetPassword({
          password: formData.password,
          email: formData.email,
        }),
      onSuccess: (res) => {
        if (res.success) {
          toast.success(res.message || "password reset successful.");
          setStage("success");
        } else toast.error(res.message);
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message ||
            error?.userMessage ||
            error?.message ||
            "password reset failed. Please try again later."
        );
      },
    });

  const { mutate: handleResendOtp, isPending: isResendLoading } = useMutation({
    mutationKey: ["resend-otp"],
    mutationFn: async () =>
      await resendOtp({ email: formData.email, purpose: "reset" }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "OTP sent successfully.");
      } else toast.error(res.message);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
    },
  });

  if (stage === "form")
    return (
      <ForgotPasswordForm
        loading={forgotPasswordLoading}
        email={formData.email}
        handleChange={handleEmailChange}
        handleForgotPassword={handleForgotPassword}
      />
    );

  if (stage === "otp")
    return (
      <OtpForm
        title="Forgot password"
        description={`Enter the code sent to ${formData.email} to reset your password`}
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

  if (stage === "reset-password")
    return (
      <ResetPasswordForm
        loading={resetPasswordLoading}
        formData={formData}
        handleChange={handleEmailChange}
        handleResetPassword={handleResetPassword}
      />
    );

  return (
    <Success
      title="Successful"
      description="Your password has been reset successfully"
    />
  );
}

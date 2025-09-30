/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/context/auth-context";
import { login, resendOtp, verifyOtp } from "@/utils/action";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import LoginForm from "./login-form";
import TwoFactorAuth from "./two-factor-auth-form";
import { RE_DIGIT } from "@/utils/constants";
import { focusToNextInput } from "@/utils/utils";
import OtpForm from "./otp-form";

export default function Login() {
  const [stage, setStage] = useState<"login" | "2fa">("login");

  const [tokens, setTokens] = useState<{
    accessToken: string;
    refreshToken: string;
  }>({ accessToken: "", refreshToken: "" });

  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { mutate: handleLogin, isPending: isLoggingIn } = useMutation({
    mutationKey: ["login"],
    mutationFn: async () => await login(formData),
    onSuccess: async (res) => {
      if (res.success) {
        setStage("2fa");
        toast.success(res.message);
        setTokens({
          accessToken: res.streple_auth_token,
          refreshToken: res.streple_refresh_token,
        });
        setUser(res.user_data);
      } else {
        if (res.status === 403 && res.message === "Email not verified") {
          handleResendOtp();
          setShowOtpForm(true);
        }
        toast.error(res.message);
      }
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
    },
  });

  const [otp, setOtp] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);

  const handleOTPChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const target = e.target;
    let targetValue = target.value.trim();
    const isTargetValueDigit = RE_DIGIT.test(targetValue);

    if (!isTargetValueDigit && targetValue !== "") return;

    const nextInputEl = target.nextElementSibling as HTMLInputElement | null;

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
      await verifyOtp(
        {
          otp,
          email: formData.email.trim().toLowerCase(),
        },
        "verify"
      ),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message || "OTP verification successful.");
        setShowOtpForm(false);
        handleLogin();
      } else toast.error(res.message);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
    },
  });

  const { mutate: handleResendOtp, isPending: isResendLoading } = useMutation({
    mutationKey: ["resend-otp"],
    mutationFn: async () =>
      await resendOtp({
        email: formData.email.trim().toLowerCase(),
        purpose: "verify",
      }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(
          res.message || "OTP sent successfully. Please check your email."
        );
      } else toast.error(res.message);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
    },
  });

  if (showOtpForm)
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

  if (stage === "2fa")
    return <TwoFactorAuth tokens={tokens} email={formData.email} />;

  return (
    <LoginForm
      handleLogin={handleLogin}
      loading={isLoggingIn}
      formData={formData}
      handleChange={handleChange}
    />
  );
}

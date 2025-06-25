/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import api from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import OtpForm from "./otp-form";
import SignupForm from "./signup-form";
import Success from "./success";

export default function Signup() {
  const [stage, setStage] = useState<"form" | "otp" | "success">("otp");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { mutate: handleSignUp, isPending: signupLoading } = useMutation({
    mutationKey: ["signup"],
    mutationFn: async (data: typeof formData) =>
      await api.post("/auth/register", data),
    onSuccess: (res) => {
      console.log("response", res);
      toast.success("Signup successful! Please check your email for the OTP.");
      setStage("otp");
    },
    onError: (error: any) => {
      console.error("Signup failed:", error);
      toast.error(
        error?.userMessage ||
          error?.message ||
          error?.response?.data?.message ||
          "Signup failed. Please try again later."
      );
    },
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSignUp(formData);
  };

  if (stage === "form")
    return (
      <SignupForm
        loading={signupLoading}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleFormSubmit}
      />
    );

  if (stage === "otp")
    return <OtpForm setStage={setStage} email={formData.email} />;

  return <Success />;
}

"use client";

import { useState } from "react";
import SignupForm from "./signup-form";
import OtpForm from "./otp-form";
import Success from "./success";

export default function Signup() {
  const [stage, setStage] = useState<"form" | "otp" | "success">("form");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
    setStage("otp");
  };

  if (stage === "form")
    return (
      <SignupForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleFormSubmit}
      />
    );

  if (stage === "otp")
    return <OtpForm setStage={setStage} email={formData.email} />;

  return <Success />;
}

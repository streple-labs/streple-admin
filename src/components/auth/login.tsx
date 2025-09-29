/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/context/auth-context";
import { login } from "@/utils/action";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import LoginForm from "./login-form";
import TwoFactorAuth from "./two-factor-auth-form";

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
      } else toast.error(res.message);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
    },
  });

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

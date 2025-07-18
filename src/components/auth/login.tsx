/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { anton } from "@/app/fonts";
import api from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { toast } from "sonner";
import Loader from "../loader";

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const { mutate: handleLogin, isPending: loading } = useMutation({
    mutationKey: ["login"],
    mutationFn: async () => await api.post("/auth/login/admin", formData),
    onSuccess: (res) => {
      setCookie("streple_auth_token", res.data.streple_auth_token);
      router.push("/");
      toast.success(res.data.message || "login successful.");
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

  return (
    <form
      className="size-full flex items-center justify-center flex-col gap-[40px] md:gap-[60px]"
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >
      <div className="space-y-8 w-full">
        <h4
          className={`tracking-[2px] leading-[150%] font-normal text-2xl md:text-3xl lg:text-4xl ${anton.className} w-full text-center`}
        >
          Welcome back
        </h4>
        <div className="w-full flex flex-col gap-4 md:gap-6">
          <label className="space-y-1.5 md:space-y-3">
            <p className="font-normal text-sm md:text-base leading-6 tracking-[1px]">
              Email address
            </p>
            <input
              value={formData.email}
              name="email"
              onChange={handleChange}
              required
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              title="Please enter a valid email address"
              type="text"
              placeholder="e.g johndoe@gmail.com"
              className={`h-[60px] md:h-[82px] w-full text-base py-5 px-3 md:px-6 rounded-[10px] md:rounded-[20px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 outline-0 ring-0 caret-[#B39FF0] ${
                formData.email
                  ? "text-[#FFFFFF99] bg-[#F4E90E1A] border border-[#F4E90EB2] focus:bg-[#242324] focus:text-white focus:border-0"
                  : "bg-[#242324] text-white"
              }`}
            />
          </label>
          <label className="space-y-1.5 md:space-y-3">
            <p className="font-normal text-sm md:text-base leading-6 tracking-[1px]">
              Password
            </p>
            <div className="flex flex-col gap-2 w-full">
              <span className="relative">
                <input
                  // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!.%*?&])[A-Za-z\d@$!.%*?&]{8,}$"
                  title="Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
                  value={formData.password}
                  name="password"
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Minimum of 8 characters"
                  className={`h-[60px] md:h-[82px] w-full text-base py-5 px-3 md:px-6 rounded-[10px] md:rounded-[20px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 outline-0 ring-0 caret-[#B39FF0] ${
                    formData.password
                      ? "text-[#FFFFFF99] bg-[#F4E90E1A] border border-[#F4E90EB2] focus:bg-[#242324] focus:text-white focus:border-0"
                      : "bg-[#242324] text-white"
                  }`}
                />
                <span
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <IoEyeOffOutline size={16} color="#FFFFFFB2" />
                  ) : (
                    <IoEyeOutline size={16} color="#FFFFFFB2" />
                  )}
                </span>
              </span>
              <Link
                href={"/forgot-password"}
                className="w-full text-end text-sm leading-6 tracking-[1px] font-black"
              >
                Forgot password?
              </Link>
            </div>
          </label>
        </div>
      </div>
      <div className="flex items-center justify-center flex-col gap-6 w-full">
        <button
          disabled={loading}
          className="w-full py-3 px-4 rounded-[10px] md:rounded-[20px] h-[61px] md:h-[84px] bg-[#B39FF0] hover:bg-[#B39FF0]/90 text-[#2C2C26] text-base md:text-xl font-bold leading-[150%] tracking-[2px] flex items-center justify-center"
          title="login"
          type="submit"
        >
          {loading ? <Loader /> : "Continue"}
        </button>
      </div>
    </form>
  );
}

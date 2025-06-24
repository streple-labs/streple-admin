import { anton } from "@/app/fonts";
import { useState } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import GoogleIcon from "../../../public/google-icon";

export default function SignupForm({
  formData,
  handleChange,
  handleSubmit,
}: {
  formData: {
    name: string;
    email: string;
    password: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="size-full space-y-[60px] md:mb-[120px]"
      onSubmit={handleSubmit}
    >
      <div className="space-y-8 w-full">
        <h4
          className={`tracking-[2px] leading-[150%] font-normal text-[27px] sm:text-2xl md:text-3xl lg:text-4xl ${anton.className} w-full text-center`}
        >
          Sign up to get started
        </h4>
        <div className="w-full flex flex-col gap-6">
          <div className="h-[82px] w-full text-base px-6 py-5 rounded-[20px] gap-4 bg-[#242324] flex items-center justify-center">
            <GoogleIcon />
            <p className="text-[21px] leading-8 tracking-[1px] font-normal">
              Continue with Google
            </p>
          </div>

          <span className="text-base font-normal leading-6 tracking-[1px] flex items-center w-full gap-4">
            <span className="h-[1px] bg-[#FFFFFF33] rounded-full w-full" />
            Or
            <span className="h-[1px] bg-[#FFFFFF33] rounded-full w-full" />
          </span>

          <label className="space-y-1.5 md:space-y-3">
            <p className="text-white font-normal text-sm md:text-base leading-6 tracking-[1px]">
              Full name
            </p>
            <input
              value={formData.name}
              name="name"
              onChange={handleChange}
              required
              title="Please enter your full name"
              type="text"
              placeholder="e.g John Doe"
              className={`h-[82px] w-full text-base px-6 py-5 rounded-[20px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 placeholder:text-xs sm:placeholder:text-base outline-0 ring-0 ${
                formData.name
                  ? "text-[#FFFFFF99] bg-[#F4E90E1A] border border-[#F4E90EB2] focus:bg-[#242324] focus:text-white focus:border-0"
                  : "bg-[#242324] text-white"
              }`}
            />
          </label>
          <label className="space-y-1.5 md:space-y-3">
            <p className="text-white font-normal text-sm md:text-base leading-6 tracking-[1px]">
              Email address
            </p>
            <input
              value={formData.email}
              name="email"
              onChange={handleChange}
              required
              pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
              title="Please enter a valid email address"
              type="text"
              placeholder="e.g johndoe@gmail.com"
              className={`h-[82px] w-full text-base px-6 py-5 rounded-[20px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 placeholder:text-xs sm:placeholder:text-base outline-0 ring-0 ${
                formData.email
                  ? "text-[#FFFFFF99] bg-[#F4E90E1A] border border-[#F4E90EB2] focus:bg-[#242324] focus:text-white focus:border-0"
                  : "bg-[#242324] text-white"
              }`}
            />
          </label>
          <label className="space-y-1.5 md:space-y-3">
            <p className="text-white font-normal text-sm md:text-base leading-6 tracking-[1px]">
              Password
            </p>
            <span className="relative">
              <input
                pattern=".{8,}"
                title="Password must be at least 8 characters long"
                value={formData.password}
                name="password"
                onChange={handleChange}
                type="password"
                placeholder="Minimum of 8 characters"
                className={`h-[82px] w-full text-base px-6 py-5 rounded-[20px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 placeholder:text-xs sm:placeholder:text-base outline-0 ring-0 ${
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
          </label>
        </div>
      </div>
      <button
        className="w-full py-3 px-4 rounded-[20px] h-[84px] bg-[#B39FF0] hover:bg-[#B39FF0]/90 text-[#2C2C26] text-base md:text-xl font-bold leading-[150%] tracking-[2px]"
        title="sign up"
        type="submit"
      >
        Continue
      </button>
    </form>
  );
}

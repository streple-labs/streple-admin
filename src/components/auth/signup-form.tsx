import { anton } from "@/app/fonts";
import { base_url } from "@/utils/constants";
import { passwordValidation } from "@/utils/utils";
import Link from "next/link";
import { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import GoogleIcon from "../../../public/google-icon";
import Loader from "../loader";

export default function SignupForm({
  loading,
  formData,
  handleChange,
  handleSignup,
}: // handleGoogleLogin,
// isGoogleLoginLoading,
{
  formData: {
    fullName: string;
    email: string;
    password: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSignup: () => void;
  loading: boolean;
  // handleGoogleLogin: () => void;
  // isGoogleLoginLoading: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      className="size-full flex items-center justify-center flex-col gap-[40px] md:gap-[60px]"
      onSubmit={(e) => {
        e.preventDefault();
        handleSignup();
      }}
    >
      <div className="space-y-8 w-full">
        <h4
          className={`tracking-[2px] leading-[150%] font-normal text-2xl md:text-3xl lg:text-4xl ${anton.className} w-full text-center`}
        >
          Sign up to get started
        </h4>
        <div className="w-full flex flex-col gap-4 md:gap-6">
          <div
            className="h-[55px] md:h-[82px] cursor-pointer w-full text-base px-6 py-5 rounded-[10px] md:rounded-[20px] gap-4 bg-[#242324] flex items-center justify-center"
            onClick={() => (window.location.href = `${base_url}/auth/google`)}
          >
            <GoogleIcon className="size-5 md:size-6" />
            <p className="text-base md:text-[21px] leading-6 md:leading-8 tracking-[1px] font-normal">
              Continue with Google
            </p>
          </div>

          <span className="text-xs md:text-base font-normal leading-4 md:leading-6 tracking-[1px] flex items-center w-full gap-4">
            <span className="h-[1px] bg-[#FFFFFF33] rounded-full w-full" />
            Or
            <span className="h-[1px] bg-[#FFFFFF33] rounded-full w-full" />
          </span>

          <label className="space-y-1.5 md:space-y-3">
            <p className="font-normal text-sm md:text-base leading-6 tracking-[1px]">
              Full name
            </p>
            <input
              readOnly={loading}
              value={formData.fullName}
              name="fullName"
              onChange={handleChange}
              required
              title="Please enter your full name"
              type="text"
              placeholder="e.g John Doe"
              className={`h-[60px] md:h-[82px] w-full py-5 px-3 md:px-6 rounded-[10px] md:rounded-[20px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 text-base outline-0 ring-0 caret-[#B39FF0] ${
                formData.fullName
                  ? "text-[#FFFFFF99] bg-[#F4E90E1A] border border-[#F4E90EB2] focus:bg-[#242324] focus:text-white focus:border-0"
                  : "bg-[#242324] text-white"
              }`}
            />
          </label>
          <label className="space-y-1.5 md:space-y-3">
            <p className="font-normal text-sm md:text-base leading-6 tracking-[1px]">
              Email address
            </p>
            <input
              readOnly={loading}
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
            <div className="relative space-y-2">
              <span className="relative">
                <input
                  readOnly={loading}
                  pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!.%*?&])[A-Za-z\d@$!.%*?&]{8,}$"
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
              {formData.password && (
                <>
                  <div className="flex gap-1 mt-2">
                    {Array.from({
                      length: passwordValidation(formData.password)
                        .passedChecks,
                    }).map((_, i) => (
                      <span
                        key={i}
                        className="h-0.5 w-[70px] rounded-full bg-[#B39FF0]"
                      />
                    ))}
                  </div>

                  <p className="text-white/40 leading-4 text-sm tracking-[1px]">
                    {passwordValidation(formData.password).message}
                  </p>
                </>
              )}
            </div>
          </label>
        </div>
      </div>
      <div className="flex items-center justify-center flex-col gap-6 w-full">
        <button
          disabled={loading}
          className="w-full py-3 px-4 rounded-[10px] md:rounded-[20px] h-[61px] md:h-[84px] bg-[#B39FF0] hover:bg-[#B39FF0]/90 text-[#2C2C26] text-base md:text-xl font-bold leading-[150%] tracking-[2px] flex items-center justify-center"
          title="sign up"
          type="submit"
        >
          {loading ? <Loader /> : "Continue"}
        </button>
        <p className="text-sm leading-[25px] tracking-[1px]">
          Already have an account?{" "}
          <Link
            href={"/login"}
            className="text-[#B39FF0] cursor-pointer font-bold"
          >
            Login
          </Link>
        </p>
      </div>
    </form>
  );
}

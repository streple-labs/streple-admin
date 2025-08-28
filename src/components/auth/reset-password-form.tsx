import { anton } from "@/app/fonts";
import { passwordValidation } from "@/utils/utils";
import React, { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import Loader from "../ui/loader";

export default function ResetPasswordForm({
  formData,
  handleChange,
  handleResetPassword,
  loading,
}: {
  formData: {
    password: string;
    confirm_password: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleResetPassword: () => void;
  loading: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form
      className="size-full flex items-center justify-center flex-col gap-[40px] md:gap-[60px]"
      onSubmit={(e) => {
        e.preventDefault();
        handleResetPassword();
      }}
    >
      <div className="space-y-8 w-full">
        <div className="flex items-center justify-center flex-col gap-5">
          <h4
            className={`tracking-[2px] leading-[150%] font-normal text-2xl md:text-3xl lg:text-4xl ${anton.className} w-full text-center`}
          >
            Reset Password
          </h4>
          <p className="text-sm md:text-base leading-6 tracking-[1px] font-normal w-full text-center">
            Create a new password
          </p>
        </div>
        <div className="w-full flex flex-col gap-4 md:gap-6">
          <label className="space-y-1.5 md:space-y-3">
            <p className="font-normal text-sm md:text-base leading-6 tracking-[1px]">
              New Password
            </p>
            <div className="relative space-y-2">
              <span className="relative">
                <input
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
          <label className="space-y-1.5 md:space-y-3">
            <p className="font-normal text-sm md:text-base leading-6 tracking-[1px]">
              Confirm Password
            </p>
            <div className="relative space-y-2">
              <span className="relative">
                <input
                  title="Password must equal the new password"
                  pattern={formData.password}
                  value={formData.confirm_password}
                  name="confirm_password"
                  onChange={handleChange}
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="Minimum of 8 characters"
                  className={`h-[60px] md:h-[82px] w-full text-base py-5 px-3 md:px-6 rounded-[10px] md:rounded-[20px] gap-4 leading-6 tracking-[1px] placeholder:text-white/50 outline-0 ring-0 caret-[#B39FF0] ${
                    formData.confirm_password
                      ? "text-[#FFFFFF99] bg-[#F4E90E1A] border border-[#F4E90EB2] focus:bg-[#242324] focus:text-white focus:border-0"
                      : "bg-[#242324] text-white"
                  }`}
                />
                <span
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? (
                    <IoEyeOffOutline size={16} color="#FFFFFFB2" />
                  ) : (
                    <IoEyeOutline size={16} color="#FFFFFFB2" />
                  )}
                </span>
              </span>
              {formData.confirm_password && (
                <p
                  className={`${
                    formData.password === formData.confirm_password
                      ? "text-white/40"
                      : "text-red-500"
                  } leading-4 text-sm tracking-[1px] mt-2`}
                >
                  {formData.password === formData.confirm_password
                    ? "All requirements met"
                    : "password must match the new password"}
                </p>
              )}
            </div>
          </label>
        </div>
      </div>
      <button
        disabled={
          loading ||
          !formData.password ||
          !formData.confirm_password ||
          formData.password !== formData.confirm_password
        }
        className="w-full py-3 px-4 rounded-[10px] md:rounded-[20px] h-[61px] md:h-[84px] bg-[#B39FF0] hover:bg-[#B39FF0]/90 text-[#2C2C26] text-base md:text-xl font-bold leading-[150%] tracking-[2px] flex items-center justify-center"
        title="reset password"
        type="submit"
      >
        {loading ? <Loader /> : "Continue"}
      </button>
    </form>
  );
}

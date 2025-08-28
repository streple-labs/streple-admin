/* eslint-disable @typescript-eslint/no-explicit-any */
import { anton } from "@/app/fonts";
import { focusToNextInput, focusToPrevInput } from "@/utils/utils";
import { useEffect, useMemo, useState } from "react";
import Loader from "../ui/loader";
import { RE_DIGIT } from "@/utils/constants";

export default function OtpForm({
  title,
  description,
  handleChange,
  value,
  action: { handleVerifyToken, loading, isError, error },
  handleResend,
  isResendLoading,
}: {
  title: string;
  description: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>, idx: number) => void;
  action: {
    handleVerifyToken: () => void;
    loading: boolean;
    isError: boolean;
    error: any;
  };
  value: string;
  handleResend: () => void;
  isResendLoading: boolean;
}) {
  const valueItems = useMemo(() => {
    const valueArray = value.split("");
    const items: Array<string> = [];

    for (let i = 0; i < 6; i++) {
      items.push(RE_DIGIT.test(valueArray[i]) ? valueArray[i] : "");
    }

    return items;
  }, [value]);

  const [timer, setTimer] = useState(120);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <form
      className="size-full flex items-center justify-center flex-col gap-[40px] md:gap-[60px]"
      onSubmit={(e) => {
        e.preventDefault();
        handleVerifyToken();
      }}
    >
      <div className="flex items-center justify-center flex-col gap-5">
        <h4
          className={`tracking-[2px] leading-[150%] font-normal text-2xl md:text-3xl lg:text-4xl ${anton.className} w-full text-center`}
        >
          {title}
        </h4>
        <p className="text-sm md:text-base leading-6 tracking-[1px] font-normal w-full text-center">
          {description}
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 xs:gap-4">
          {valueItems.map((digit, i) => (
            <input
              key={i}
              value={digit}
              onChange={(e) => handleChange(e, i)}
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{1}"
              required
              maxLength={1}
              onKeyDown={(e) => {
                const target = e.target as HTMLInputElement;

                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault();
                  return focusToNextInput(target);
                }
                if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault();
                  return focusToPrevInput(target);
                }

                const val = target.value;

                target.setSelectionRange(0, val.length);

                if (e.key !== "Backspace" || val !== "") return;

                focusToPrevInput(target);
              }}
              onFocus={(e) => {
                const prevInputEl = e.target
                  .previousElementSibling as HTMLInputElement | null;

                if (prevInputEl && prevInputEl.value === "") {
                  return prevInputEl.focus();
                }

                e.target.setSelectionRange(0, e.target.value.length);
              }}
              className={`size-8 min-[375px]:size-12 sm:h-[65px] md:h-[82px] lg:h-[65px] xl:h-[82px] sm:w-[54px] md:w-[78px] lg:w-[54px] xl:w-[78px] caret-[#B39FF0] text-center flex items-center justify-center text-base rounded-[10px] leading-6 tracking-[1px] outline-0 ring-0 ${
                isError
                  ? "text-white border-[#FB736EB2] border bg-[#FB736E1A] focus:bg-[#242324] focus:text-white focus:border-0"
                  : digit
                  ? "text-[#FFFFFF99] bg-[#F4E90E1A] border border-[#F4E90EB2] focus:bg-[#242324] focus:text-white focus:border-0"
                  : "bg-[#242324] text-white"
              }`}
            />
          ))}
        </div>
        {isError && (
          <p className="text-xs md:text-sm text-[#FB736E] leading-5 tracking-[1px] w-full text-left">
            {error?.response?.data?.message ||
              error?.userMessage ||
              error?.message ||
              "Signup failed. Please try again later."}
          </p>
        )}
      </div>
      <div className="space-y-2 w-full">
        <button
          disabled={loading || isResendLoading}
          className="w-full py-3 px-4 rounded-[10px] md:rounded-[20px] h-[61px] md:h-[84px] bg-[#B39FF0] hover:bg-[#B39FF0]/90 text-[#2C2C26] text-base md:text-xl font-bold leading-[150%] tracking-[2px] flex items-center justify-center"
          title="Verify OTP"
          type="submit"
        >
          {loading || isResendLoading ? <Loader /> : "Continue"}
        </button>
        <p className="text-sm sm:text-base md:text-xl leading-[150%] tracking-[2px] font-semibold">
          Didn&apos;t get the code?{" "}
          {timer > 0 ? (
            <span className="text-[#B39FF0]"> Resend in {timer}s</span>
          ) : (
            <button
              type="button"
              className="text-[#B39FF0] underline disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                handleResend();
                setTimer(120);
              }}
              disabled={isResendLoading}
            >
              {isResendLoading ? "Resending..." : "Resend"}
            </button>
          )}
        </p>
      </div>
    </form>
  );
}

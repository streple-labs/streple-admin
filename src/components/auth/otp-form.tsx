import { anton } from "@/app/fonts";
import { useMemo, useState } from "react";

const focusToNextInput = (target: HTMLElement) => {
  const nextElementSibling = target.nextElementSibling as HTMLInputElement;

  if (nextElementSibling) nextElementSibling.focus();
};
const focusToPrevInput = (target: HTMLElement) => {
  const previousElementSibling =
    target.previousElementSibling as HTMLInputElement;

  if (previousElementSibling) previousElementSibling.focus();
};

export default function OtpForm({
  setStage,
  email,
}: {
  email: string;
  setStage: React.Dispatch<React.SetStateAction<"form" | "otp" | "success">>;
}) {
  const [value, setValue] = useState("");

  const valueItems = useMemo(() => {
    const valueArray = value.split("");
    const items: Array<string> = [];

    for (let i = 0; i < 6; i++) {
      items.push(/^\d$/.test(valueArray[i]) ? valueArray[i] : "");
    }

    return items;
  }, [value]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    let val = e.target.value.trim();
    const isDigit = /^\d$/.test(val);

    if (!isDigit && val !== "") return;

    val = isDigit ? val : " ";

    if (val.length === 1) {
      const newValue = value.substring(0, idx) + val + value.substring(idx + 1);

      setValue(newValue);

      if (!isDigit) return;

      focusToNextInput(e.target);
    } else if (val.length === 4) {
      setValue(val);

      e.target.blur();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Handle OTP submission logic here
    console.log(value);
    setStage("success");
  };

  return (
    <div className="space-y-6 w-full">
      <form
        className="gap-[60px] flex flex-col size-full"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-center flex-col gap-5">
          <h4
            className={`tracking-[2px] leading-[150%] font-normal text-2xl md:text-3xl lg:text-4xl ${anton.className} w-full text-center`}
          >
            Verify OTP
          </h4>
          <p className="text-sm md:text-base leading-6 tracking-[1px] font-normal w-full text-center">
            We sent a code to {email}. Enter code to verify your email address
          </p>
        </div>
        <div className="space-y-4 mx-auto w-auto">
          <div className="flex gap-4">
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
                type="text"
                onKeyDown={(e) => {
                  const target = e.target as HTMLInputElement;
                  const val = target.value;

                  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                    e.preventDefault();
                    return focusToNextInput(target);
                  }
                  if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                    e.preventDefault();
                    return focusToPrevInput(target);
                  }

                  target.setSelectionRange(0, val.length);

                  if (e.key !== "Backspace" || val !== "") return;

                  const prevElementSibling =
                    target.previousElementSibling as HTMLInputElement;
                  if (prevElementSibling) prevElementSibling.focus();
                }}
                onFocus={(e) =>
                  e.target.setSelectionRange(0, e.target.value.length)
                }
                className={`h-[65px] md:h-[82px] lg:h-[65px] xl:h-[82px] w-[54px] md:w-[78px] lg:w-[54px] xl:w-[78px] caret-[#B39FF0] text-center flex items-center justify-center text-base px-6 py-5 rounded-[10px] leading-6 tracking-[1px] placeholder:text-white/50 placeholder:text-xs sm:placeholder:text-base outline-0 ring-0 ${
                  true
                    ? "text-white border-[#FB736EB2] border bg-[#FB736E1A] focus:bg-[#242324] focus:text-white focus:border-0"
                    : digit
                    ? "text-[#FFFFFF99] bg-[#F4E90E1A] border border-[#F4E90EB2] focus:bg-[#242324] focus:text-white focus:border-0"
                    : "bg-[#242324] text-white"
                }`}
              />
            ))}
          </div>
          {true && (
            <p className="text-xs md:text-sm text-[#FB736E] leading-5 tracking-[1px]">
              This code is not correct. Double-check it and try again
            </p>
          )}
        </div>
        <button
          className="w-full py-3 px-4 rounded-[10px] md:rounded-[20px] h-[61px] md:h-[84px] bg-[#B39FF0] hover:bg-[#B39FF0]/90 text-[#2C2C26] text-base md:text-xl font-bold leading-[150%] tracking-[2px] flex items-center justify-center"
          title="Verify OTP"
          type="submit"
        >
          Continue
        </button>
      </form>
      <p className="text-base md:text-xl leading-[150%] tracking-[2px] font-semibold">
        Didn&apos;t get the code?{" "}
        <span className="text-[#B39FF0]"> Resend in 00:45</span>
      </p>
    </div>
  );
}

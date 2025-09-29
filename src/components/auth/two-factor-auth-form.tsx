/* eslint-disable @typescript-eslint/no-explicit-any */
import { anton } from "@/app/fonts";
import { useAuth } from "@/context/auth-context";
import { verify2fa } from "@/utils/action";
import { initiate2fa } from "@/utils/queries";
import { focusToNextInput } from "@/utils/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import OtpForm from "./authentication-otp-form";

export default function TwoFactorAuth({
  email,
  tokens,
}: {
  email: string;
  tokens: { accessToken: string; refreshToken: string };
}) {
  const router = useRouter();

  const { user } = useAuth();

  const [stage, setStage] = useState<"setup" | "verify">("setup");

  const { data: tfaData, isPending: isLoadingTfaData } = useQuery({
    queryKey: ["enabled-2fa", user?.isTfaEnabled],
    queryFn: async () => await initiate2fa(tokens.accessToken),
    enabled: !!user && !user.isTfaEnabled,
  });

  const [openQrCodeModal, setOpenQrCodeModal] = useState(false);
  const toggleOpenQrCodeModal = () => {
    setOpenQrCodeModal((prev) => !prev);
  };

  const [otp, setOtp] = useState("");

  const handleOTPChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    let val = e.target.value.trim();
    const isDigit = /^\d$/.test(val);

    if (!isDigit && val !== "") return;

    val = isDigit ? val : " ";

    if (val.length === 1) {
      const newValue = otp.substring(0, idx) + val + otp.substring(idx + 1);

      setOtp(newValue);

      if (!isDigit) return;

      focusToNextInput(e.target);
    } else if (val.length === 6) {
      setOtp(val);

      e.target.blur();
    }
  };

  const {
    mutate: handle2faVerifyOtp,
    isPending: otpLoading,
    isError: isOtpError,
    error: otpError,
  } = useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: async () =>
      await verify2fa(otp, email, tokens.accessToken, !!user?.isTfaEnabled),
    onSuccess: async (res) => {
      if (res.success) {
        toast.success(res.message || "OTP verification successful.");
        router.push("/");
      } else toast.error(res.message);
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
    },
  });

  useEffect(() => {
    if (user?.isTfaEnabled) setStage("verify");
  }, [user?.isTfaEnabled]);

  if (stage === "verify")
    return (
      <OtpForm
        action={{
          handleVerifyToken: handle2faVerifyOtp,
          loading: otpLoading,
          isError: isOtpError,
          error: otpError,
        }}
        value={otp}
        handleChange={handleOTPChange}
      />
    );

  return (
    <>
      {openQrCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/10 backdrop-blur-xs"
            onClick={toggleOpenQrCodeModal}
          />

          <div className="relative z-10 rounded-[15px] bg-[#1b191c] flex flex-col items-center justify-center gap-8 py-11 px-8">
            <span
              className="absolute top-11 right-8 cursor-pointer"
              onClick={toggleOpenQrCodeModal}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.75781 17.243L12.0008 12L17.2438 17.243M17.2438 6.757L11.9998 12L6.75781 6.757"
                  stroke="white"
                  strokeOpacity="0.6"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <div className="flex flex-col items-center justify-center gap-4">
              <h6
                className={`${anton.className} text-[21px] md:text-[27px] leading-[150%] tracking-[2px]`}
              >
                QR Code
              </h6>
              <p className="text-base/6 tracking-[1px]">
                Use your authenticator app to scan this QR code
              </p>
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="qr code"
              aria-label="qr-code"
              src={tfaData?.data?.dataUrl}
              className="max-w-[308px] size-auto object-contain rounded-[15px]"
            />

            <div
              onClick={toggleOpenQrCodeModal}
              className="flex items-center cursor-pointer justify-center gap-2.5 rounded-[20px] py-3 px-4 border border-white/20 w-[231px]"
            >
              <p className="leading-[150%] tracking-[2px] font-semibold text-[#EDECD8] text-sm">
                Close
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="size-full flex items-center justify-center flex-col gap-6 max-w-[480px]">
        <div className="w-full space-y-[60px]">
          <div className="flex items-center justify-center text-center flex-col gap-6">
            <h4
              className={`tracking-[2px] leading-[150%] font-normal text-2xl md:text-3xl lg:text-4xl ${anton.className} w-full text-center`}
            >
              Set up two-factor authentication
            </h4>
            <p className="text-base/6 tracking-[1px]">
              Follow these steps to set up your two factor authentication
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <h6 className="text-base/6 tracking-[1px] font-semibold">
                Download an authentication app
              </h6>
              <p className="text-[#FFFFFF99] text-base/[30px] tracking-[1px]">
                We recommend you download the Google Authenticator app.{" "}
                <a
                  href={
                    getDeviceInfo().isIOS
                      ? "https://apps.apple.com/app/google-authenticator/id388497605"
                      : "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tracking-[2px] leading-[150%] font-semibold text-base w-full text-center text-[#B39FF0]"
                >
                  Click here
                </a>{" "}
                to download if you don&apos;t have
              </p>
            </div>
            <div className="space-y-4">
              <h6 className="text-base/6 tracking-[1px] font-semibold">
                Add account
              </h6>
              <p className="text-[#FFFFFF99] text-base/[30px] tracking-[1px]">
                In the authenticator app, tap the
                <a
                  href={
                    getDeviceInfo().isIOS
                      ? "https://apps.apple.com/app/google-authenticator/id388497605"
                      : "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tracking-[2px] leading-[150%] font-semibold text-base w-full text-center text-[#B39FF0]"
                >
                  +
                </a>
                button and select scan QR code or enter a setup key
              </p>
            </div>
            <div className="space-y-4">
              <h6 className="text-base/6 tracking-[1px] font-semibold">
                Copy this key or Scan the Qr code below
              </h6>
              <p className="text-[#FFFFFF99] text-base/[30px] tracking-[1px]">
                Then copy and paste the key below on the authenticator app or
                select use QR code to scan
              </p>
            </div>
            <div className="py-5 px-6 flex items-center justify-center rounded-[10px] bg-[#242324]">
              <p className="text-base/6 tracking-[1px] font-bold">
                {tfaData?.data?.secret}
              </p>
            </div>
            <div
              onClick={() => {
                if (tfaData?.data?.secret) {
                  navigator.clipboard.writeText(tfaData.data.secret);
                  toast.info("Key copied to clipboard");
                }
              }}
              className="flex items-center cursor-pointer justify-center gap-2.5 rounded-[20px] py-3 px-4 border border-white/20"
            >
              <svg
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10.5 0.833252H7.796C6.57067 0.833252 5.6 0.833252 4.84067 0.935252C4.05933 1.04059 3.42667 1.26192 2.92733 1.76059C2.42867 2.25992 2.20733 2.89259 2.102 3.67392C2 4.43392 2 5.40392 2 6.62925V10.6666C1.99988 11.2622 2.21244 11.8384 2.5994 12.2912C2.98636 12.744 3.52228 13.0438 4.11067 13.1366C4.202 13.6459 4.37867 14.0806 4.732 14.4346C5.13333 14.8359 5.63867 15.0079 6.23867 15.0893C6.81667 15.1666 7.552 15.1666 8.46333 15.1666H10.5367C11.448 15.1666 12.1833 15.1666 12.7613 15.0893C13.3613 15.0079 13.8667 14.8359 14.268 14.4346C14.6693 14.0333 14.8413 13.5279 14.9227 12.9279C15 12.3499 15 11.6146 15 10.7033V7.29658C15 6.38525 15 5.64992 14.9227 5.07192C14.8413 4.47192 14.6693 3.96659 14.268 3.56525C13.914 3.21192 13.4793 3.03525 12.97 2.94392C12.8772 2.35554 12.5774 1.81961 12.1246 1.43265C11.6718 1.04569 11.0956 0.833132 10.5 0.833252ZM11.92 2.84725C11.8186 2.55125 11.6272 2.29436 11.3726 2.11254C11.118 1.93071 10.8129 1.83306 10.5 1.83325H7.83333C6.562 1.83325 5.65933 1.83459 4.97333 1.92659C4.30333 2.01659 3.91667 2.18592 3.63467 2.46792C3.35267 2.74992 3.18333 3.13659 3.09333 3.80659C3.00133 4.49259 3 5.39525 3 6.66658V10.6666C2.99981 10.9795 3.09746 11.2846 3.27928 11.5392C3.46111 11.7938 3.718 11.9852 4.014 12.0866C4 11.6799 4 11.2199 4 10.7033V7.29658C4 6.38525 4 5.64992 4.078 5.07192C4.158 4.47192 4.33133 3.96659 4.732 3.56525C5.13333 3.16392 5.63867 2.99192 6.23867 2.91125C6.81667 2.83325 7.552 2.83325 8.46333 2.83325H10.5367C11.0533 2.83325 11.5133 2.83325 11.92 2.84725ZM5.43867 4.27325C5.62333 4.08858 5.882 3.96859 6.372 3.90259C6.87467 3.83525 7.54267 3.83392 8.49933 3.83392H10.4993C11.456 3.83392 12.1233 3.83525 12.6273 3.90259C13.1167 3.96859 13.3753 4.08925 13.56 4.27325C13.7447 4.45792 13.8647 4.71658 13.9307 5.20658C13.998 5.70925 13.9993 6.37725 13.9993 7.33392V10.6673C13.9993 11.6239 13.998 12.2913 13.9307 12.7953C13.8647 13.2846 13.744 13.5433 13.56 13.7279C13.3753 13.9126 13.1167 14.0326 12.6267 14.0986C12.1233 14.1659 11.456 14.1673 10.4993 14.1673H8.49933C7.54267 14.1673 6.87467 14.1659 6.37133 14.0986C5.882 14.0326 5.62333 13.9119 5.43867 13.7279C5.254 13.5433 5.134 13.2846 5.068 12.7946C5.00067 12.2913 4.99933 11.6239 4.99933 10.6673V7.33392C4.99933 6.37725 5.00067 5.70925 5.068 5.20592C5.134 4.71659 5.25467 4.45792 5.43867 4.27325Z"
                  fill="#EDECD8"
                />
              </svg>

              <p className="leading-[150%] tracking-[2px] text-sm font-semibold text-[#EDECD8]">
                Copy key
              </p>
            </div>
            <div
              onClick={toggleOpenQrCodeModal}
              className="flex items-center cursor-pointer justify-center gap-2.5 rounded-[20px] py-3 px-4 border border-white/20"
            >
              <svg
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.16699 7.33342V2.66675H7.83366V7.33342H3.16699ZM3.83366 6.66675H7.16699V3.33341H3.83366V6.66675ZM3.16699 13.3334V8.66675H7.83366V13.3334H3.16699ZM3.83366 12.6667H7.16699V9.33342H3.83366V12.6667ZM9.16699 7.33342V2.66675H13.8337V7.33342H9.16699ZM9.83366 6.66675H13.167V3.33341H9.83366V6.66675ZM12.667 13.3334V12.1667H13.8337V13.3334H12.667ZM9.16699 9.83342V8.66675H10.3337V9.83342H9.16699ZM10.3337 11.0001V9.83342H11.5003V11.0001H10.3337ZM9.16699 12.1667V11.0001H10.3337V12.1667H9.16699ZM10.3337 13.3334V12.1667H11.5003V13.3334H10.3337ZM11.5003 12.1667V11.0001H12.667V12.1667H11.5003ZM11.5003 9.83342V8.66675H12.667V9.83342H11.5003ZM12.667 11.0001V9.83342H13.8337V11.0001H12.667Z"
                  fill="#EDECD8"
                />
              </svg>

              <p className="leading-[150%] tracking-[2px] text-sm font-semibold text-[#EDECD8]">
                Use QR code
              </p>
            </div>
          </div>

          <button
            disabled={isLoadingTfaData}
            className="w-full py-3 px-4 rounded-[10px] md:rounded-[20px] h-[61px] md:h-[84px] bg-[#B39FF0] hover:bg-[#B39FF0]/90 text-[#2C2C26] text-base md:text-xl font-bold leading-[150%] tracking-[2px] flex items-center justify-center"
            title="continue"
            onClick={() => {
              setStage("verify");
            }}
          >
            Continue
          </button>
        </div>
        <a
          href={
            getDeviceInfo().isIOS
              ? "https://apps.apple.com/app/google-authenticator/id388497605"
              : "https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US"
          }
          target="_blank"
          rel="noopener noreferrer"
          className="tracking-[2px] leading-[150%] font-normal text-base w-full text-center text-[#B39FF0]"
        >
          Need help?
        </a>
      </div>
    </>
  );
}

function getDeviceInfo() {
  if (typeof navigator === "undefined")
    return {
      isAndroid: false,
      isIOS: false,
      isMobile: false,
      os: "unknown" as const,
    };

  const ua = navigator.userAgent || (window as any).opera;

  const isAndroid = /android/i.test(ua);
  const isIOS =
    (navigator.maxTouchPoints > 1 && !(window as any).MSStream) ||
    /iPad|iPhone|iPod/.test(ua);

  const os = isAndroid ? "android" : isIOS ? "ios" : "unknown";

  return { isAndroid, isIOS, isMobile: isAndroid || isIOS, os };
}

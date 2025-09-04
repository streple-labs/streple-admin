"use client";

import { anton } from "@/app/fonts";
import PublishTradeForm from "@/components/modals/publish-trade";
import { publishTrade } from "@/utils/action";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { toast } from "sonner";

const initialState: CopyTradeFormData = {
  asset: undefined,
  leverage: undefined,
  positionSize: {
    amount: "",
    currency: "USDT",
  },
  duration: undefined,
  startDate: undefined,
  endDate: undefined,
  comment: "",
  action: undefined,
  entryPrice: undefined,
  takeProfit: undefined,
  stopLoss: undefined,
  riskLevel: undefined,
  isDraft: false,
  orderType: undefined,
};

export default function PublishTradeBtn() {
  const router = useRouter();

  const [formData, setFormData] = useState(initialState);

  const [isPublishTradeOpen, setIsPublishTradeOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { mutate: handlePublishTrade, isPending: loading } = useMutation({
    mutationKey: ["publish-trade"],
    mutationFn: async () => await publishTrade(formData),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        setIsPublishTradeOpen(false);

        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          router.refresh();
        }, 5000);
      } else toast.error(res.message);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
    },
  });

  return (
    <>
      <button
        onClick={() => {
          setIsPublishTradeOpen(true);
        }}
        className="flex items-center justify-center gap-2.5 bg-[#A082F9] rounded-[10px] p-3 h-[40px] font-normal text-xs leading-3 text-[#2b2b37]"
      >
        Publish trade
      </button>

      <PublishTradeForm
        isOpen={isPublishTradeOpen}
        close={() => {
          setIsPublishTradeOpen(false);
        }}
        formData={formData}
        setFormData={setFormData}
        isLoading={loading}
        handlePublishTrade={handlePublishTrade}
      />

      {showSuccessModal && (
        <div className="fixed inset-0 flex p-[5%] justify-center items-center z-50">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => {
              setShowSuccessModal(false);
            }}
          />
          <div className="bg-[#242324] w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[20px] p-16 flex items-center justify-center flex-col gap-6 relative">
            <span
              className="absolute top-8 left-8 cursor-pointer"
              onClick={() => {
                setShowSuccessModal(false);
              }}
            >
              <FaArrowLeft />
            </span>
            <h4
              className={`${anton.className} text-2xl w-full text-center font-normal leading-[150%] tracking-[2px]`}
            >
              Published successfully
            </h4>
            <p className="text-base font-normal leading-6 tracking-[1px] -mt-3">
              Your trade has been published successfully. You can view the trade
              in the{" "}
              <b
                className="cursor-pointer"
                onClick={() => {
                  router.push("/protraders/trade-management");
                }}
              >
                Trade management tab
              </b>
            </p>

            <button
              onClick={() => {
                setIsPublishTradeOpen(false);
                setShowSuccessModal(false);
                router.refresh();
              }}
              className="w-full flex items-center justify-center gap-2.5 bg-[#B39FF0] rounded-[20px] p-3 h-[50px] text-sm leading-[150%] tracking-[2px] font-bold text-[#2C2C26]"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </>
  );
}

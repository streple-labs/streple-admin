"use client";

import PublishTradeForm from "@/components/modals/publish-trade";
import Loader from "@/components/ui/loader";
import { closeTrade, updateTrade } from "@/utils/action";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function QuickActionBtns({ trade }: { trade: CopyTrade }) {
  const router = useRouter();

  const [formData, setFormData] = useState<CopyTradeFormData>({
    asset: trade.asset,
    leverage: trade.leverage.toString(),
    positionSize: {
      amount: trade.positionSize.amount.toString(),
      currency: trade.positionSize.currency,
    },
    duration: trade.duration,
    startDate: trade.startDate,
    endDate: trade.endDate,
    comment: trade.comment,
    action: trade.action,
    entryPrice: trade.entryPrice,
    takeProfit: trade.takeProfit,
    stopLoss: trade.stopLoss,
    riskLevel: trade.riskLevel,
    isDraft: trade.isDraft,
    orderType: trade.orderType,
  });

  const [isEditTradeOpen, setIsEditTradeOpen] = useState(false);

  const { mutate: handleEditTrade, isPending: isUpdatingTrade } = useMutation({
    mutationKey: ["update-trade"],
    mutationFn: async () => await updateTrade({ ...formData, id: trade.id }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);
        setIsEditTradeOpen(false);

        router.refresh();
      } else toast.error(res.message);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
    },
  });

  const { mutate: handleCloseTrade, isPending: isClosingTrade } = useMutation({
    mutationKey: ["close-trade"],
    mutationFn: async () => await closeTrade(trade.id),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.message);

        router.refresh();
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
      <PublishTradeForm
        isOpen={isEditTradeOpen}
        close={() => {
          setIsEditTradeOpen(false);
        }}
        formData={formData}
        setFormData={setFormData}
        isLoading={isUpdatingTrade}
        handlePublishTrade={handleEditTrade}
      />
      {isUpdatingTrade || isClosingTrade ? (
        <span className="w-full flex items-center justify-center">
          <Loader />
        </span>
      ) : (
        <>
          {trade.isDraft ? (
            <>
              <button
                onClick={() => {
                  setIsEditTradeOpen(true);
                }}
              >
                Edit
              </button>
              <button
                className="text-[#BBA4FF]"
                onClick={() => {
                  setFormData({ ...formData, isDraft: false });
                  handleEditTrade();
                }}
              >
                Publish
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditTradeOpen(true);
                }}
              >
                Update
              </button>
              <button
                className="text-[#F28787]"
                onClick={() => {
                  handleCloseTrade();
                }}
              >
                Close
              </button>
            </>
          )}
        </>
      )}
    </>
  );
}

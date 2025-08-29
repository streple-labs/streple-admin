"use client";

import { anton } from "@/app/fonts";
import PublishTradeForm from "@/components/modals/publish-trade";
import { publishTrade } from "@/utils/action";
import { formatCurrency } from "@/utils/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { toast } from "sonner";

const mockTrades: CopyTrade[] = [
  {
    id: "t1",
    assetPair: "BTC/USDT",
    position: "Long",
    entryPrice: 60250.25,
    currentPrice: 61890.6,
    realizedPnl: 1240.5,
    copierCount: 84,
    copierProfit: 9850.75,
  },
  {
    id: "t2",
    assetPair: "ETH/USDT",
    position: "Short",
    entryPrice: 2920.1,
    currentPrice: 2845.35,
    realizedPnl: 420.15,
    copierCount: 56,
    copierProfit: 4230.9,
  },
  {
    id: "t3",
    assetPair: "SOL/USDT",
    position: "Long",
    entryPrice: 168.4,
    currentPrice: 161.95,
    realizedPnl: -210.35,
    copierCount: 33,
    copierProfit: -950.2,
  },
  {
    id: "t4",
    assetPair: "XRP/USDT",
    position: "Short",
    entryPrice: 0.59,
    currentPrice: 0.54,
    realizedPnl: 180.05,
    copierCount: 22,
    copierProfit: 640.0,
  },
];

const initialState: CopyTradeFormData = {
  asset: undefined,
  leverage: undefined,
  positionSize: {
    amount: "",
    currency: "USDT",
  },
  duration: undefined,
  comment: "",
  action: undefined,
  entryPrice: undefined,
  direction: undefined,
  takeProfit: undefined,
  stopLoss: undefined,
  riskLevel: undefined,
  isDraft: false,
  orderType: undefined,
};

export default function Protraders() {
  const router = useRouter();

  const [formData, setFormData] = useState(initialState);

  const [isPublishTradeOpen, setIsPublishTradeOpen] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { mutate: handlePublishTrade, isPending: loading } = useMutation({
    mutationKey: ["publish-trade"],
    mutationFn: async () => await publishTrade(formData),
    onSuccess: (res) => {
      if (res.success) {
        router.push("/");
        toast.success(res.message);
        setIsPublishTradeOpen(false);

        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
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
      <div className="rounded-[20px] bg-[#211F22] py-8 px-6 w-full flex flex-col gap-6 overflow-y-auto hide-scrollbar">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex items-center justify-between">
            <h4
              className={`${anton.className} text-base font-normal leading-4 tracking-normal`}
            >
              Overview
            </h4>
            <button
              onClick={() => {
                setIsPublishTradeOpen(true);
              }}
              className="flex items-center justify-center gap-2.5 bg-[#A082F9] rounded-[10px] p-3 h-[40px] font-normal text-xs leading-3 text-[#2b2b37]"
            >
              Publish trade
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
            <div className="py-6 px-4 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <p className="text-sm text-white/50 font-normal">Active trades</p>
              <p className={`${anton.className} text-2xl text-white/80`}>45</p>
            </div>
            <div className="py-6 px-4 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm text-white/50 font-normal">
                  Closed trades
                </p>
                <p className="border border-white/5 bg-white/5 py-1 px-2 rounded-[5px] text-xs font-normal text-white/60">
                  90D
                </p>
              </div>
              <p className={`${anton.className} text-2xl text-white/80`}>45</p>
            </div>
            <div className="py-6 px-4 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <p className="text-sm text-white/50 font-normal">Total PnL</p>
              <p className={`${anton.className} text-2xl text-white/80`}>
                +$1,240.50
              </p>
            </div>
            <div className="py-6 px-4 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <p className="text-sm text-white/50 font-normal">Win rate</p>
              <p className={`${anton.className} text-2xl text-white/80`}>71%</p>
            </div>
            <div className="py-6 px-4 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <p className="text-sm text-white/50 font-normal">Average ROI</p>
              <p className={`${anton.className} text-2xl text-white/80`}>
                +8.6%
              </p>
            </div>
            <div className="py-6 px-4 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm text-white/50 font-normal">Profit</p>
                <p className="border border-white/5 bg-white/5 py-1 px-2 rounded-[5px] text-xs font-normal text-[#3BFD5F99]">
                  +$30 last 30 days
                </p>
              </div>
              <p className={`${anton.className} text-2xl text-white/80`}>
                +$16,240.50
              </p>
            </div>
            <div className="py-6 px-4 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm text-white/50 font-normal">Followers</p>
                <p className="border border-white/5 bg-white/5 py-1 px-2 rounded-[5px] text-xs font-normal text-[#3BFD5F99]">
                  +30 last 30 days
                </p>
              </div>
              <p className={`${anton.className} text-2xl text-white/80`}>300</p>
            </div>
            <div className="py-6 px-4 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <p className="text-sm text-white/50 font-normal">
                Risk level trend
              </p>
              <p className={`${anton.className} text-2xl text-white/80`}>
                Medium
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-6 w-full">
          <h4
            className={`${anton.className} text-sm font-normal leading-4 tracking-normal`}
          >
            Recent published trades
          </h4>
          <div className="overflow-x-auto size-full hide-scrollbar bg-[#242324] rounded-[15px]">
            <table className="min-w-full text-left text-xs font-normal">
              <thead>
                <tr className="[&>th]:text-xs [&>td]:leading-3 [&>td]:tracking-0 [&>th]:font-normal [&>th]:p-4 [&>th]:text-nowrap border-b border-b-white/5 [&>th]:text-white/60">
                  <th>Asset pair</th>
                  <th>Trade position</th>
                  <th>Entry price</th>
                  <th>Current price</th>
                  <th>Realized PnL</th>
                  <th>No. of copiers</th>
                  <th>Copier&apos;s profit</th>
                </tr>
              </thead>
              <tbody>
                {mockTrades.map((trade) => (
                  <tr
                    key={trade.id}
                    className="[&>td]:text-xs [&>td]:leading-3 [&>td]:tracking-0 [&>td]:font-normal [&>td]:py-3 [&>td]:px-4 [&>td]:h-[72px] border-b border-b-white/5 last:border-0"
                  >
                    <td className="flex flex-col justify-center gap-2 text-white/80">
                      {trade.assetPair}
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-[14px] text-xs/4 ${
                          trade.position === "Long"
                            ? "bg-[#8CF982] text-[#141714]"
                            : "bg-[#C76969] text-[#2F1818]"
                        }`}
                      >
                        {trade.position}
                      </span>
                    </td>
                    <td>{trade.entryPrice.toLocaleString()} USDT</td>
                    <td>{trade.currentPrice.toLocaleString()} USDT</td>
                    <td>
                      <span
                        className={
                          trade.realizedPnl >= 0
                            ? "text-[#58CE48]"
                            : "text-[#ED8C8C]"
                        }
                      >
                        {formatCurrency(trade.realizedPnl, false)}
                      </span>{" "}
                      USDT
                    </td>
                    <td>{trade.copierCount}</td>
                    <td>{formatCurrency(trade.copierProfit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
              in the Trade management tab
            </p>

            <button
              onClick={() => {
                setIsPublishTradeOpen(false);
                setShowSuccessModal(false);
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

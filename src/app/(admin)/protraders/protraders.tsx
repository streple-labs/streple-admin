"use client";

import { anton } from "@/app/fonts";
import PublishTradeForm from "@/components/modals/publish-trade";
import { formatCurrency } from "@/utils/utils";
import { useState } from "react";

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

export default function Protraders() {
  const [formData, setFormData] = useState<CopyTradeFormData>({
    assetPair: undefined,
    tradeType: undefined,
    position: undefined,
    entryPrice: undefined,
    takeProfit: undefined,
    stopLoss: undefined,
    leverage: undefined,
    positionSizeValue: undefined,
    positionSizeCurrency: "BTC",
    tradeDuration: undefined,
    riskLevel: undefined,
    reason: "",
  });

  const [isPublishTradeOpen, setIsPublishTradeOpen] = useState(false);

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
        isLoading={false}
      />
    </>
  );
}

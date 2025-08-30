import { anton } from "@/app/fonts";
import Filters from "./_component/filters";
import { formatCurrency } from "@/utils/utils";
import { Suspense } from "react";

export const revalidate = 0;

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

export default function page() {
  return (
    <div className="rounded-[20px] bg-[#211F22] py-8 px-6 w-full flex flex-col gap-6 overflow-y-auto hide-scrollbar">
      <h4
        className={`${anton.className} text-base font-normal leading-4 tracking-normal`}
      >
        Trade management
      </h4>

      <Suspense>
        <Filters />
      </Suspense>

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
              <th>Date published</th>
              <th>Quick actions</th>
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
                <td></td>
                <td className="flex items-center gap-4">
                  <button>Update</button>
                  <button className="text-[#F28787]">Close</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

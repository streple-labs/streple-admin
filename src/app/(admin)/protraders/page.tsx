import { anton } from "@/app/fonts";
import { formatCurrency, formatFigure } from "@/utils/utils";
import { Metadata } from "next";
import Link from "next/link";
import { getUserCopyTrades, getUserCopyTradeStats } from "@/utils/queries";
import PublishTradeBtn from "./publish-trade-btn";

export const metadata: Metadata = {
  title: "ProTraders",
  description: "ProTraders Dashboard",
};

export const revalidate = 0;

export default async function page() {
  const { trades, error: tradesError } = await getUserCopyTrades({
    limit: 5,
    page: 1,
  });

  const { stats, error: statsError } = await getUserCopyTradeStats();

  return (
    <div className="rounded-[20px] bg-[#211F22] py-8 px-6 w-full flex flex-col gap-6 overflow-y-auto hide-scrollbar">
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <h4
            className={`${anton.className} text-base font-normal leading-4 tracking-normal`}
          >
            Overview
          </h4>
          <PublishTradeBtn />
        </div>

        {statsError ? (
          <div className="flex items-center justify-center size-full">
            <p className="text-red-600 text-sm font-normal">{statsError}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
            <div className="py-6 px-4 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <p className="text-sm text-white/50 font-normal">Active trades</p>
              <p className={`${anton.className} text-2xl text-white/80`}>
                {stats?.activeTrade}
              </p>
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
              <p className={`${anton.className} text-2xl text-white/80`}>
                {stats?.closedTrade}
              </p>
            </div>
            <div className="py-6 px-4 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <p className="text-sm text-white/50 font-normal">Total PnL</p>
              <p className={`${anton.className} text-2xl text-white/80`}>
                +${formatFigure(stats?.totalPnL as number)}
              </p>
            </div>
            <div className="py-6 px-4 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <p className="text-sm text-white/50 font-normal">Win rate</p>
              <p className={`${anton.className} text-2xl text-white/80`}>
                {stats?.winRate}%
              </p>
            </div>
            <div className="py-6 px-4 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <p className="text-sm text-white/50 font-normal">Average ROI</p>
              <p className={`${anton.className} text-2xl text-white/80`}>
                +{stats?.averageROI}%
              </p>
            </div>
            <div className="py-6 px-4 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm text-white/50 font-normal">Profit</p>
                <p
                  className={`border border-white/5 bg-white/5 py-1 px-2 rounded-[5px] text-xs font-normal ${
                    stats?.profitChange.isIncreased
                      ? "text-[#3BFD5F99]"
                      : "text-red-600"
                  }`}
                >
                  {stats?.profitChange.isIncreased ? "+" : "-"} $
                  {formatFigure(stats?.profitChange.amount as number)} last 30
                  days
                </p>
              </div>
              <p className={`${anton.className} text-2xl text-white/80`}>
                +${formatFigure(stats?.currentProfit as number)}
              </p>
            </div>
            <div className="py-6 px-4 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <div className="flex items-center justify-between w-full">
                <p className="text-sm text-white/50 font-normal">Followers</p>
                <p className="border border-white/5 bg-white/5 py-1 px-2 rounded-[5px] text-xs font-normal text-[#3BFD5F99]">
                  +30 last 30 days
                </p>
              </div>
              <p className={`${anton.className} text-2xl text-white/80`}>
                {stats?.followers}
              </p>
            </div>
            <div className="py-6 px-4 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <p className="text-sm text-white/50 font-normal">
                Risk level trend
              </p>
              <p
                className={`${anton.className} text-2xl text-white/80 capitalize`}
              >
                {stats?.riskLevelTrends}
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center justify-between">
          <h4
            className={`${anton.className} text-sm font-normal leading-4 tracking-normal`}
          >
            Recent published trades
          </h4>

          <Link href="/protraders/trade-management">
            <p className="text-xs text-[#F4E90ECC] font-normal">Show all</p>
          </Link>
        </div>

        {tradesError ? (
          <div className="flex items-center justify-center size-full">
            <p className="text-red-600 text-sm font-normal">{tradesError}</p>
          </div>
        ) : trades!.data.length === 0 ? (
          <div className="flex items-center justify-center size-full">
            <p className="text-white/50 text-sm font-normal">
              No trades found. Upload a trade!
            </p>
          </div>
        ) : (
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
                {trades!.data.map((trade) => (
                  <tr
                    key={trade.id}
                    className="[&>td]:text-xs [&>td]:leading-3 [&>td]:tracking-0 [&>td]:font-normal [&>td]:py-3 [&>td]:px-4 [&>td]:h-[72px] border-b border-b-white/5 last:border-0"
                  >
                    <td className="flex flex-col justify-center gap-2 text-white/80">
                      {trade.asset}
                    </td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-[14px] text-xs/4 ${
                          trade.action === "buy"
                            ? "bg-[#8CF982] text-[#141714]"
                            : "bg-[#C76969] text-[#2F1818]"
                        }`}
                      >
                        {trade.action ? "Long" : "Short"}
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
                    <td>{trade.noOfCopiers}</td>
                    <td>{formatCurrency(trade.copiersProfit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

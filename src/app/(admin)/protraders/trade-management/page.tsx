import { anton } from "@/app/fonts";
import { getUserCopyTrades } from "@/utils/queries";
import { formatCurrency, formatDate } from "@/utils/utils";
import { Suspense } from "react";
import Filters from "./_component/filters";
import QuickActionBtns from "./_component/quick-action-btns";
import Link from "next/link";

export const revalidate = 0;

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { trades, error } = await getUserCopyTrades(params);

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

      {error ? (
        <div className="flex items-center justify-center size-full">
          <p className="text-red-600 text-sm font-normal">{error}</p>
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
                <th>Date published</th>
                <th>Quick actions</th>
              </tr>
            </thead>
            <tbody>
              {trades!.data.map((trade) => (
                <tr
                  key={trade.id}
                  className="[&>td]:text-xs [&>td]:leading-3 [&>td]:tracking-0 [&>td]:font-normal [&>td]:py-3 [&>td]:px-4 [&>td]:h-[72px] border-b border-b-white/5 last:border-0"
                >
                  <td className="flex flex-col justify-center gap-2 text-white/80">
                    <Link href={`/protraders/trade-management/${trade.id}`}>
                      {trade.asset}
                    </Link>
                  </td>
                  <td>
                    <Link href={`/protraders/trade-management/${trade.id}`}>
                      <span
                        className={`px-2 py-1 rounded-[14px] text-xs/4 ${
                          trade.action === "buy"
                            ? "bg-[#8CF982] text-[#141714]"
                            : "bg-[#C76969] text-[#2F1818]"
                        }`}
                      >
                        {trade.action === "buy" ? "Long" : "Short"}
                      </span>
                    </Link>
                  </td>
                  <td>
                    <Link href={`/protraders/trade-management/${trade.id}`}>
                      {trade.entryPrice.toLocaleString()} USDT
                    </Link>
                  </td>
                  <td>
                    <Link href={`/protraders/trade-management/${trade.id}`}>
                      {trade.currentPrice.toLocaleString()} USDT
                    </Link>
                  </td>
                  <td>
                    <Link href={`/protraders/trade-management/${trade.id}`}>
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
                    </Link>
                  </td>
                  <td>
                    <Link href={`/protraders/trade-management/${trade.id}`}>
                      {trade.noOfCopiers}
                    </Link>
                  </td>
                  <td>
                    <Link href={`/protraders/trade-management/${trade.id}`}>
                      {formatCurrency(trade.copiersProfit)}
                    </Link>
                  </td>
                  <td>
                    <Link href={`/protraders/trade-management/${trade.id}`}>
                      {trade.isDraft ? (
                        <span className="text-[#F3EB52CC]">Draft</span>
                      ) : (
                        formatDate(trade.createdAt)
                      )}
                    </Link>
                  </td>
                  <td className="flex items-center gap-4">
                    <QuickActionBtns trade={trade} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

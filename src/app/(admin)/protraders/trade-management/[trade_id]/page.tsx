import { anton } from "@/app/fonts";
import { getTrade } from "@/utils/queries";
import { formatFigure } from "@/utils/utils";

export default async function page({
  params,
}: {
  params: Promise<{ trade_id: string }>;
}) {
  const { trade_id } = await params;

  const { trade, error } = await getTrade(trade_id);

  return (
    <div className="rounded-[20px] bg-[#211F22] py-8 px-6 w-full flex flex-col gap-6 overflow-y-auto hide-scrollbar">
      {error ? (
        <p className="text-red-600 flex items-center justify-center size-full">
          {error}
        </p>
      ) : (
        <>
          <div className="space-y-2.5 w-full">
            <p className="text-white/40 text-xs">
              Trade management{" "}
              <span className="text-white/70">/ {trade?.asset} - #</span>
            </p>

            <div className="flex items-center justify-between w-full">
              <h4 className={`${anton.className} text-base font-normal`}>
                {trade?.asset} - #
              </h4>

              <div className="flex gap-6">
                <button
                  title="unpublish trade"
                  aria-label="unpublish trade"
                  className="text-xs font-normal text-[#D5D5F4] border-[#EEE9FF4D] border rounded-[10px] h-10 p-3 flex items-center justify-center gap-2.5"
                >
                  {trade?.isDraft ? "Publish trade" : "Unpublish trade"}
                </button>
                <button
                  title="edit trade"
                  aria-label="edit trade"
                  className="text-xs font-normal text-[#D5D5F4] border-[#EEE9FF4D] border rounded-[10px] h-10 p-3 flex items-center justify-center gap-2.5"
                >
                  Edit trade
                </button>
                <button
                  title="close trade"
                  aria-label="close trade"
                  className="text-xs font-normal text-[#D5D5F4] border-[#EEE9FF4D] border rounded-[10px] h-10 p-3 flex items-center justify-center gap-2.5"
                >
                  {trade?.isDraft ? "Delete trade" : "Close trade"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="py-6 px-4 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <p className="text-sm text-white/50 font-normal">
                Pair and Position
              </p>
              <p
                className={`${anton.className} text-2xl text-white/80 flex items-center gap-2`}
              >
                {trade?.asset}
                <span
                  className={`px-2 py-1 rounded-[14px] text-xs/4 ${
                    trade?.action === "buy"
                      ? "bg-[#8CF982] text-[#141714]"
                      : "bg-[#C76969] text-[#2F1818]"
                  }`}
                >
                  {trade?.action === "buy" ? "Long" : "Short"}
                </span>
              </p>
            </div>
            <div className="py-6 px-4 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <p className="text-sm text-white/50 font-normal">Status</p>

              <p className={`${anton.className} text-2xl text-white/80`}>
                +${formatFigure(trade?.realizedPnl as number)}
              </p>
            </div>
            <div className="py-6 px-4 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <p className="text-sm text-white/50 font-normal">Copiers</p>
              <p className={`${anton.className} text-2xl text-white/80`}>
                +${formatFigure(trade?.noOfCopiers as number)}
              </p>
            </div>
            <div className="py-6 px-4 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <p className="text-sm text-white/50 font-normal">
                Risk level trend
              </p>
              <p className={`${anton.className} text-2xl text-white/80`}>
                {trade?.riskLevel}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <h6 className={`${anton.className} text-base tracking-[1%]`}>
                Key trade info
              </h6>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-white/60 font-semibold tracking-[1%]">
                  Entry price
                </p>
                <p className="text-sm text-white/80 font-semibold tracking-[1%]">
                  ${formatFigure(trade!.entryPrice as number)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-white/60 font-semibold tracking-[1%]">
                  Current price
                </p>
                <p className="text-sm text-white/80 font-semibold tracking-[1%]">
                  ${formatFigure(trade!.currentPrice as number)}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-white/60 font-semibold tracking-[1%]">
                  Stop Loss (SL)
                </p>
                <p className="text-sm text-white/80 font-semibold tracking-[1%]">
                  ${formatFigure(trade!.stopLoss as number)} (
                  {(
                    ((trade!.stopLoss - trade!.entryPrice) /
                      trade!.entryPrice) *
                    100
                  ).toFixed(1)}
                  %)
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-white/60 font-semibold tracking-[1%]">
                  Take profit
                </p>
                <p className="text-sm text-white/80 font-semibold tracking-[1%]">
                  ${formatFigure(trade!.takeProfit as number)} (
                  {(
                    ((trade!.takeProfit - trade!.entryPrice) /
                      trade!.entryPrice) *
                    100
                  ).toFixed(1)}
                  %)
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-white/60 font-semibold tracking-[1%]">
                  Profit and Loss
                </p>
                <p className="text-sm text-white/80 font-semibold tracking-[1%]">
                  ${formatFigure(trade!.realizedPnl)} ()
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-white/60 font-semibold tracking-[1%]">
                  Risk/Reward Ratio
                </p>
                <p className="text-sm text-white/80 font-semibold tracking-[1%]"></p>
              </div>
            </div>
            <div className="p-6 rounded-[15px] flex flex-col gap-6 bg-white/5">
              <h6 className={`${anton.className} text-base tracking-[1%]`}>
                Activity feed
              </h6>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

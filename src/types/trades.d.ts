type CopyTrade = {
  id: string;
  assetPair: "BTC/USDT" | "ETH/USDT" | "SOL/USDT" | "XRP/USDT";
  position: "Long" | "Short";
  entryPrice: number;
  currentPrice: number;
  realizedPnl: number;
  copierCount: number;
  copierProfit: number;
};

type CopyTradeFormData = {
  asset:
    | "BTC/USDT"
    | "ETH/USDT"
    | "SOL/USDT"
    | "XRP/USDT"
    | "BNB/USDT"
    | undefined;
  leverage: string | undefined;
  positionSize: "BTC" | "USDT" | undefined;
  duration:
    | "Scalp"
    | "Intraday"
    | "Swing"
    | "Position"
    | { startDate: Date; endDate: Date }
    | undefined;
  comment: string;
  entryPrice: number | undefined;
  direction: "long" | "short" | undefined;
  stopLoss: number | undefined;
  takeProfit: number | undefined;
  stakeAmout: string | undefined;
  action: "buy" | "sell" | undefined;
  riskLevel: "Low" | "Medium" | "High" | undefined;
};

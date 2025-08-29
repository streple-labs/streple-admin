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
  positionSize: {
    amount: string;
    currency: "BTC" | "USDT";
  };
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
  action: "buy" | "sell" | undefined;
  riskLevel: "Low" | "Medium" | "High" | undefined;
  isDraft: boolean;
  orderType: "Market Order" | "Limit Order" | undefined;
};

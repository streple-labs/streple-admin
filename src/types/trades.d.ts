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
  assetPair:
    | "BTC/USDT"
    | "ETH/USDT"
    | "SOL/USDT"
    | "XRP/USDT"
    | "BNB/USDT"
    | undefined;
  tradeType: "Buy" | "Sell" | undefined;
  entryPrice: number | undefined;
  stopLoss: number | undefined;
  takeProfit: number | undefined;
  leverage: number | undefined;
  positionSizeValue: number | undefined;
  positionSizeCurrency: "BTC" | "USDT" | undefined;
  tradeDuration:
    | "Scalp"
    | "Intraday"
    | "Swing"
    | "Position"
    | { start: Date; end: Date }
    | undefined;
  position: "Long" | "Short" | undefined;
  riskLevel: "Low" | "Medium" | "High" | undefined;
  reason: string;
};

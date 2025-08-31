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

type GetCopyTradeStatsResponse = {
  activeTrade: number;
  closedTrade: number;
  totalPnL: number;
  winRate: number;
  averageROI: number;
  currentProfit: number;
  profitChange: { amount: number; percentage: number; isIncreased: boolean };
  followers: number;
  riskLevelTrends: "low" | "medium" | "high";
};

type GetCopyTradesResponse = {
  data: CopyTrade[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

type CopyTrade = {
  id: string;
  userId: string;
  creatorId: string;
  symbol: string;
  stopLoss: number;
  takeProfit: number;
  status: string;
  exitPrice: number;
  action: "buy" | "sell";
  margin: number;
  tradeType: string;
  identifier: string;
  asset: "BTC/USDT" | "ETH/USDT" | "SOL/USDT" | "XRP/USDT" | "BNB/USDT";
  entryPrice: number;
  leverage: number;
  outcome: "Win" | "Loss" | "Breakeven" | "Open";
  tradeRoi: number;
  currentPrice: number;
  positionSize: {
    amount: string;
    currency: "BTC" | "USDT";
  };
  realizedPnl: 10866.5;
  noOfCopiers: 0;
  scheduleStartId: 0;
  scheduleEndId: 1;
  duration:
    | "Scalp"
    | "Intraday"
    | "Swing"
    | "Position"
    | { startDate: Date; endDate: Date };
  direction: "long" | "short";
  startDate: Date;
  expiresAt: Date;
  riskLevel: "Low" | "Medium" | "High";
  isDraft: boolean;
  orderType: "Market Order" | "Limit Order";
  image: string;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
  copiersProfit: number;
};

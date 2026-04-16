export interface DashboardResponse {
  userId: string;
  fullName: string;
  totalInvested: number;
  currentValue: number;
  totalProfitLoss: number;
  profitLossPercentage: number;
  netWorth: number;
  availableCash: number;
  investedPercentage: number;
  totalWalletBalance: number;
  totalAssets: number;
  totalTransactions: number;
  holdings: AssetHolding[];
  wallets: WalletSummary[];
  lastUpdated: Date;
}

export interface AssetHolding {
  assetId: string;
  coinId: string;
  symbol: string;
  coinName: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  portfolioWeightage: number;
}

export interface WalletSummary {
  walletId: string;
  balance: number;
  currency: string;
}
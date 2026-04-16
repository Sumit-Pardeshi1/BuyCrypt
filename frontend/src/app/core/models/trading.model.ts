export interface BuyAssetRequest {
  userId: string;
  walletId: string;
  coinId: string;
  symbol: string;
  coinName: string;
  quantity: number;
  notes?: string;
}

export interface SellAssetRequest {
  userId: string;
  walletId: string;
  coinId: string;
  quantity: number;
  notes?: string;
}

export interface TradeResponse {
  transactionId: string;
  transactionType: string;
  coinId: string;
  symbol: string;
  quantity: number;
  pricePerCoin: number;
  totalAmount: number;
  fees: number;
  newWalletBalance: number;
  transactionDate: Date;
  message: string;
}
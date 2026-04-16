export interface Transaction {
  transactionId: string;
  userId: string;
  walletId: string;
  coinId: string;
  symbol: string;
  transactionType: string;
  quantity: number;
  pricePerCoin: number;
  totalAmount: number;
  fees: number;
  transactionDate: Date;
  notes?: string;
}

export interface TransactionHistory {
  userId: string;
  totalTransactions: number;
  totalBuyAmount: number;
  totalSellAmount: number;
  transactions: Transaction[];
}
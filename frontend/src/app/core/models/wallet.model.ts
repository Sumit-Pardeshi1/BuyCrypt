export interface Wallet {
  walletId: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface WalletTransactionRequest {
  walletId: string;
  amount: number;
}
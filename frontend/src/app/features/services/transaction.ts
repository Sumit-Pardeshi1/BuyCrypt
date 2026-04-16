import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api';
import { Transaction, TransactionHistory } from '../../core/models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private apiService: ApiService) {}

  getUserTransactions(userId: string): Observable<TransactionHistory> {
    return this.apiService.get<TransactionHistory>(`transactions/user/${userId}`);
  }

  getTransaction(transactionId: string): Observable<Transaction> {
    return this.apiService.get<Transaction>(`transactions/${transactionId}`);
  }

  getWalletTransactions(walletId: string): Observable<Transaction[]> {
    return this.apiService.get<Transaction[]>(`transactions/wallet/${walletId}`);
  }
}
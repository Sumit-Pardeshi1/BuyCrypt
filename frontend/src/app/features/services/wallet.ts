import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api';
import { Wallet, WalletTransactionRequest } from '../../core/models/wallet.model';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  constructor(private apiService: ApiService) {}

  getWallet(userId: string): Observable<Wallet> {
    return this.apiService.get<Wallet>(`wallets/${userId}`);
  }

  createWallet(userId: string, currency: string = 'INR'): Observable<Wallet> {
    return this.apiService.post<Wallet>('wallets', { userId, currency });
  }

  deposit(request: WalletTransactionRequest): Observable<Wallet> {
    return this.apiService.post<Wallet>('wallets/deposit', request);
  }

  withdraw(request: WalletTransactionRequest): Observable<Wallet> {
    return this.apiService.post<Wallet>('wallets/withdraw', request);
  }
}
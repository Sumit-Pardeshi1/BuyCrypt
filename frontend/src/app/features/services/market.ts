import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api';
import { CoinListItem, CoinDetail } from '../../core/models/market.model';

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  constructor(private apiService: ApiService) {}

  getTopCoins(limit: number = 100): Observable<CoinListItem[]> {
    console.log('MarketService: Fetching top coins with limit:', limit); // Debug
    return this.apiService.get<CoinListItem[]>('market/top-coins', { limit });
  }

  getCoinDetail(coinId: string): Observable<CoinDetail> {
    console.log('MarketService: Fetching coin detail for:', coinId); // Debug
    return this.apiService.get<CoinDetail>(`market/coin/${coinId}`);
  }
}
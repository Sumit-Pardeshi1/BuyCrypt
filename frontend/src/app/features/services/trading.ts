import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api';
import { BuyAssetRequest, SellAssetRequest, TradeResponse } from '../../core/models/trading.model';

@Injectable({
  providedIn: 'root'
})
export class TradingService {
  constructor(private apiService: ApiService) {}

  buyCrypto(request: BuyAssetRequest): Observable<TradeResponse> {
    return this.apiService.post<TradeResponse>('trading/buy', request);
  }

  sellCrypto(request: SellAssetRequest): Observable<TradeResponse> {
    return this.apiService.post<TradeResponse>('trading/sell', request);
  }
}
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AssetHolding } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-holdings-list',
  standalone: true,
  templateUrl: './holdings-list.html',
  styleUrls: ['./holdings-list.scss'],
  imports: [CommonModule, RouterModule]
})
export class HoldingsListComponent {
  @Input() holdings: AssetHolding[] = [];

  constructor(private router: Router) {}

  viewCoinDetail(coinId: string): void {
    this.router.navigate(['/app/market/coin', coinId]);
  }

  sellAsset(holding: AssetHolding): void {
    this.router.navigate(['/app/trading/sell'], { 
      queryParams: { 
        coinId: holding.coinId,
        symbol: holding.symbol,
        available: holding.quantity 
      } 
    });
  }
}
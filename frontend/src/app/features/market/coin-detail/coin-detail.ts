import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MarketService } from '../../services/market';
import { CoinDetail } from '../../../core/models/market.model';

@Component({
  selector: 'app-coin-detail',
  standalone: true,
  templateUrl: './coin-detail.html',
  styleUrls: ['./coin-detail.scss'],
  imports: [CommonModule, RouterModule]
})
export class CoinDetailComponent implements OnInit {
  coin: CoinDetail | null = null;
  isLoading = true;
  errorMessage = '';
  coinId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private marketService: MarketService,
    private cdr: ChangeDetectorRef,
    
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.coinId = params['id'];
      this.loadCoinDetail();
    });
  }

  loadCoinDetail(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.marketService.getCoinDetail(this.coinId).subscribe({
      next: (data) => {
        this.coin = data;
        this.isLoading = false;
          this.cdr.detectChanges();
         
      },
      error: (error) => {
        this.errorMessage = 'Failed to load coin details';
        this.isLoading = false;
      }
    });
  }

  buyCoin(): void {
    if (this.coin) {
      this.router.navigate(['/app/trading/buy'], {
        queryParams: {
          coinId: this.coin.id,
          symbol: this.coin.symbol,
          name: this.coin.name
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/app/market']);
  }
}
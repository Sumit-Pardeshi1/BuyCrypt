import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { TradingService } from '../../services/trading';
import { WalletService } from '../../services/wallet';
import { MarketService } from '../../services/market';
import { AuthService } from '../../../core/services/auth';
import { Wallet } from '../../../core/models/wallet.model';
import { CoinListItem } from '../../../core/models/market.model';

@Component({
  selector: 'app-buy-crypto',
  standalone: true,
  templateUrl: './buy-crypto.html',
  styleUrls: ['./buy-crypto.scss'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class BuyCryptoComponent implements OnInit {
  wallet: Wallet | null = null;
  coins: CoinListItem[] = [];
  coinId = '';
  symbol = '';
  coinName = '';
  quantity = 0;
  currentPrice = 0;
  notes = '';
  
  isLoading = false;
  isLoadingCoins = false;
  errorMessage = '';
  successMessage = '';

  // Store query params to use after coins are loaded
  private queryParamCoinId: string | null = null;
  private queryParamSymbol: string | null = null;
  private queryParamName: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tradingService: TradingService,
    private walletService: WalletService,
    private marketService: MarketService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadWallet();
    this.loadQueryParams();
    this.loadCoins();
  }

  loadWallet(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.walletService.getWallet(user.userId).subscribe({
      next: (wallet) => {
        this.wallet = wallet;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Failed to load wallet';
      }
    });
  }

  loadCoins(): void {
    this.isLoadingCoins = true;
    // Fetch top 100 coins instead of just 10
    this.marketService.getTopCoins(100).subscribe({
      next: (coins) => {
        this.coins = coins;
        this.isLoadingCoins = false;
        
        // Now that coins are loaded, check if we have query params to pre-select
        if (this.queryParamCoinId) {
          this.coinId = this.queryParamCoinId;
          this.symbol = this.queryParamSymbol || '';
          this.coinName = this.queryParamName || '';
          this.loadCurrentPrice();
        }
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load coins:', error);
        this.errorMessage = 'Failed to load coin list';
        this.isLoadingCoins = false;
        this.cdr.detectChanges();
      }
    });
  }

  loadQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      const coinId = params['coinId'];
      const symbol = params['symbol'];
      const name = params['name'];
      
      if (coinId) {
        // Store the params to use after coins are loaded
        this.queryParamCoinId = coinId;
        this.queryParamSymbol = symbol || '';
        this.queryParamName = name || '';
        
        // If coins are already loaded, select the coin immediately
        if (this.coins.length > 0) {
          this.coinId = coinId;
          this.symbol = symbol || '';
          this.coinName = name || '';
          this.loadCurrentPrice();
        }
      }
    });
  }

  loadCurrentPrice(): void {
    if (!this.coinId) return;

    this.marketService.getCoinDetail(this.coinId).subscribe({
      next: (coin) => {
        this.currentPrice = coin.currentPrice;
        this.coinName = coin.name;
        this.symbol = coin.symbol;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Failed to load coin price';
      }
    });
  }

  get totalAmount(): number {
    return this.quantity * this.currentPrice;
  }

  get fees(): number {
    return this.totalAmount * 0.01;
  }

  get totalCost(): number {
    return this.totalAmount + this.fees;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.wallet) {
      this.errorMessage = 'Wallet not found';
      return;
    }

    if (!this.coinId || !this.quantity || this.quantity <= 0) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    if (this.wallet.balance < this.totalCost) {
      this.errorMessage = `Insufficient balance. You need ₹${this.totalCost.toFixed(2)} but have ₹${this.wallet.balance.toFixed(2)}`;
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.isLoading = true;

    this.tradingService.buyCrypto({
      userId: user.userId,
      walletId: this.wallet.walletId,
      coinId: this.coinId,
      symbol: this.symbol,
      coinName: this.coinName,
      quantity: this.quantity,
      notes: this.notes
    }).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = response.message;
        setTimeout(() => {
          this.router.navigate(['/app/dashboard']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Purchase failed';
      }
    });
  }
}
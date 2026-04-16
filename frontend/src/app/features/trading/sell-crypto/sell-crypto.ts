import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { TradingService } from '../../services/trading';
import { WalletService } from '../../services/wallet';
import { DashboardService } from '../../services/dashboard';
import { AuthService } from '../../../core/services/auth';
import { Wallet } from '../../../core/models/wallet.model';
import { AssetHolding } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-sell-crypto',
  standalone: true,
  templateUrl: './sell-crypto.html',
  styleUrls: ['./sell-crypto.scss'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class SellCryptoComponent implements OnInit {
  wallet: Wallet | null = null;
  holdings: AssetHolding[] = [];
  selectedHolding: AssetHolding | null = null;
  
  coinId = '';
  quantity = 0;
  currentPrice = 0;
  notes = '';
  
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Store query params to use after holdings are loaded
  private queryParamCoinId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tradingService: TradingService,
    private walletService: WalletService,
    private dashboardService: DashboardService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadWallet();
    this.loadQueryParams();
    this.loadHoldings();
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

  loadHoldings(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.isLoading = true;
    this.dashboardService.getDashboard(user.userId).subscribe({
      next: (dashboard) => {
        this.holdings = dashboard.holdings;
        this.isLoading = false;
        
        // Now that holdings are loaded, check if we have a query param to pre-select
        if (this.queryParamCoinId) {
          this.coinId = this.queryParamCoinId;
          this.onCoinSelect();
        }
        
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Failed to load holdings';
        this.isLoading = false;
      }
    });
  }

  loadQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      const coinId = params['coinId'];
      if (coinId) {
        // Store the coinId to use after holdings are loaded
        this.queryParamCoinId = coinId;
        
        //holdings are already loaded, select the coin immediately
        if (this.holdings.length > 0) {
          this.coinId = coinId;
          this.onCoinSelect();
        }
      }
    });
  }

  onCoinSelect(): void {
    this.selectedHolding = this.holdings.find(h => h.coinId === this.coinId) || null;
    if (this.selectedHolding) {
      this.currentPrice = this.selectedHolding.currentPrice;
      this.cdr.detectChanges();
    }
  }

  get totalAmount(): number {
    return this.quantity * this.currentPrice;
  }

  get fees(): number {
    return this.totalAmount * 0.01;
  }

  get netAmount(): number {
    return this.totalAmount - this.fees;
  }

  get profitLoss(): number {
    if (!this.selectedHolding) return 0;
    const costBasis = this.quantity * this.selectedHolding.avgBuyPrice;
    return this.totalAmount - costBasis;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.wallet || !this.selectedHolding) {
      this.errorMessage = 'Wallet or holding not found';
      return;
    }

    if (!this.coinId || !this.quantity || this.quantity <= 0) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    if (this.quantity > this.selectedHolding.quantity) {
      this.errorMessage = `You only have ${this.selectedHolding.quantity} ${this.selectedHolding.symbol}`;
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.isLoading = true;

    this.tradingService.sellCrypto({
      userId: user.userId,
      walletId: this.wallet.walletId,
      coinId: this.coinId,
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
        this.errorMessage = error.error?.message || 'Sale failed';
      }
    });
  }
}
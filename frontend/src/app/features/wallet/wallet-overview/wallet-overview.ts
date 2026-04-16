import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WalletService } from '../../services/wallet';
import { AuthService } from '../../../core/services/auth';
import { Wallet } from '../../../core/models/wallet.model';
import { CommonModule } from '@angular/common';      //  ngIf, number, date pipes
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-wallet-overview',
    standalone: true, 
  templateUrl: './wallet-overview.html',
  styleUrls: ['./wallet-overview.scss'],
   imports: [
    CommonModule,   // ✅ ngIf, number, date
    RouterModule    // ✅ routerLink
  ]
})
export class WalletOverviewComponent implements OnInit {
  wallet: Wallet | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private walletService: WalletService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadWallet();
  }

  loadWallet(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.errorMessage = 'User not found';
      this.isLoading = false;
      return;
    }

    this.walletService.getWallet(user.userId).subscribe({
      next: (wallet) => {
        this.wallet = wallet;
        this.isLoading = false;
         this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Failed to load wallet';
        this.isLoading = false;
      }
    });
  }

  refresh(): void {
    this.isLoading = true;
    this.loadWallet();
  }
}
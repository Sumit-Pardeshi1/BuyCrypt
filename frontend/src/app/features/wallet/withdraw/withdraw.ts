import { Component, OnInit } from '@angular/core';

import { WalletService } from '../../services/wallet';
import { AuthService } from '../../../core/services/auth';
import { Wallet } from '../../../core/models/wallet.model';
import { CommonModule } from '@angular/common';        //  ngIf, pipes
import { FormsModule } from '@angular/forms';          // ngModel, ngSubmit
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'app-withdraw',
    standalone: true, 
  templateUrl: './withdraw.html',
  styleUrls: ['./withdraw.scss'],
  imports: [
    CommonModule,   //  ngIf, number pipe
    FormsModule,    //  ngModel, ngSubmit
    RouterModule    //  routerLink, navigation
  ]
})
export class WithdrawComponent implements OnInit {
  wallet: Wallet | null = null;
  amount = 0;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private walletService: WalletService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWallet();
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
      },
      error: (error) => {
        this.errorMessage = 'Failed to load wallet';
      }
    });
  }

  quickAmount(percentage: number): void {
    if (this.wallet) {
      this.amount = this.wallet.balance * (percentage / 100);
    }
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.wallet) {
      this.errorMessage = 'Wallet not found';
      return;
    }

    if (!this.amount || this.amount <= 0) {
      this.errorMessage = 'Please enter a valid amount';
      return;
    }

    if (this.amount > this.wallet.balance) {
      this.errorMessage = `Insufficient balance. You have ₹${this.wallet.balance.toFixed(2)}`;
      return;
    }

    this.isLoading = true;

    this.walletService.withdraw({
      walletId: this.wallet.walletId,
      amount: this.amount
    }).subscribe({
      next: (updatedWallet) => {
        this.isLoading = false;
        this.wallet = updatedWallet;
        this.successMessage = `Successfully withdrew ₹${this.amount.toFixed(2)}`;
        this.amount = 0;
        
        setTimeout(() => {
         this.router.navigate(['/app/wallet']); 
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Withdrawal failed';
      }
    });
  }
}
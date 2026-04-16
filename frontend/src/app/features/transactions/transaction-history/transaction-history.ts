import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TransactionService } from '../../services/transaction';
import { AuthService } from '../../../core/services/auth';
import { TransactionHistory } from '../../../core/models/transaction.model';
import { CommonModule } from '@angular/common';        //  ngIf, ngFor, pipes, ngClass
import { RouterModule, Router } from '@angular/router';
@Component({
  selector: 'app-transaction-history',
    standalone: true,
  templateUrl: './transaction-history.html',
  styleUrls: ['./transaction-history.scss'],
  imports: [
    CommonModule,   //  ngIf, ngFor, number, date, uppercase, ngClass
    RouterModule    //  routerLink, navigation
  ]
})
export class TransactionHistoryComponent implements OnInit {
  transactionHistory: TransactionHistory | null = null;
  isLoading = true;
  errorMessage = '';
  filterType = 'ALL'; // ALL, BUY, SELL

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    this.transactionService.getUserTransactions(user.userId).subscribe({
      next: (data) => {
        this.transactionHistory = data;
        this.isLoading = false;
         this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Failed to load transactions';
        this.isLoading = false;
      }
    });
  }

  get filteredTransactions() {
    if (!this.transactionHistory) return [];
    
    if (this.filterType === 'ALL') {
      return this.transactionHistory.transactions;
    }
    
    return this.transactionHistory.transactions.filter(
      t => t.transactionType === this.filterType
    );
  }

  viewDetail(transactionId: string): void {
    this.router.navigate(['/transactions', transactionId]);
  }

  refresh(): void {
    this.loadTransactions();
  }
}
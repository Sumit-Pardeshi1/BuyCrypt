import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from '../../services/transaction';
import { Transaction } from '../../../core/models/transaction.model';
import { CommonModule } from '@angular/common';        // ngIf, pipes, ngClass
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-transaction-detail', 
   standalone: true,
  templateUrl: './transaction-detail.html',
  styleUrls: ['./transaction-detail.scss'],
   imports: [
    CommonModule,   //  ngIf, number, date, uppercase, ngClass
    RouterModule    //  routing, navigation
  ]
})
export class TransactionDetailComponent implements OnInit {
  transaction: Transaction | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const transactionId = params['id'];
      this.loadTransaction(transactionId);
    });
  }

  loadTransaction(transactionId: string): void {
    this.isLoading = true;
    this.transactionService.getTransaction(transactionId).subscribe({
      next: (data) => {
        this.transaction = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Transaction not found';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/transactions']);
  }
}
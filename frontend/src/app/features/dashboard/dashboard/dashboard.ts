import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DashboardService } from '../../services/dashboard';
import { AuthService } from '../../../core/services/auth';
import { DashboardResponse } from '../../../core/models/dashboard.model';
import { PortfolioSummaryComponent } from '../portfolio-summary/portfolio-summary';
import { HoldingsListComponent } from '../holdings-list/holdings-list';
import { PortfolioChartsComponent } from '../portfolio-charts/portfolio-charts';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [
    CommonModule,
    RouterModule,
    PortfolioSummaryComponent,
    HoldingsListComponent,
    PortfolioChartsComponent
  ]
})
export class DashboardComponent implements OnInit {
  dashboard: DashboardResponse | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef  //  Add this
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    const user = this.authService.getCurrentUser();
    
    if (!user) {
      this.errorMessage = 'User not found. Please login again.';
      this.isLoading = false;
      this.cdr.detectChanges(); //  Force change detection
      return;
    }

    console.log('Loading dashboard for user:', user.userId);

    this.isLoading = true;
    this.errorMessage = '';
    
    this.dashboardService.getDashboard(user.userId).subscribe({
      next: (data) => {
        console.log('Dashboard data received:', data);
        this.dashboard = data;
        this.isLoading = false;
        this.cdr.detectChanges(); //  Force UI update
      },
      error: (error) => {
        console.error('Dashboard error:', error);
        this.errorMessage = error.error?.message || 'Failed to load dashboard';
        this.isLoading = false;
        this.cdr.detectChanges(); //  Force UI update
      }
    });
  }

  refresh(): void {
    this.loadDashboard();
  }
}
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardResponse } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-portfolio-summary',
  standalone: true,
  templateUrl: './portfolio-summary.html',
  styleUrls: ['./portfolio-summary.scss'],
  imports: [CommonModule, RouterModule]
})
export class PortfolioSummaryComponent {
  @Input() dashboard: DashboardResponse | null = null;
}
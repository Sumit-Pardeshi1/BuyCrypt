import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;
  tradingOpen = false;
  walletOpen = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleTrading(event: Event): void {
    event.preventDefault();
    this.tradingOpen = !this.tradingOpen;
  }

  toggleWallet(event: Event): void {
    event.preventDefault();
    this.walletOpen = !this.walletOpen;
  }
}
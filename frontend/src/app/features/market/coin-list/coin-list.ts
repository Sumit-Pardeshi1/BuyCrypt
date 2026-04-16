import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MarketService } from '../../services/market';
import { FavoriteService } from '../../services/favorite';
import { AuthService } from '../../../core/services/auth';
import { CoinListItem } from '../../../core/models/market.model';

@Component({
  selector: 'app-coin-list',
  standalone: true,
  templateUrl: './coin-list.html',
  styleUrls: ['./coin-list.scss'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class CoinListComponent implements OnInit {
  coins: CoinListItem[] = [];
  filteredCoins: CoinListItem[] = [];
  favoriteCoinIds: Set<string> = new Set(); // ✅ Track favorite coins
  isLoading = true;
  searchTerm = '';
  errorMessage = '';

  constructor(
    private marketService: MarketService,
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCoins();
    this.loadFavorites(); // ✅ Load user's favorites
  }

  loadCoins(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.marketService.getTopCoins(100).subscribe({
      next: (data) => {
        this.coins = data;
        this.filteredCoins = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Failed to load market data';
        this.isLoading = false;
      }
    });
  }

  // ✅ Load user's favorites
  loadFavorites(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.favoriteService.getUserFavorites(user.userId).subscribe({
      next: (data) => {
        this.favoriteCoinIds = new Set(data.favorites.map(f => f.coinId));
        this.cdr.detectChanges();
      },
      error: () => {
        // Silently fail, not critical
      }
    });
  }

  // ✅ Check if coin is in favorites
  isFavorite(coinId: string): boolean {
    return this.favoriteCoinIds.has(coinId);
  }

  // ✅ Toggle favorite status
  toggleFavorite(coin: CoinListItem, event: Event): void {
    event.stopPropagation(); // Prevent row click
    
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    if (this.isFavorite(coin.id)) {
      // Remove from favorites
      this.removeFavorite(coin);
    } else {
      // Add to favorites
      this.addToFavorites(coin);
    }
  }

  addToFavorites(coin: CoinListItem): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.favoriteService.addFavorite({
      userId: user.userId,
      coinId: coin.id,
      symbol: coin.symbol,
      coinName: coin.name
    }).subscribe({
      next: () => {
        this.favoriteCoinIds.add(coin.id);
        this.cdr.detectChanges();
      },
      error: (error) => {
        alert(error.error?.message || 'Failed to add to favorites');
      }
    });
  }

  removeFavorite(coin: CoinListItem): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    // Find the favorite ID
    this.favoriteService.getUserFavorites(user.userId).subscribe({
      next: (data) => {
        const favorite = data.favorites.find(f => f.coinId === coin.id);
        if (favorite) {
          this.favoriteService.removeFavorite(favorite.favoriteId).subscribe({
            next: () => {
              this.favoriteCoinIds.delete(coin.id);
              this.cdr.detectChanges();
            },
            error: () => {
              alert('Failed to remove from favorites');
            }
          });
        }
      }
    });
  }

  filterCoins(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredCoins = this.coins.filter(coin => 
      coin.name.toLowerCase().includes(term) || 
      coin.symbol.toLowerCase().includes(term)
    );
  }

  viewCoinDetail(coinId: string): void {
    this.router.navigate(['/app/market/coin', coinId]);
  }

  buyCoin(coin: CoinListItem): void {
    this.router.navigate(['/app/trading/buy'], {
      queryParams: {
        coinId: coin.id,
        symbol: coin.symbol,
        name: coin.name
      }
    });
  }

  refresh(): void {
    this.loadCoins();
    this.loadFavorites();
  }
}
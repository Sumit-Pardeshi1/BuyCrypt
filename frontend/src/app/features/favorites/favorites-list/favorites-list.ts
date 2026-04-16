import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FavoriteService } from '../../services/favorite';
import { AuthService } from '../../../core/services/auth';
import { FavoriteList } from '../../../core/models/favorite.model';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  templateUrl: './favorites-list.html',
  styleUrls: ['./favorites-list.scss'],
  imports: [
    CommonModule,   
    RouterModule    
  ]
})
export class FavoritesListComponent implements OnInit {
  favoriteList: FavoriteList | null = null;
  isLoading = true;
  errorMessage = '';
  removingFavorites = new Set<string>(); // ✅ Track favorites being removed

  constructor(
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    
    this.favoriteService.getUserFavorites(user.userId).subscribe({
      next: (data) => {
        this.favoriteList = data;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.errorMessage = 'Failed to load favorites';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ✅ Smooth removal with optimistic UI update
  removeFavorite(favoriteId: string, coinName: string): void {
    // Prevent double-clicking
    if (this.removingFavorites.has(favoriteId)) {
      return;
    }

    this.removingFavorites.add(favoriteId);

    // ✅ Optimistic UI update - remove immediately for smooth UX
    if (this.favoriteList) {
      const originalFavorites = [...this.favoriteList.favorites];
      const originalCount = this.favoriteList.totalFavorites;

      // Update UI immediately
      this.favoriteList.favorites = this.favoriteList.favorites.filter(
        f => f.favoriteId !== favoriteId
      );
      this.favoriteList.totalFavorites--;
      this.cdr.detectChanges();

      // Call backend
      this.favoriteService.removeFavorite(favoriteId).subscribe({
        next: () => {
          // Success - keep the UI as is
          this.removingFavorites.delete(favoriteId);
          console.log(`${coinName} removed from favorites`);
        },
        error: (error) => {
          // Revert on error
          this.removingFavorites.delete(favoriteId);
          
          if (this.favoriteList) {
            this.favoriteList.favorites = originalFavorites;
            this.favoriteList.totalFavorites = originalCount;
            this.cdr.detectChanges();
          }
          
          alert(`Failed to remove ${coinName} from favorites. Please try again.`);
          console.error('Remove favorite error:', error);
        }
      });
    }
  }

  // ✅ Check if favorite is being removed (for loading state in UI)
  isRemoving(favoriteId: string): boolean {
    return this.removingFavorites.has(favoriteId);
  }

  viewCoinDetail(coinId: string): void {
    this.router.navigate(['/app/market/coin', coinId]);
  }

  buyCoin(coinId: string, symbol: string, coinName: string): void {
    this.router.navigate(['/app/trading/buy'], {
      queryParams: { coinId, symbol, name: coinName }
    });
  }

  refresh(): void {
    this.loadFavorites();
  }
}
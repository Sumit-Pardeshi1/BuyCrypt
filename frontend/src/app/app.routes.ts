import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth-guard';

// Layout
import { MainLayoutComponent } from './core/layout/main-layout/main-layout';

// Auth
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';

// Dashboard
import { DashboardComponent } from './features/dashboard/dashboard/dashboard';

// Market
import { CoinListComponent } from './features/market/coin-list/coin-list';
import { CoinDetailComponent } from './features/market/coin-detail/coin-detail';

// Trading
import { BuyCryptoComponent } from './features/trading/buy-crypto/buy-crypto';
import { SellCryptoComponent } from './features/trading/sell-crypto/sell-crypto';

// Wallet
import { WalletOverviewComponent } from './features/wallet/wallet-overview/wallet-overview';
import { DepositComponent } from './features/wallet/deposit/deposit';
import { WithdrawComponent } from './features/wallet/withdraw/withdraw';

// Transactions
import { TransactionHistoryComponent } from './features/transactions/transaction-history/transaction-history';
import { TransactionDetailComponent } from './features/transactions/transaction-detail/transaction-detail';

// Favorites
import { FavoritesListComponent } from './features/favorites/favorites-list/favorites-list';

export const routes: Routes = [
  // Default route - redirect to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

 // Protected layout
  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },

      { path: 'market', component: CoinListComponent },
      { path: 'market/coin/:id', component: CoinDetailComponent },

      { path: 'trading/buy', component: BuyCryptoComponent },
      { path: 'trading/sell', component: SellCryptoComponent },

      { path: 'wallet', component: WalletOverviewComponent },
      { path: 'wallet/deposit', component: DepositComponent },
      { path: 'wallet/withdraw', component: WithdrawComponent },

      { path: 'transactions', component: TransactionHistoryComponent },
      { path: 'transactions/:id', component: TransactionDetailComponent },

      { path: 'favorites', component: FavoritesListComponent },
    ]
  },

  // Fallback route
  { path: '**', redirectTo: 'login' }
];
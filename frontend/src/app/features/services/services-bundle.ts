// ============================================================
// jwt.interceptor.ts — src/app/interceptors/
// Automatically adds the Bearer token to every API call
// ============================================================
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router, CanActivate } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.token;

    // Clone request and add Authorization header if token exists
    const modified = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    return next.handle(modified).pipe(
      catchError((err: HttpErrorResponse) => {
        // Auto-logout on 401 Unauthorized
        if (err.status === 401) {
          this.auth.logout();
          this.router.navigate(['/login']);
        }
        return throwError(() => err);
      })
    );
  }
}

// ============================================================
// auth.guard.ts — src/app/guards/
// Protects routes that require login
// ============================================================

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.isLoggedIn) return true;
    this.router.navigate(['/login']);
    return false;
  }
}

// ============================================================
// notification.service.ts — src/app/services/
// Global toast notification system
// ============================================================

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private toasts$ = new Subject<Toast>();
  notifications$ = this.toasts$.asObservable();
  private counter = 0;

  success(message: string) { this.show(message, 'success', '✓'); }
  error(message: string)   { this.show(message, 'error',   '✕'); }
  info(message: string)    { this.show(message, 'info',    'ℹ'); }

  private show(message: string, type: Toast['type'], icon: string) {
    const toast: Toast = { id: ++this.counter, message, type, icon };
    this.toasts$.next(toast);
  }
}

// ============================================================
// crypto.service.ts — src/app/services/
// All API calls to the backend
// ============================================================

@Injectable({ providedIn: 'root' })
export class CryptoService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ── Market ───────────────────────────────────────────────────
  getTopCoins(limit = 100): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/market/top-coins?limit=${limit}`);
  }
  getCoinDetail(coinId: string): Observable<any> {
    return this.http.get(`${this.api}/market/coin/${coinId}`);
  }

  // ── Dashboard ────────────────────────────────────────────────
  getDashboard(userId: string): Observable<any> {
    return this.http.get(`${this.api}/dashboard/${userId}`);
  }

  // ── Wallet ───────────────────────────────────────────────────
  getWallet(userId: string): Observable<any> {
    return this.http.get(`${this.api}/wallets/${userId}`);
  }
  deposit(walletId: string, amount: number): Observable<any> {
    return this.http.post(`${this.api}/wallets/deposit`, { walletId, amount });
  }
  withdraw(walletId: string, amount: number): Observable<any> {
    return this.http.post(`${this.api}/wallets/withdraw`, { walletId, amount });
  }

  // ── Trading ──────────────────────────────────────────────────
  buyCrypto(body: any): Observable<any> {
    return this.http.post(`${this.api}/trading/buy`, body);
  }
  sellCrypto(body: any): Observable<any> {
    return this.http.post(`${this.api}/trading/sell`, body);
  }

  // ── Transactions ─────────────────────────────────────────────
  getTransactions(userId: string): Observable<any> {
    return this.http.get(`${this.api}/transactions/user/${userId}`);
  }

  // ── Favorites ────────────────────────────────────────────────
  getFavorites(userId: string): Observable<any> {
    return this.http.get(`${this.api}/favorites/user/${userId}`);
  }
  addFavorite(body: any): Observable<any> {
    return this.http.post(`${this.api}/favorites`, body);
  }
  removeFavorite(favoriteId: string): Observable<any> {
    return this.http.delete(`${this.api}/favorites/${favoriteId}`);
  }
}

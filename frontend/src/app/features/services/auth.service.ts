// auth.service.ts — src/app/services/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
  token: string;
  userId: string;
  fullName: string;
  email: string;
  walletId: string;
  walletBalance: number;
  message: string;
}

export interface CurrentUser {
  token: string;
  userId: string;
  fullName: string;
  email: string;
  walletId: string;
  walletBalance: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly TOKEN_KEY = 'bc_token';
  private readonly USER_KEY  = 'bc_user';

  // Reactive user state — components subscribe to this
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(this.loadFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  // ── Register ────────────────────────────────────────────────
  register(data: { fullName: string; email: string; password: string; phoneNumber?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data)
      .pipe(tap(res => this.saveSession(res)));
  }

  // ── Login ───────────────────────────────────────────────────
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap(res => this.saveSession(res)));
  }

  // ── Logout ──────────────────────────────────────────────────
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // ── Helpers ─────────────────────────────────────────────────
  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get currentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  updateWalletBalance(newBalance: number): void {
    const user = this.currentUser;
    if (user) {
      const updated = { ...user, walletBalance: newBalance };
      localStorage.setItem(this.USER_KEY, JSON.stringify(updated));
      this.currentUserSubject.next(updated);
    }
  }

  private saveSession(res: AuthResponse): void {
    const user: CurrentUser = {
      token: res.token,
      userId: res.userId,
      fullName: res.fullName,
      email: res.email,
      walletId: res.walletId,
      walletBalance: res.walletBalance
    };
    localStorage.setItem(this.TOKEN_KEY, res.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private loadFromStorage(): CurrentUser | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}

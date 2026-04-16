import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
    this.loadUserFromStorage();
  }

  register(userData: {
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    preferredCurrency?: string;
  }): Observable<any> {
    return this.apiService.post<any>('auth/register', {
      fullName: userData.fullName,
      email: userData.email,
      password: userData.password,
      phoneNumber: userData.phoneNumber || ''
    }).pipe(
      tap(response => {
        this.handleAuthResponse(response);
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.apiService.post<any>('auth/login', {
      email: credentials.email,
      password: credentials.password
    }).pipe(
      tap(response => {
        this.handleAuthResponse(response);
      })
    );
  }

  logout(): void {
    Preferences.remove({ key: 'token' });
    Preferences.remove({ key: 'currentUser' });
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('currentUser');
    return !!token && !!user;
  }

  private async handleAuthResponse(response: any): Promise<void> {
    if (response && response.token) {
      // Save to both localStorage AND Capacitor Preferences
      localStorage.setItem('token', response.token);
      localStorage.setItem('currentUser', JSON.stringify({
        userId: response.userId,
        fullName: response.fullName,
        email: response.email,
        preferredCurrency: 'INR',
        createdAt: new Date()
      }));

      await Preferences.set({ key: 'token', value: response.token });
      await Preferences.set({ key: 'currentUser', value: JSON.stringify({
        userId: response.userId,
        fullName: response.fullName,
        email: response.email,
        preferredCurrency: 'INR',
        createdAt: new Date()
      })});

      const user: User = {
        userId: response.userId,
        fullName: response.fullName,
        email: response.email,
        preferredCurrency: 'INR',
        createdAt: new Date()
      };

      this.currentUserSubject.next(user);
    }
  }

  private async loadUserFromStorage(): Promise<void> {
    try {
      // Try Capacitor Preferences first
      const { value: token } = await Preferences.get({ key: 'token' });
      const { value: userJson } = await Preferences.get({ key: 'currentUser' });

      if (token && userJson) {
        // Sync to localStorage too
        localStorage.setItem('token', token);
        localStorage.setItem('currentUser', userJson);
        const user = JSON.parse(userJson) as User;
        this.currentUserSubject.next(user);
        return;
      }

      // Fallback to localStorage
      const localToken = localStorage.getItem('token');
      const localUser = localStorage.getItem('currentUser');
      if (localToken && localUser) {
        const user = JSON.parse(localUser) as User;
        this.currentUserSubject.next(user);
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
    }
  }
}
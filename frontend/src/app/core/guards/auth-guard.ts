import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { Preferences } from '@capacitor/preferences';

export const AuthGuard = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check Capacitor Preferences directly
  const { value: token } = await Preferences.get({ key: 'token' });
  const { value: user } = await Preferences.get({ key: 'currentUser' });

  if (token && user) {
    // Sync to localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', user);
    return true;
  }

  // Fallback check localStorage
  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
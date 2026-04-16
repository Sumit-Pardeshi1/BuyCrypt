// ============================================================
// FILE TO REPLACE:
// src/app/features/auth/register/register.ts
//
// KEY FIX: Removed walletService.createWallet() call.
// The backend AuthController.register already creates the wallet.
// Calling it twice was causing an error that blocked navigation.
// ============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RegisterComponent {
  fullName = '';
  email = '';
  phoneNumber = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';

    // Validate required fields
    if (!this.fullName || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all required fields.';
      return;
    }

    // Validate password length
    if (this.password.length < 8) {
      this.errorMessage = 'Password must be at least 8 characters.';
      return;
    }

    // Validate passwords match
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.isLoading = true;
    console.log('[Register] Registering:', this.email);

    // Call auth/register — backend creates user + wallet in one call
    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      password: this.password,
      phoneNumber: this.phoneNumber || '',
      preferredCurrency: 'INR'
    }).subscribe({
      next: (response) => {
        console.log('[Register] Success:', response?.message);
        this.isLoading = false;
        // Navigate directly to dashboard — user is already logged in
        this.router.navigate(['/app/dashboard']);
      },
      error: (error) => {
        console.error('[Register] Error:', error);
        this.isLoading = false;

        if (error.status === 409) {
          this.errorMessage = 'An account with this email already exists. Please login instead.';
        } else if (error.status === 400) {
          this.errorMessage = error.error?.message || 'Invalid registration details. Check all fields.';
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot reach server. Make sure the backend is running on port 5130.';
        } else {
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      }
    });
  }
}

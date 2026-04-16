// ============================================================
// FILE TO REPLACE:
// src/app/features/auth/login/login.ts
// ============================================================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    // Basic validation
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    console.log('[Login] Attempting login for:', this.email);

    // Pass BOTH email and password to authService.login()
    this.authService.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (response) => {
        console.log('[Login] Success:', response?.message);
        this.isLoading = false;
        // Navigate to dashboard after successful login
        this.router.navigate(['/app/dashboard']);
      },
      error: (error) => {
        console.error('[Login] Error:', error);
        this.isLoading = false;

        // Show user-friendly error messages
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password. Please try again.';
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot reach server. Make sure the backend is running on port 5130.';
        } else {
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
      }
    });
  }
}

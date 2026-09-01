import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../data/services/auth';

@Component({
  selector: 'app-customer-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './customer-auth.html',
  styleUrl: './customer-auth.css'
})
export class CustomerAuth {
  auth = inject(Auth);
  
  isLoginMode = true;
  username = '';
  password = '';
  errorMessage: string | null = null;
  isLoading = false;

  setMode(isLogin: boolean) {
    this.isLoginMode = isLogin;
    this.errorMessage = null;
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = null;
  }

  onSubmit() {
    if (!this.username.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    if (this.isLoginMode) {
      this.auth.login({ username: this.username, password: this.password }, '/').subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = 'Invalid username or password. Please verify your credentials.';
        }
      });
    } else {
      this.auth.signup({ username: this.username, password: this.password }, '/').subscribe({
        next: () => {
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err?.error || 'Registration unsuccessful. That username may already be reserved.';
        }
      });
    }
  }
}


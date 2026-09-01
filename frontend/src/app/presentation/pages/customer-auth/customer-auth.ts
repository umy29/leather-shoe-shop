import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Auth } from '../../../data/services/auth';

@Component({
  selector: 'app-customer-auth',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './customer-auth.html',
  styleUrl: './customer-auth.css'
})
export class CustomerAuth {
  auth = inject(Auth);
  
  isLoginMode = true;
  username = '';
  password = '';

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.isLoginMode) {
      this.auth.login({ username: this.username, password: this.password }, '/').subscribe({
        error: (err) => alert('Login failed. Check credentials.')
      });
    } else {
      this.auth.signup({ username: this.username, password: this.password }, '/').subscribe({
        error: (err) => alert('Signup failed. Username might be taken.')
      });
    }
  }
}

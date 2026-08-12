import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLogin {
  auth = inject(Auth);
  
  username = '';
  password = '';

  onSubmit() {
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      error: (err) => alert('Login failed. Check credentials.')
    });
  }
}

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = 'http://localhost:5277/api/auth';
  isAuthenticated = signal<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: any) {
    return this.http.post<{token: string}>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        if(res.token) {
          localStorage.setItem('token', res.token);
          this.isAuthenticated.set(true);
          this.router.navigate(['/admin']);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}

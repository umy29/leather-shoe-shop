import { Component, inject, Inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../data/services/auth';
import { DOCUMENT } from '@angular/common';
import { CartService } from '../../../data/services/cart';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  auth = inject(Auth);
  router = inject(Router);
  document = inject(DOCUMENT);
  cartService = inject(CartService);
  isLightMode = false;

  logout() {
    this.auth.logout();
  }

  get showAdminLinks() {
    return this.auth.isAuthenticated() && this.router.url.startsWith('/admin');
  }

  get showCart() {
    return !this.router.url.startsWith('/admin') && !this.router.url.startsWith('/login');
  }

  toggleTheme() {
    this.isLightMode = !this.isLightMode;
    if (this.isLightMode) {
      this.document.body.classList.add('light-mode');
    } else {
      this.document.body.classList.remove('light-mode');
    }
  }
}

import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { AdminLogin } from './pages/admin-login/admin-login';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { authGuard } from './guards/auth.guard';

import { Checkout } from './pages/checkout/checkout';
import { OrderSuccess } from './pages/order-success/order-success';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: AdminLogin },
  { path: 'checkout', component: Checkout },
  { path: 'order-success', component: OrderSuccess },
  { path: 'admin', component: AdminDashboard, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];

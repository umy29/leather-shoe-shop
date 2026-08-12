import { Routes } from '@angular/router';
import { Home } from './presentation/pages/home/home';
import { AdminLogin } from './presentation/pages/admin-login/admin-login';
import { AdminDashboard } from './presentation/pages/admin-dashboard/admin-dashboard';
import { authGuard } from './core/guards/auth.guard';
import { AdminOrders } from './presentation/pages/admin-orders/admin-orders';
import { Checkout } from './presentation/pages/checkout/checkout';
import { OrderSuccess } from './presentation/pages/order-success/order-success';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: AdminLogin },
  { path: 'checkout', component: Checkout },
  { path: 'order-success', component: OrderSuccess },
  { path: 'admin', component: AdminDashboard, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];

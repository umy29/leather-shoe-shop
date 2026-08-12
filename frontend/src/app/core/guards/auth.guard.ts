import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../data/services/auth';

export const authGuard = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  if (auth.hasToken()) {
    return true;
  }

  return router.parseUrl('/login');
};

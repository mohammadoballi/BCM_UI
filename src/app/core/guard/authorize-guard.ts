import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authorizeGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);

  if (!token) {
    router.navigate(['/login']); 
    return false;
  }

  return true; 
};

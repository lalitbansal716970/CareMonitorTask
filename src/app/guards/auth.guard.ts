
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CookieService } from '../services/cookie.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const cookieService = inject(CookieService);

  if (cookieService.get('auth_token')) {
    if(!authService.currentUser()){
        // Edge case: cookie exists but signal is null (e.g. after refresh)
        // Let's re-initialize from cookie
         const userJson = cookieService.get('user_info');
         if(userJson) {
           authService.currentUser.set(JSON.parse(userJson));
         }
    }
    return true;
  }
  
  return router.parseUrl('/login');
};

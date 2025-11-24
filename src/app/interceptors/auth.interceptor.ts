import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { BASE_API_URL } from '../config/api.config';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getAuthToken();

  // Clone the request and add the authorization header if the request is to our API
  // FIX: Corrected typo from BASE_A_API_URL to BASE_API_URL
  if (authToken && req.url.startsWith(BASE_API_URL)) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });
    return next(authReq);
  }

  // Send the original request
  return next(req);
};

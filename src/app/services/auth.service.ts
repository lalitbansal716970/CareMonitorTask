
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { CookiesService } from './cookie.service';
import { User } from '../models/user.model';
import { API_ENDPOINTS } from '../config/api.config';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_INFO_KEY = 'user_info';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private cookieService = inject(CookiesService);

  currentUser = signal<User | null>(this.getUserFromCookie());
  isAuthenticated = computed(() => !!this.currentUser());

  login(credentials: { email: string; password: string }): Observable<boolean> {
    return this.http.post<{ token: string; user: User }>(API_ENDPOINTS.login, credentials).pipe(
      tap(response => {
        this.cookieService.set(AUTH_TOKEN_KEY, response.token);
        this.cookieService.set(USER_INFO_KEY, JSON.stringify(response.user));
        this.currentUser.set(response.user);
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): void {
    this.cookieService.delete(AUTH_TOKEN_KEY);
    this.cookieService.delete(USER_INFO_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  private getUserFromCookie(): User | null {
    const userJson = this.cookieService.get(USER_INFO_KEY);
    if(userJson) {
        try {
            return JSON.parse(userJson) as User;
        } catch(e) {
            return null;
        }
    }
    return null;
  }

  getAuthToken(): string | null {
    return this.cookieService.get(AUTH_TOKEN_KEY);
  }
}

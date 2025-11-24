
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Item } from '../models/item.model';
import { API_ENDPOINTS } from '../config/api.config';

const MOCK_TOKEN = '_mock_jwt_token_12345_';

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  // --- LOGIN ENDPOINT ---
  if (req.url === API_ENDPOINTS.login && req.method === 'POST') {
    // FIX: Add type assertion to req.body to inform TypeScript about its shape.
    const { email, password } = req.body as { email: string; password: string };
    if (email === 'test@example.com' && password === 'password') {
      const body = {
        token: MOCK_TOKEN,
        user: { email: 'test@example.com' },
      };
      return of(new HttpResponse({ status: 200, body })).pipe(delay(1000));
    } else {
      return throwError(() => new HttpResponse({ status: 401, statusText: 'Invalid credentials' })).pipe(delay(1000));
    }
  }

  // --- ITEMS ENDPOINT ---
  if (req.url === API_ENDPOINTS.items && req.method === 'GET') {
    const authToken = req.headers.get('Authorization');

    if (authToken === `Bearer ${MOCK_TOKEN}`) {
      const items: Item[] = [
        { id: 1, name: 'Angular Signal', description: 'A new reactive primitive for managing state.' },
        { id: 2, name: 'Standalone Components', description: 'Simpler way to build Angular applications without NgModules.' },
        { id: 3, name: 'Zoneless Change Detection', description: 'Improves performance by removing Zone.js dependency.' },
        { id: 4, name: 'Control Flow Syntax', description: 'New built-in syntax for @if, @for, and @switch.' },
        { id: 5, name: 'View Transitions API', description: 'Create smooth transitions between routes.' },
      ];
      return of(new HttpResponse({ status: 200, body: items })).pipe(delay(1500));
    } else {
      return throwError(() => new HttpResponse({ status: 401, statusText: 'Unauthorized' })).pipe(delay(500));
    }
  }

  // Pass through other requests
  return next(req);
};
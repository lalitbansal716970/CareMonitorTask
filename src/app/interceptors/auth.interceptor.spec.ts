// /// <reference types="jasmine" />

// import { TestBed } from '@angular/core/testing';
// import { HttpClient, HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { authInterceptor } from './auth.interceptor';
// import { AuthService } from '../services/auth.service';
// import { BASE_API_URL } from '../config/api.config';

// describe('authInterceptor', () => {
//   let http: HttpClient;
//   let httpTestingController: HttpTestingController;
//   let authServiceSpy: jasmine.SpyObj<AuthService>;

//   const setup = (token: string | null) => {
//     const authSpy = jasmine.createSpyObj('AuthService', ['getAuthToken']);
//     authSpy.getAuthToken.and.returnValue(token);

//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule],
//       providers: [
//         provideHttpClient(withInterceptors([authInterceptor])),
//         { provide: AuthService, useValue: authSpy },
//       ],
//     });

//     http = TestBed.inject(HttpClient);
//     httpTestingController = TestBed.inject(HttpTestingController);
//     authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
//   };

//   afterEach(() => {
//     httpTestingController.verify();
//   });

//   it('should add an Authorization header for API calls when a token is present', () => {
//     const token = 'my-auth-token';
//     setup(token);

//     http.get(`${BASE_API_URL}/test`).subscribe();

//     const req = httpTestingController.expectOne(`${BASE_API_URL}/test`);
//     expect(req.request.headers.has('Authorization')).toBe(true);
//     expect(req.request.headers.get('Authorization')).toBe(`Bearer ${token}`);

//     req.flush({});
//   });

//   it('should not add an Authorization header if no token is present', () => {
//     setup(null);

//     http.get(`${BASE_API_URL}/test`).subscribe();

//     const req = httpTestingController.expectOne(`${BASE_API_URL}/test`);
//     expect(req.request.headers.has('Authorization')).toBe(false);

//     req.flush({});
//   });

//   it('should not add an Authorization header for non-API calls', () => {
//     const token = 'my-auth-token';
//     setup(token);

//     const nonApiUrl = 'https://other.domain.com/api/data';
//     http.get(nonApiUrl).subscribe();

//     const req = httpTestingController.expectOne(nonApiUrl);
//     expect(req.request.headers.has('Authorization')).toBe(false);

//     req.flush({});
//   });
// });

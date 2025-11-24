/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { API_ENDPOINTS } from '../config/api.config';
import { User } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;
  let cookieServiceSpy: jasmine.SpyObj<CookieService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const cookieSpy = jasmine.createSpyObj('CookieService', ['get', 'set', 'delete']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: CookieService, useValue: cookieSpy },
        { provide: Router, useValue: routerSpyObj },
      ],
    });

    service = TestBed.inject(AuthService);

    httpTestingController = TestBed.inject(HttpTestingController);
    cookieServiceSpy = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully and update state', (done) => {
    const mockUser: User = { email: 'test@example.com' };
    const mockResponse = { token: 'mock_token', user: mockUser };
    const credentials = { email: 'test@example.com', password: 'password' };

    service.login(credentials).subscribe(success => {
      expect(success).toBe(true);
      expect(service.currentUser()).toEqual(mockUser);
      expect(service.isAuthenticated()).toBe(true);
      expect(cookieServiceSpy.set).toHaveBeenCalledWith('auth_token', 'mock_token');
      expect(cookieServiceSpy.set).toHaveBeenCalledWith('user_info', JSON.stringify(mockUser));
      done();
    });

    const req = httpTestingController.expectOne(API_ENDPOINTS.login);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should handle login failure', (done) => {
    const credentials = { email: 'wrong@example.com', password: 'wrong' };

    service.login(credentials).subscribe(success => {
      expect(success).toBe(false);
      expect(service.currentUser()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
      expect(cookieServiceSpy.set).not.toHaveBeenCalled();
      done();
    });

    const req = httpTestingController.expectOne(API_ENDPOINTS.login);
    req.flush('Invalid credentials', { status: 401, statusText: 'Unauthorized' });
  });

  it('should logout and clear state', () => {
    // Set up a logged-in state
    const mockUser: User = { email: 'test@example.com' };
    service.currentUser.set(mockUser);

    service.logout();

    expect(service.currentUser()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(cookieServiceSpy.delete).toHaveBeenCalledWith('auth_token');
    expect(cookieServiceSpy.delete).toHaveBeenCalledWith('user_info');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should get auth token from cookie service', () => {
    cookieServiceSpy.get.and.returnValue('some_token');
    expect(service.getAuthToken()).toBe('some_token');
    expect(cookieServiceSpy.get).toHaveBeenCalledWith('auth_token');
  });

  // it('should initialize user from cookie', () => {
  //   const mockUser = { email: 'cookie@user.com' };
  //   cookieServiceSpy.get.and.returnValue(JSON.stringify(mockUser));

  //   // Re-create service to test constructor logic
  //   service = TestBed.inject(AuthService);

  //   expect(service.currentUser()).toEqual(mockUser);
  // });
});

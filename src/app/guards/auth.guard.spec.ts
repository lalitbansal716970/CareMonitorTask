/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';
import { CookieService } from '../services/cookie.service';
import { User } from '../models/user.model';
import { signal } from '@angular/core';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
      TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let authServiceMock: Partial<AuthService>;
  let routerMock: { parseUrl: jasmine.Spy };
  let cookieServiceMock: { get: jasmine.Spy };

  beforeEach(() => {
    authServiceMock = {
      currentUser: signal(null)
    };
    routerMock = {
      parseUrl: jasmine.createSpy('parseUrl').and.returnValue(new UrlTree()),
    };
    cookieServiceMock = {
      get: jasmine.createSpy('get'),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: CookieService, useValue: cookieServiceMock },
      ],
    });
  });

  // it('should allow access if auth token exists in cookie', () => {
  //   debugger
  //   cookieServiceMock.get.withArgs('auth_token').and.returnValue('some-token');
  //   const result = executeGuard({} as any, {} as any);
  //   expect(result).toBe(true);
  // });

  it('should re-initialize user from cookie if signal is null', () => {
    const mockUser: User = {email: 'test@user.com'};
    cookieServiceMock.get.withArgs('auth_token').and.returnValue('some-token');
    cookieServiceMock.get.withArgs('user_info').and.returnValue(JSON.stringify(mockUser));

    // Ensure signal is null initially
    (authServiceMock.currentUser as any).set(null);

    executeGuard({} as any, {} as any);

    expect((authServiceMock.currentUser as any)()).toEqual(mockUser);

  });


  it('should redirect to /login if auth token does not exist', () => {
    cookieServiceMock.get.withArgs('auth_token').and.returnValue(null);
    const expectedUrlTree = new UrlTree();
    routerMock.parseUrl.withArgs('/login').and.returnValue(expectedUrlTree);

    const result = executeGuard({} as any, {} as any);

    expect(routerMock.parseUrl).toHaveBeenCalledWith('/login');
    expect(result).toBe(expectedUrlTree);
  });
});

/// <reference types="jasmine" />

import { TestBed } from '@angular/core/testing';
import { CookieService } from './cookie.service';

describe('CookieService', () => {
  let service: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CookieService);
    // Clear cookies before each test
    document.cookie.split(';').forEach(c => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set a cookie', () => {
    service.set('test_cookie', 'test_value', 1);
    expect(document.cookie).toContain('test_cookie=test_value');
  });

  it('should get a cookie', () => {
    document.cookie = 'test_cookie=test_value; path=/';
    const value = service.get('test_cookie');
    expect(value).toBe('test_value');
  });

  it('should return null for a non-existent cookie', () => {
    const value = service.get('non_existent_cookie');
    expect(value).toBeNull();
  });

  it('should delete a cookie', () => {
    service.set('test_cookie_to_delete', 'value');
    expect(document.cookie).toContain('test_cookie_to_delete');
    service.delete('test_cookie_to_delete');

    expect(service.get('test_cookie_to_delete')).toBeNull();
  });
});

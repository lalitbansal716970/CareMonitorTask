/// <reference types="jasmine" />

import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    component.loginForm.controls.email.setValue('');
    component.loginForm.controls.password.setValue('');
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should have a valid form when filled correctly', () => {
    component.loginForm.controls.email.setValue('test@example.com');
    component.loginForm.controls.password.setValue('password');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should not call authService.login on submit if form is invalid', () => {
    component.loginForm.controls.email.setValue('');
    component.onSubmit();
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should call authService.login and navigate on successful login', fakeAsync(() => {
    authServiceSpy.login.and.returnValue(of(true));
    component.loginForm.controls.email.setValue('test@example.com');
    component.loginForm.controls.password.setValue('password');

    component.onSubmit();
    expect(component.status()).toBe('loading');

    tick(); // Simulate passage of time for the observable to resolve

    expect(authServiceSpy.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password' });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));

  it('should set error status on failed login', fakeAsync(() => {
    authServiceSpy.login.and.returnValue(of(false));
    component.loginForm.controls.email.setValue('test@example.com');
    component.loginForm.controls.password.setValue('password');

    component.onSubmit();
    expect(component.status()).toBe('error');

    tick();

    expect(component.status()).toBe('error');
    expect(component.errorMessage()).toBe('Invalid email or password.');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  }));

  it('should set error status on API error', fakeAsync(() => {
    authServiceSpy.login.and.returnValue(throwError(() => new Error('API Error')));
    component.loginForm.controls.email.setValue('test@example.com');
    component.loginForm.controls.password.setValue('password');

    component.onSubmit();
    tick();

    expect(component.status()).toBe('error');
    expect(component.errorMessage()).toBe('An unexpected error occurred. Please try again.');
  }));
});

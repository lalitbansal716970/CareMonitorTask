import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  status = signal<'idle' | 'loading' | 'error'>('idle');
  errorMessage = signal<string | null>(null);

  // FIX: Inject FormBuilder directly where it's used to create the form group.
  // This avoids the type inference issue with `this.fb` resolving to `unknown`.
  loginForm = inject(FormBuilder).group({
    email: ['test@example.com', [Validators.required, Validators.email]],
    password: ['password', Validators.required],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.status.set('loading');
    this.errorMessage.set(null);

    const { email, password } = this.loginForm.value;

    this.authService.login({ email: email!, password: password! }).subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.status.set('error');
          this.errorMessage.set('Invalid email or password.');
        }
      },
      error: () => {
        this.status.set('error');
        this.errorMessage.set('An unexpected error occurred. Please try again.');
      }
    });
  }
}
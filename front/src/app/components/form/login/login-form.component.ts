import { Component } from '@angular/core';
import { AuthToken } from 'src/app/interfaces/authSession.interface';
import { Login } from 'src/app/interfaces/login.interface';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['../../../app.component.scss'],
})
export class LoginFormComponent {
  public onError = false;
  public errorMessage = '';
  public loading = false;
  public submitted = false;
  public isSmallScreen = false;
  public isLargeScreen = false;

  public form = this.fb.group({
    emailOrUsername: [
      '',
      [
        Validators.required,
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(3)
      ]
    ]
  });

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private fb: FormBuilder,
    private router: Router) {}

  public submit(): void {
    if (this.form.invalid) {
      this.submitted = true;
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.onError = false;
    this.errorMessage = '';

    const loginRequest = this.form.value as Login;

    this.authService.login(loginRequest).subscribe({
      next: (response: AuthToken) => {
        this.sessionService.logIn(response);
        this.loading = false;
        sessionStorage.setItem('token', response.token);
        this.router.navigate(['/articles']);
      },
      error: error => {
        this.loading = false;
        this.onError = true;
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
      },
    });
  }
}

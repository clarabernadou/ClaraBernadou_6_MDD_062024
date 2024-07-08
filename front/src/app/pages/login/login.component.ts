import { Component, OnInit } from '@angular/core';
import { AuthToken } from 'src/app/interfaces/authSession.interface';
import { Login } from 'src/app/interfaces/login.interface';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  public onError = false;
  public errorMessage = '';
  public loading = false;

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
  ) {}

  ngOnInit(): void {}

  public submit(): void {
    if (this.form.invalid) {
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
        localStorage.setItem('token', response.token);
        // Redirect router navigate to articles page
      },
      error: error => {
        this.loading = false;
        this.onError = true;
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
      },
    });
  }
}

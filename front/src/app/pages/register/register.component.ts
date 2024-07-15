import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthToken } from 'src/app/interfaces/authSession.interface';
import { Register } from 'src/app/interfaces/login.interface';
import { AuthService } from 'src/app/services/auth.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class RegisterComponent implements OnInit {
  public onError = false;
  public errorMessage = '';
  public loading = false;
  public submitted = false;
  public isSmallScreen = false;
  public isLargeScreen = false;

  public form = this.fb.group({
    email: [
      '',
      [
        Validators.required,
      ]
    ],
    username: [
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
    private breakpointService: BreakpointService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (localStorage.getItem('token')) this.router.navigate(['/articles']);

    this.breakpointService.isSmallScreen().subscribe(isSmall => {
      this.isSmallScreen = isSmall;
    });

    this.breakpointService.isLargeScreen().subscribe(isLarge => {
      this.isLargeScreen = isLarge;
    });
  }

  public submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.onError = false;
    this.errorMessage = '';

    const registerRequest = this.form.value as Register;

    this.authService.register(registerRequest).subscribe({
      next: (response: AuthToken) => {
        this.sessionService.logIn(response);
        this.loading = false;
        localStorage.setItem('token', response.token);
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

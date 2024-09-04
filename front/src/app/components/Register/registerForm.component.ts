import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthToken } from 'src/app/interfaces/authSession.interface';
import { Register } from 'src/app/interfaces/login.interface';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { TokenService } from 'src/app/services/token.service';
import { extractErrorMessage } from 'src/app/utils/error.util';

@Component({
  selector: 'app-register-form',
  templateUrl: './registerForm.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class RegisterFormComponent implements OnDestroy {
  public onError: boolean = false;
  public errorMessage: string = '';
  public loading: boolean = false;
  public submitted: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  public form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(3)]]
  });

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private fb: FormBuilder,
    private router: Router,
    private tokenService: TokenService,
  ) {}

  public submit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading = true;

    const registerRequest = this.form.value as Register;
    this.authService.register(registerRequest).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: AuthToken) => this.handleSuccess(response),
      error: (error) => this.handleError(error)
    });
  }

  private handleSuccess(response: AuthToken): void {
    this.sessionService.logIn(response);
    this.loading = false;
    this.submitted = false;
    this.tokenService.setToken(response.token);
    this.router.navigate(['/articles']);
  }

  private handleError(error: any): void {
    this.loading = false;
    this.submitted = false;
    this.onError = true;
    this.errorMessage = extractErrorMessage(error);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
import { Component, OnDestroy } from '@angular/core';
import { AuthToken } from 'src/app/interfaces/authSession.interface';
import { Login } from 'src/app/interfaces/login.interface';
import { AuthService } from 'src/app/services/auth.service';
import { SessionService } from 'src/app/services/session.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { extractErrorMessage } from 'src/app/utils/error.util';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['../../../app.component.scss'],
})
export class LoginFormComponent implements OnDestroy {
  public onError: boolean = false;
  public errorMessage: string = '';
  public loading: boolean = false;
  public submitted: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  public form = this.fb.group({
    emailOrUsername: [ '', [ Validators.required ] ],
    password: [ '', [ Validators.required, Validators.minLength(3) ] ]
  });

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  public submit(): void {
    this.submitted = true; 
    if (this.form.invalid) return;

    this.loading = true;

    const loginRequest = this.form.value as Login;
    this.authService.login(loginRequest).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (response: AuthToken) => {
        this.sessionService.logIn(response);
        this.loading = false;
        this.submitted = false;
        sessionStorage.setItem('token', response.token);
        this.router.navigate(['/articles']);
      },
      error: error => {
        this.loading = false;
        this.submitted = false;
        this.onError = true;
        this.errorMessage = extractErrorMessage(error);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
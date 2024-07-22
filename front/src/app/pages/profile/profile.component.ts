import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/interfaces/user.interface';
import { ThemeService } from 'src/app/services/theme.service';
import { Theme } from 'src/app/interfaces/theme.interface';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class ProfileComponent implements OnInit {
  public isSmallScreen = false;
  public isLargeScreen = false;
  public loading = false;
  public onError = false;
  public errorMessage = '';
  public submitted = false;
  public user: User = {} as User;
  public themes: Theme[] = [];

  public form = this.fb.group({
    username: [
      '',
      [
        Validators.required
      ]
    ],
    email: [
      '',
      [
        Validators.required
      ]
    ]
  });

  constructor(
    private breakpointService: BreakpointService,
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService,
    private themeService: ThemeService,
  ) {}

  ngOnInit() {
    if (!localStorage.getItem('token')) this.router.navigate(['/login']);

    this.breakpointService.isSmallScreen().subscribe(isSmall => {
      this.isSmallScreen = isSmall;
    });

    this.breakpointService.isLargeScreen().subscribe(isLarge => {
      this.isLargeScreen = isLarge;
    });

    this.getMe();
  }

  public getMe() {
    this.userService.getMe().subscribe((user: User) => {
        this.user = user;
        this.themes = user.subscriptions as unknown as Theme[];
        this.form.patchValue({
            username: user.username,
            email: user.email
        });
    });
  }

  public submit(): void {
    if (this.form.invalid) {
      this.submitted = true;
      this.form.markAllAsTouched();
      return;
    }

    this.userService.updateMe(this.form.value as User).subscribe({ 
        next: (user: User) => {
          this.user = user;
          this.loading = false;
          localStorage.setItem('token', user.token!);
        }, error: (error) => {
          this.loading = false;
          this.onError = true;
          this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
        } 
      });
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  public unsubscribeToTheme(themeId: number): void {
    this.themeService.unsubscribeToTheme(themeId).subscribe({
      next: (response: any) => {
        this.getMe();
      },
      error: (error) => {
        this.onError = true;
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
      }
    });
  }
}
import { Component, OnInit } from '@angular/core';
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

  constructor(
    private breakpointService: BreakpointService,
    private router: Router,
    private userService: UserService,
    private themeService: ThemeService,
  ) {}

  ngOnInit() {
    if (!sessionStorage.getItem('token')) this.router.navigate(['/login']);

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
    });
  }

  public logout(): void {
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  public unsubscribeToTheme(themeId: number): void {
    this.themeService.unsubscribeToTheme(themeId).subscribe({
      next: () => {
        this.getMe();
      },
      error: (error) => {
        this.onError = true;
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
      }
    });
  }
}
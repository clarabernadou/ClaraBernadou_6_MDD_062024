import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, mergeMap } from 'rxjs';
import { Theme } from 'src/app/interfaces/theme.interface';
import { User } from 'src/app/interfaces/user.interface';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class ThemesComponent implements OnInit {
  public isSmallScreen = false;
  public isLargeScreen = false;
  public loading = true;
  public onError = false;
  public errorMessage = '';
  public themes: Theme[] = [];

  constructor(
    private breakpointService: BreakpointService,
    private router: Router,
    public themeService: ThemeService,
    public userService: UserService,
  ) {}

  ngOnInit() {
    if (!sessionStorage.getItem('token')) this.router.navigate(['/login']);

    this.breakpointService.isSmallScreen().subscribe(isSmall => {
      this.isSmallScreen = isSmall;
    });

    this.breakpointService.isLargeScreen().subscribe(isLarge => {
      this.isLargeScreen = isLarge;
    });

    this.getAllThemes();
  }

  public getAllThemes(): void {
    this.themeService.getAllThemes().pipe(
      mergeMap((themes: Theme[]) => {
        return this.userService.getMe().pipe(
          map((user: User) => {
            return themes.filter(theme => !user.subscriptions!.map(sub => sub.id).includes(theme.id));
          })
        );
      })
    ).subscribe({
      next: (filteredThemes: Theme[]) => {
        this.themes = filteredThemes;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.onError = true;
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
      }
    });
  }

  public subscribeToTheme(themeId: number): void {
    this.themeService.subscribeToTheme(themeId).subscribe({
      next: () => {
        this.getAllThemes();
      },
      error: (error) => {
        this.onError = true;
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
      }
    });
  }
}


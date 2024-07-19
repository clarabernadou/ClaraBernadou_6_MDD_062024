import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, map, mergeMap, Observable } from 'rxjs';
import { Theme } from 'src/app/interfaces/theme.interface';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { ThemeService } from 'src/app/services/theme.service';

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
  ) {}

  ngOnInit() {
    if (!localStorage.getItem('token')) this.router.navigate(['/login']);

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
        const themeObservables = themes.map((theme: Theme) => {
          return this.themeService.getTheme(theme.id!).pipe(
            map((theme: Theme) => ({
              ...theme,
            }))
          );
        });
        return forkJoin(themeObservables);
      })
    ).subscribe(
      (themes: Theme[]) => {
        this.themes = themes;
        this.loading = false
      },
      error => {
        this.loading = false;
        this.onError = true;
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
      }
    );
  }

  public subscribeToTheme(themeId: number): void {
    this.themeService.subscribeToTheme(themeId).subscribe(
      (res: any) => {
        this.themes = this.themes.map((theme: Theme) => {
          if (theme.id === themeId) {
            return {
              ...theme,
              subscribed: true,
            };
          }
          return theme;
        });
      },
      error => {
        this.onError = true;
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
      }
    );
  }

  public unsubscribeToTheme(themeId: number): void {
    this.themeService.unsubscribeToTheme(themeId).subscribe(
      (res: any) => {
        this.themes = this.themes.map((theme: Theme) => {
          if (theme.id === themeId) {
            return {
              ...theme,
              subscribed: false,
            };
          }
          return theme;
        });
      },
      error => {
        this.onError = true;
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
      }
    );
  }
}


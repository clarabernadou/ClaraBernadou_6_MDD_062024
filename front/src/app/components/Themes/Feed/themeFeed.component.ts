import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { Theme } from 'src/app/interfaces/theme.interface';
import { User } from 'src/app/interfaces/user.interface';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/user.service';
import { extractErrorMessage } from 'src/app/utils/error.util';

@Component({
  selector: 'app-theme-feed',
  templateUrl: './themeFeed.component.html',
  styleUrls: ['../../../app.component.scss'],
})
export class ThemeFeedComponent implements OnInit, OnDestroy {
  public isSmallScreen = false;
  public isLargeScreen = false;
  public loading = true;
  public onError = false;
  public errorMessage = '';
  public themes: Theme[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private breakpointService: BreakpointService,
    private router: Router,
    private themeService: ThemeService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.subscribeToBreakpoints();
    this.getThemes();
  }

  private subscribeToBreakpoints(): void {
    this.breakpointService.isSmallScreen().pipe(takeUntil(this.destroy$)).subscribe(isSmall => this.isSmallScreen = isSmall);
    this.breakpointService.isLargeScreen().pipe(takeUntil(this.destroy$)).subscribe(isLarge => this.isLargeScreen = isLarge);
  }

  private getThemes(): void {
    this.themeService.getAllThemes().pipe(
      mergeMap((themes: Theme[]) =>
        this.userService.getMe().pipe(
          map((user: User) => this.filterThemesForUser(themes, user))
        )
      ),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (filteredThemes: Theme[]) => {
        this.themes = filteredThemes;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.onError = true;
        this.errorMessage = extractErrorMessage(error);
      }
    });
  }

  private filterThemesForUser(themes: Theme[], user: User): Theme[] {
    themes.forEach(theme => {
      theme.subscribed = user.subscriptions?.some(sub => sub.id === theme.id) || false;
    });
    if (this.router.url === "/themes") return themes;
    return themes.filter(theme => user.subscriptions?.some(sub => sub.id === theme.id));
  }

  public subscribeToTheme(themeId: number): void {
    this.themeService.subscribeToTheme(themeId).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.getThemes(),
      error: error => this.handleError(error)
    });
  }

  public unsubscribeToTheme(themeId: number): void {
    this.themeService.unsubscribeToTheme(themeId).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => this.getThemes(),
      error: error => this.handleError(error)
    });
  }

  private handleError(error: any): void {
    this.onError = true;
    this.errorMessage = extractErrorMessage(error);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
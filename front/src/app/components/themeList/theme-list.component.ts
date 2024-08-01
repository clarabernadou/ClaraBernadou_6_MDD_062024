import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, mergeMap, Subscription } from 'rxjs';
import { Theme } from 'src/app/interfaces/theme.interface';
import { User } from 'src/app/interfaces/user.interface';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/user.service';
import { extractErrorMessage } from 'src/app/utils/error.util';

@Component({
  selector: 'app-theme-list',
  templateUrl: './theme-list.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class ThemeListComponent implements OnInit {
  public isSmallScreen = false;
  public isLargeScreen = false;
  public loading = true;
  public onError = false;
  public errorMessage = '';
  public themes: Theme[] = [];
  public currentUrl: string = this.router.url;
  private subscription: Subscription = new Subscription();

  constructor(
    private breakpointService: BreakpointService,
    private router: Router,
    public themeService: ThemeService,
    public userService: UserService,
  ) {}

  ngOnInit() {
    if (!sessionStorage.getItem('token')) this.router.navigate(['/login']);

    this.subscription.add(
      this.breakpointService.isSmallScreen().subscribe(isSmall => this.isSmallScreen = isSmall)
    );
    this.subscription.add(
      this.breakpointService.isLargeScreen().subscribe(isLarge => this.isLargeScreen = isLarge)
    );

    this.getThemes();
  }

  public getThemes(): void {
    this.themeService.getAllThemes().pipe(
      mergeMap((themes: Theme[]) => {
        return this.userService.getMe().pipe(
          map((user: User) => {
            if(this.currentUrl === "/themes") return themes;
            return themes.filter(theme => user.subscriptions?.map(sub => sub.id).includes(theme.id)) 
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
        this.errorMessage = extractErrorMessage(error);
      }
    });
  }

  public subscribeToTheme(themeId: number): void {
    this.themeService.subscribeToTheme(themeId).subscribe({
      next: () => {
        this.getThemes();
      },
      error: error => {
        this.onError = true;
        this.errorMessage = extractErrorMessage(error);
      }
    });
  }

  public unsubscribeToTheme(themeId: number): void {
    this.themeService.unsubscribeToTheme(themeId).subscribe({
      next: () => {
        this.getThemes();
      },
      error: error => {
        this.onError = true;
        this.errorMessage = extractErrorMessage(error);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}


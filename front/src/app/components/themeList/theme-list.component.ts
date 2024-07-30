import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, mergeMap, Subscription } from 'rxjs';
import { Theme } from 'src/app/interfaces/theme.interface';
import { User } from 'src/app/interfaces/user.interface';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/user.service';

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

    if(this.currentUrl === "/themes") this.getAllNoSubscribeThemes();
    if(this.currentUrl === "/profile") this.getSubscribeThemes();
  }

  public getAllNoSubscribeThemes(): void {
    this.loading = true;
    this.themeService.getAllThemes().pipe(
      mergeMap(themes => 
        this.userService.getMe().pipe(
          map(user => themes.filter(theme => 
            !user.subscriptions!.map(sub => sub.id).includes(theme.id)
          ))
        )
      )
    ).subscribe({
      next: filteredThemes => {
        this.themes = filteredThemes;
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.onError = true;
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
      }
    });
  }

  public getSubscribeThemes(): void {
    this.userService.getMe().subscribe({
      next: user => {
        this.themes = user.subscriptions as Theme[];
      },
      error: error => {
        this.onError = true;
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
      }
    });
  }

  public subscribeToTheme(themeId: number): void {
    this.themeService.subscribeToTheme(themeId).subscribe({
      next: () => {
        this.getAllNoSubscribeThemes();
      },
      error: error => {
        this.onError = true;
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
      }
    });
  }

  public unsubscribeToTheme(themeId: number): void {
    this.themeService.unsubscribeToTheme(themeId).subscribe({
      next: () => {
        this.getSubscribeThemes();
      },
      error: error => {
        this.onError = true;
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
      }
    });
  }
}


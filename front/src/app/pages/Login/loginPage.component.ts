import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-login-page',
  templateUrl: './loginPage.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  public isSmallScreen: boolean = false;
  public isLargeScreen: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private breakpointService: BreakpointService,
    private router: Router
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem('token')) this.router.navigate(['/articles']);

    this.subscribeToBreakpoints();
  }

  private subscribeToBreakpoints(): void {
    this.breakpointService.isSmallScreen().pipe(
      takeUntil(this.destroy$)
    ).subscribe(isSmall => this.isSmallScreen = isSmall);

    this.breakpointService.isLargeScreen().pipe(
      takeUntil(this.destroy$)
    ).subscribe(isLarge => this.isLargeScreen = isLarge);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

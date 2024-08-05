import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './registerPage.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {
  public isSmallScreen: boolean = false;
  public isLargeScreen: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private breakpointService: BreakpointService,
    private router: Router
  ) {}

  ngOnInit() {
    if (sessionStorage.getItem('token')) {
      this.router.navigate(['/articles']);
    }

    this.breakpointService.isSmallScreen()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isSmall => this.isSmallScreen = isSmall);

    this.breakpointService.isLargeScreen()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLarge => this.isLargeScreen = isLarge);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
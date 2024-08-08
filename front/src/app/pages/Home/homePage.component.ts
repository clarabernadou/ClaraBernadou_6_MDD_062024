import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './homePage.component.html',
  styleUrls: ['./homePage.component.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  public isSmallScreen: boolean = false;
  public isLargeScreen: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private breakpointService: BreakpointService, 
  ) {}

  ngOnInit() {
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

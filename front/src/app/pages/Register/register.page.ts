import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BreakpointService } from 'src/app/services/breakpoint.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['../../app.component.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {
  public isSmallScreen: boolean = false;
  public isLargeScreen: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private breakpointService: BreakpointService,
  ) {}

  ngOnInit() {
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
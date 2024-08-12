import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-article-detail-page',
  templateUrl: './articleDetailPage.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class ArticleDetailPage implements OnInit, OnDestroy {
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
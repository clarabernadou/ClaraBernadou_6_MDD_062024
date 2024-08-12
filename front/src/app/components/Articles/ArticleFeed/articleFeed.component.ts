import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/interfaces/article.interface';

@Component({
  selector: 'app-article-feed',
  templateUrl: './articleFeed.component.html',
  styleUrls: ['../../../app.component.scss'],
})
export class ArticleFeedComponent implements OnInit, OnDestroy {
  public isSmallScreen: boolean = false;
  public isLargeScreen: boolean = false;
  private subscriptions: Subscription = new Subscription();

  @Input() articles: Article[] = [];

  constructor(private breakpointService: BreakpointService) {}

  ngOnInit(): void {
    this.subscribeToBreakpoints();
  }

  private subscribeToBreakpoints(): void {
    this.subscriptions.add(
      this.breakpointService.isSmallScreen().subscribe(isSmall => this.isSmallScreen = isSmall)
    );
    this.subscriptions.add(
      this.breakpointService.isLargeScreen().subscribe(isLarge => this.isLargeScreen = isLarge)
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

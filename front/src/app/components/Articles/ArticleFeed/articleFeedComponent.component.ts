import { Component, Input, OnInit } from '@angular/core';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/interfaces/article.interface';

@Component({
  selector: 'app-article-feed-component',
  templateUrl: './articleFeedComponent.component.html',
  styleUrls: ['../../../app.component.scss'],
})
export class ArticleFeedComponent implements OnInit {
  public isSmallScreen: boolean = false;
  public isLargeScreen: boolean = false;
  private subscription: Subscription = new Subscription();

  @Input() articles: Article[] = [];

  constructor(
    private breakpointService: BreakpointService,
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.breakpointService.isSmallScreen().subscribe(isSmall => this.isSmallScreen = isSmall)
    );

    this.subscription.add(
      this.breakpointService.isLargeScreen().subscribe(isLarge => this.isLargeScreen = isLarge)
    );
  }
}

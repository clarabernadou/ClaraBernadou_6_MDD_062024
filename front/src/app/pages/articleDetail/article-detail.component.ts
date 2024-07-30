import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class ArticleDetailComponent implements OnInit {
  public isSmallScreen: boolean = false;
  public isLargeScreen: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private breakpointService: BreakpointService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (!sessionStorage.getItem('token')) this.router.navigate(['/login']);

    this.subscription.add(
      this.breakpointService.isSmallScreen().subscribe(isSmall => this.isSmallScreen = isSmall)
    );

    this.subscription.add(
      this.breakpointService.isLargeScreen().subscribe(isLarge => this.isLargeScreen = isLarge)
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}


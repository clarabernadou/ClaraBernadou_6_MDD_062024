import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { CommentService } from 'src/app/services/comment.service';
import { Comment } from 'src/app/interfaces/comment.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class ArticleDetailComponent implements OnInit {
  public isSmallScreen: boolean = false;
  public isLargeScreen: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakpointService: BreakpointService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (!sessionStorage.getItem('token')) this.router.navigate(['/login']);

    this.subscriptions.add(
      this.breakpointService.isSmallScreen().subscribe(isSmall => this.isSmallScreen = isSmall)
    );

    this.subscriptions.add(
      this.breakpointService.isLargeScreen().subscribe(isLarge => this.isLargeScreen = isLarge)
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}


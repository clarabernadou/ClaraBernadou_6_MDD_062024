import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/interfaces/article.interface';
import { User } from 'src/app/interfaces/user.interface';
import { ArticleService } from 'src/app/services/article.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { UserService } from 'src/app/services/user.service';
import { forkJoin, Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class ArticlesComponent implements OnInit {
  public isSmallScreen: boolean = false;
  public isLargeScreen: boolean = false;
  public loading: boolean = true;
  public onError: boolean = false;
  public errorMessage: string = '';
  public articles: Article[] = [];
  public isAscendingOrder: boolean = true;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private breakpointService: BreakpointService, 
    private articleService: ArticleService,
    private userService: UserService,
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

    this.getArticles();
  }

  getArticles(): void {
    this.articleService.getAllArticles().pipe(
      mergeMap(articles => {
        const articleObservables = articles.map(article =>
          this.userService.getUserById(article.owner_id!).pipe(
            map(user => ({
              ...article,
              author: user.username
            }))
          )
        );
        return forkJoin(articleObservables);
      })
    ).subscribe({
      next: articlesWithAuthors => {
        this.articles = articlesWithAuthors;
        this.sortArticles();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.onError = true;
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
      }
    });
  }

  sortArticles(): void {
    this.articles.sort((a, b) =>
      this.isAscendingOrder
        ? new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()
        : new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
    );
    this.isAscendingOrder = !this.isAscendingOrder;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Article } from 'src/app/interfaces/article.interface';
import { ArticleService } from 'src/app/services/article.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { UserService } from 'src/app/services/user.service';
import { forkJoin, Subject } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { extractErrorMessage } from 'src/app/utils/error.util';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.page.html',
  styleUrls: ['../../app.component.scss'],
})
export class ArticlesPage implements OnInit, OnDestroy {
  public isSmallScreen: boolean = false;
  public isLargeScreen: boolean = false;
  public loading: boolean = true;
  public onError: boolean = false;
  public errorMessage: string = '';
  public articles: Article[] = [];
  public isAscendingOrder: boolean = true;
  private destroy$ = new Subject<void>();

  constructor(
    private breakpointService: BreakpointService, 
    private articleService: ArticleService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.subscribeToBreakpoints();
    this.getArticles();
  }

  private subscribeToBreakpoints(): void {
    this.breakpointService.isSmallScreen().pipe(
      takeUntil(this.destroy$)
    ).subscribe(isSmall => this.isSmallScreen = isSmall);

    this.breakpointService.isLargeScreen().pipe(
      takeUntil(this.destroy$)
    ).subscribe(isLarge => this.isLargeScreen = isLarge);
  }

  private getArticles(): void {
    this.articleService.getAllArticles().pipe(
      mergeMap(articles => this.getArticlesWithAuthors(articles))
    ).subscribe({
      next: articlesWithAuthors => {
        this.articles = articlesWithAuthors;
        this.sortArticles();
        this.loading = false;
      },
      error: error => {
        this.loading = false;
        this.onError = true;
        this.errorMessage = extractErrorMessage(error);
      }
    });
  }

  private getArticlesWithAuthors(articles: Article[]) {
    const articleObservables = articles.map(article =>
      this.userService.getUserById(article.owner_id!).pipe(
        map(user => ({
          ...article,
          author: user.username
        }))
      )
    );
    return forkJoin(articleObservables);
  }

  public sortArticles(): void {
    this.articles.sort((a, b) =>
      this.isAscendingOrder
        ? new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()
        : new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime()
    );
    this.isAscendingOrder = !this.isAscendingOrder;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

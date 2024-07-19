import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/interfaces/article.interface';
import { User } from 'src/app/interfaces/user.interface';
import { ArticleService } from 'src/app/services/article.service';
import { BreakpointService } from 'src/app/services/breakpoint.service';
import { UserService } from 'src/app/services/user.service';
import { forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['../../app.component.scss'],
})
export class ArticlesComponent implements OnInit {
  public isSmallScreen = false;
  public isLargeScreen = false;
  public loading = true;
  public onError = false;
  public errorMessage = '';
  public articles: Article[] = [];
  public isAscendingOrder = true;

  constructor(
    private breakpointService: BreakpointService, 
    private articleService: ArticleService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (!localStorage.getItem('token')) this.router.navigate(['/login']);

    this.breakpointService.isSmallScreen().subscribe(isSmall => {
      this.isSmallScreen = isSmall;
    });

    this.breakpointService.isLargeScreen().subscribe(isLarge => {
      this.isLargeScreen = isLarge;
    });

    this.getArticles();
  }

  getArticles(): void {
    this.articleService.getAllArticles().pipe(
      mergeMap((articles: Article[]) => {
        const articleObservables = articles.map((article: Article) => {
          return this.userService.getUserById(article.owner_id!).pipe(
            map((user: User) => ({
              ...article,
              author: user.username
            }))
          );
        });
        return forkJoin(articleObservables);
      })
    ).subscribe(
      (articlesWithAuthors: Article[]) => {
        this.articles = articlesWithAuthors;
        this.sortArticles();
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.onError = true;
        this.errorMessage = error.error?.message || 'An error occurred. Please try again.';
      }
    );
  }

  sortArticles(): void {
    if (this.isAscendingOrder) {
      this.articles.sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime());
    } else {
      this.articles.sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());
    }
    this.isAscendingOrder = !this.isAscendingOrder;
  }
}

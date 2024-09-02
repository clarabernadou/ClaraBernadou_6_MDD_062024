import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/interfaces/article.interface';
import { ArticleDetailService } from 'src/app/services/articleDetail.service';

@Component({
  selector: 'app-article-detail-component',
  templateUrl: './articleDetail.component.html',
  styleUrls: ['../../../app.component.scss'],
})
export class ArticleDetailComponent implements OnInit, OnDestroy {
  public loading: boolean = true;
  public onError: boolean = false;
  public errorMessage: string = '';
  public article: Article | undefined;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private articleDetailService: ArticleDetailService,
    private activatedRouter: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getArticleById();
  }

  getArticleById(): void {
    this.loading = true;

    const id = this.activatedRouter.snapshot.paramMap.get('id')!;
    const article$ = this.articleDetailService.getArticleDetails(id);

    this.subscriptions.add(
      article$.subscribe({
        next: (article: Article) => {
          this.article = article;
          this.loading = false;
        },
        error: (error: any) => {
          this.onError = true;
          this.errorMessage = error.message;
          this.loading = false;
          this.router.navigate(['/page-not-found']);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
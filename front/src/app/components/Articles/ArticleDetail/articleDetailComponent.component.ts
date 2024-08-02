import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, map, mergeMap, Subscription } from 'rxjs';
import { Article } from 'src/app/interfaces/article.interface';
import { ArticleService } from 'src/app/services/article.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-article-detail-component',
  templateUrl: './articleDetailComponent.component.html',
  styleUrls: ['../../../app.component.scss'],
})
export class ArticleDetailComponent implements OnInit {
    public loading: boolean = true;
    public onError: boolean = false;
    public errorMessage: string = '';
    public article: Article | undefined;
    private subscription: Subscription = new Subscription();

    constructor(
        private articleService: ArticleService,
        private themeService: ThemeService,
        private userService: UserService,
        private activatedRouter: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.getArticleById();
    }

    getArticleById(): void {
        this.loading = true;

        const id = this.activatedRouter.snapshot.paramMap.get('id')!;
        const article$ = this.articleService.getArticleById(id).pipe(
            mergeMap((article: Article) => {
                return forkJoin({
                    user: this.userService.getUserById(article.owner_id!),
                    theme: this.themeService.getThemeById(article.theme_id!)
                }).pipe(
                    map(results => ({
                        ...article,
                        author: results.user.username,
                        theme: results.theme.title,
                    }))
                );
            })
        );

        this.subscription.add(
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
        this.subscription.unsubscribe();
    }
}

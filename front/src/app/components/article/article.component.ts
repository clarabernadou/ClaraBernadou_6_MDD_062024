import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, map, mergeMap } from 'rxjs';
import { Article } from 'src/app/interfaces/article.interface';
import { ArticleService } from 'src/app/services/article.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss', '../../app.component.scss'],
})
export class ArticleComponent implements OnInit {
    public loading = true;
    public onError = false;
    public errorMessage = '';
    public article: Article | undefined;

    ngOnInit(): void {
        this.getArticleById();
    }

    constructor(
        private articleService: ArticleService,
        private themeService: ThemeService,
        private userService: UserService,
        private activatedRouter: ActivatedRoute,
    ) {}

    getArticleById(): void {
        const id = this.activatedRouter.snapshot.paramMap.get('id')!;
        this.articleService.getArticleById(id).pipe(
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
        ).subscribe({
            next: (article: Article) => {
                this.article = article;
                this.loading = false;
            },
            error: (error: any) => {
                this.onError = true;
                this.errorMessage = error.message;
                this.loading = false;
            }
        });
    }
}

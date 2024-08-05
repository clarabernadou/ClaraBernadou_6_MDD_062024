import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { Article } from '../interfaces/article.interface';
import { ArticleService } from './article.service';
import { ThemeService } from './theme.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleDetailService {
  constructor(
    private articleService: ArticleService,
    private themeService: ThemeService,
    private userService: UserService
  ) {}

  getArticleDetails(id: string): Observable<Article> {
    return this.articleService.getArticleById(id).pipe(
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
  }
}
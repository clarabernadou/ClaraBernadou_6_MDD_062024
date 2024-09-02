import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Article } from '../interfaces/article.interface';
import { HttpOptionsService } from './httpOptions.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private baseAuthUrl: string;

  constructor(
    private httpClient: HttpClient,
    private httpOptionsService: HttpOptionsService,
    private apiService: ApiService,
  ) {
    this.baseAuthUrl = this.apiService.getAuthUrl('/article');
  }

  public getAllArticles() {
    return this.httpClient.get<Article[]>(`${this.baseAuthUrl}/`, this.httpOptionsService.getHttpOptions());
  }

  public getArticleById(id: string) {
    return this.httpClient.get<Article>(`${this.baseAuthUrl}/${id}`, this.httpOptionsService.getHttpOptions());
  }

  public createArticle(article: Article) {
    return this.httpClient.post<Article>(`${this.baseAuthUrl}/`, article, this.httpOptionsService.getHttpOptions());
  }
}
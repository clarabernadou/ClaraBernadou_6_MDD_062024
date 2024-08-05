import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Article } from '../interfaces/article.interface';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private baseUrl = `${environment.baseUrl}/auth/article`;

  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService,
  ) {}

  public getAllArticles() {
    const headers = this.tokenService.getAuthHeaders();
    return this.httpClient.get<Article[]>(`${this.baseUrl}/`, { headers });
  }

  public getArticleById(id: string) {
    const headers = this.tokenService.getAuthHeaders();
    return this.httpClient.get<Article>(`${this.baseUrl}/${id}`, { headers });
  }

  public createArticle(article: Article) {
    const headers = this.tokenService.getAuthHeaders();
    return this.httpClient.post<Article>(`${this.baseUrl}/`, article, { headers });
  }
}
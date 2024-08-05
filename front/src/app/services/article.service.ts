import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Article } from '../interfaces/article.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private baseUrl = `${environment.baseUrl}/auth/article`;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getAllArticles() {
    const headers = this.authService.getAuthHeaders();
    return this.httpClient.get<Article[]>(`${this.baseUrl}/`, { headers });
  }

  getArticleById(id: string) {
    const headers = this.authService.getAuthHeaders();
    return this.httpClient.get<Article>(`${this.baseUrl}/${id}`, { headers });
  }

  createArticle(article: Article) {
    const headers = this.authService.getAuthHeaders();
    return this.httpClient.post<Article>(`${this.baseUrl}/`, article, { headers });
  }
}
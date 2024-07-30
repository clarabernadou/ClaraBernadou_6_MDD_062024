import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Article } from '../interfaces/article.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private baseUrl = environment.baseUrl + '/auth/article';

  constructor(private httpClient: HttpClient) {}

  getAllArticles() {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.get<Article[]>(`${this.baseUrl}/`, { headers });
  }

  getArticleById(id: string) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.get<Article>(`${this.baseUrl}/${id}`, { headers });
  }

  createArticle(article: Article) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.post<Article>(`${this.baseUrl}/`, article, { headers });
  }
}
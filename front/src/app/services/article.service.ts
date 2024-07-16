import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthToken } from '../interfaces/authSession.interface';
import { Login, Register } from '../interfaces/login.interface';
import { environment } from '../../environments/environment';
import { Article } from '../interfaces/article.interface';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private baseUrl = environment.baseUrl + '/auth/article';

  constructor(private httpClient: HttpClient) {}

  getAllArticles() {
    const token = localStorage.getItem('token');
  console.log(token);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.get<Article[]>(`${this.baseUrl}/`, { headers });
  }
}
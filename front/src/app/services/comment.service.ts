import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Comment } from '../interfaces/comment.interface';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = environment.baseUrl + '/auth';

  constructor(private httpClient: HttpClient) {}

  createComment(articleId: number, comment: Comment) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.post(`${this.baseUrl}/article/${articleId}/comment`, comment, { headers });
  }

  getComments(articleId: number) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.httpClient.get<Comment[]>(`${this.baseUrl}/article/${articleId}/comment`, { headers });
  }
}
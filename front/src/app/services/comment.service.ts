import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Comment } from '../interfaces/comment.interface';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = `${environment.baseUrl}/auth`;

  constructor(private httpClient: HttpClient, private tokenService: TokenService) {}

  createComment(articleId: number, comment: Comment) {
    const headers = this.tokenService.getAuthHeaders();
    return this.httpClient.post(`${this.baseUrl}/article/${articleId}/comment`, comment, { headers });
  }

  getComments(articleId: number) {
    const headers = this.tokenService.getAuthHeaders();
    return this.httpClient.get<Comment[]>(`${this.baseUrl}/article/${articleId}/comment`, { headers });
  }
}
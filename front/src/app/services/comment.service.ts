import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Comment } from '../interfaces/comment.interface';
import { TokenService } from './token.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseUrl = `${environment.baseUrl}/auth`;

  private commentUpdatedSource: Subject<void> = new Subject<void>();
  public commentUpdated$: Observable<void> = this.commentUpdatedSource.asObservable();

  constructor(private httpClient: HttpClient, private tokenService: TokenService) {}

  public createComment(articleId: number, comment: Comment) {
    const headers = this.tokenService.getAuthHeaders();
    return this.httpClient.post<Comment>(`${this.baseUrl}/article/${articleId}/comment`, comment, { headers });
  }

  public getComments(articleId: number) {
    const headers = this.tokenService.getAuthHeaders();
    return this.httpClient.get<Comment[]>(`${this.baseUrl}/article/${articleId}/comment`, { headers });
  }

  public notifyCommentUpdate(): void {
    this.commentUpdatedSource.next();
  }
}
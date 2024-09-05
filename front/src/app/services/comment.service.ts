import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Comment } from '../interfaces/comment.interface';
import { Observable, Subject } from 'rxjs';
import { HttpOptionsService } from './httpOptions.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private baseAuthUrl: string;

  public commentCreated = new EventEmitter<void>();

  constructor(
    private httpClient: HttpClient,
    private httpOptionsService: HttpOptionsService,
    private apiService: ApiService,
  ) {
    this.baseAuthUrl = this.apiService.getAuthUrl('/article');
  }

  public createComment(articleId: number, comment: Comment) {
    return this.httpClient.post<Comment>(`${this.baseAuthUrl}/${articleId}/comment`, comment, this.httpOptionsService.getHttpOptions());
  }

  public getComments(articleId: number) {
    return this.httpClient.get<Comment[]>(`${this.baseAuthUrl}/${articleId}/comment`, this.httpOptionsService.getHttpOptions());
  }

  public notifyCommentUpdate(): void {
    this.commentCreated.emit();
  }
}
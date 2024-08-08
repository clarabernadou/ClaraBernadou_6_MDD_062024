import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user.interface';
import { ApiService } from './api.service';
import { HttpOptionsService } from './httpOptions.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseAuthUrl: string;

  constructor(
    private httpClient: HttpClient,
    private httpOptionsService: HttpOptionsService,
    private apiService: ApiService, 
  ) {
    this.baseAuthUrl = this.apiService.getAuthUrl('/user');
  }

  public getUserById(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.baseAuthUrl}/${id}`, this.httpOptionsService.getHttpOptions());
  }

  public getMe(): Observable<User> {
    return this.httpClient.get<User>(`${this.baseAuthUrl}/me`, this.httpOptionsService.getHttpOptions());
  }

  public updateMe(user: User): Observable<User> {
    return this.httpClient.put<User>(`${this.baseAuthUrl}/me`, user, this.httpOptionsService.getHttpOptions());
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interfaces/user.interface';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = `${environment.baseUrl}/auth/user`;

  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService,
  ) {}

  public getUserById(id: number): Observable<User> {
    const headers = this.tokenService.getAuthHeaders();
    return this.httpClient.get<User>(`${this.baseUrl}/${id}`, { headers });
  }

  public getMe(): Observable<User> {
    const headers = this.tokenService.getAuthHeaders();
    return this.httpClient.get<User>(`${this.baseUrl}/me`, { headers });
  }

  public updateMe(user: User): Observable<User> {
    const headers = this.tokenService.getAuthHeaders();
    return this.httpClient.put<User>(`${this.baseUrl}/me`, user, { headers });
  }
}

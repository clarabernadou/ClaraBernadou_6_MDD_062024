import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthToken } from '../interfaces/authSession.interface';
import { Login, Register } from '../interfaces/login.interface';
import { HttpOptionsService } from './httpOptions.service';
import { ApiService } from './api.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string;

  constructor(
    private httpClient: HttpClient,
    private httpOptionsService: HttpOptionsService,
    private apiService: ApiService,
    private tokenService: TokenService,
  ) {
    this.baseUrl = this.apiService.getUrl('');
  }

  public login(loginRequest: Login): Observable<AuthToken> {
    return this.httpClient.post<AuthToken>(`${this.baseUrl}/login`, { 
      emailOrUsername: loginRequest.emailOrUsername, 
      password: loginRequest.password 
    }, this.httpOptionsService.getHttpOptions());
  }

  public register(registerRequest: Register): Observable<AuthToken> {
    return this.httpClient.post<AuthToken>(`${this.baseUrl}/register`, {
      email: registerRequest.email,
      username: registerRequest.username,
      password: registerRequest.password
    }, this.httpOptionsService.getHttpOptions());
  }

  public isAuthenticated(): boolean {
    return !!this.tokenService.getAuthHeaders();
  }
}
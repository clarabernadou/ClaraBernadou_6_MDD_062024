import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthToken } from '../interfaces/authSession.interface';
import { Login, Register } from '../interfaces/login.interface';
import { environment } from '../../environments/environment';
import { HttpOptionsService } from './httpOptions.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseAuthUrl: string;

  constructor(
    private httpClient: HttpClient,
    private httpOptionsService: HttpOptionsService,
    private apiService: ApiService,
  ) {
    this.baseAuthUrl = this.apiService.getAuthUrl('');
  }

  public login(loginRequest: Login): Observable<AuthToken> {
    return this.httpClient.post<AuthToken>(`${this.baseAuthUrl}/login`, { 
      emailOrUsername: loginRequest.emailOrUsername, 
      password: loginRequest.password 
    }, this.httpOptionsService.getHttpOptions());
  }

  public register(registerRequest: Register): Observable<AuthToken> {
    return this.httpClient.post<AuthToken>(`${this.baseAuthUrl}/register`, {
      email: registerRequest.email,
      username: registerRequest.username,
      password: registerRequest.password
    }, this.httpOptionsService.getHttpOptions());
  }

  public isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }
}
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthToken } from '../interfaces/authSession.interface';
import { Login, Register } from '../interfaces/login.interface';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.baseUrl;

  constructor(private httpClient: HttpClient, private tokenService: TokenService) {}

  getAuthHeaders(): HttpHeaders {
    return this.tokenService.getAuthHeaders();
  }

  login(loginRequest: Login): Observable<AuthToken> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = JSON.stringify({
      emailOrUsername: loginRequest.emailOrUsername,
      password: loginRequest.password
    });
    return this.httpClient.post<AuthToken>(`${this.baseUrl}/login`, body, { headers });
  }

  register(registerRequest: Register): Observable<AuthToken> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = JSON.stringify({
      email: registerRequest.email,
      username: registerRequest.username,
      password: registerRequest.password
    });
    return this.httpClient.post<AuthToken>(`${this.baseUrl}/register`, body, { headers });
  }
}
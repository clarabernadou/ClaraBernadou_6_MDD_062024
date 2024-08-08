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
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient, private tokenService: TokenService) {}

  public login(loginRequest: Login): Observable<AuthToken> {
    return this.httpClient.post<AuthToken>(`${this.baseUrl}/login`, { 
      emailOrUsername: loginRequest.emailOrUsername, 
      password: loginRequest.password }, this.httpOptions);
  }

  public register(registerRequest: Register): Observable<AuthToken> {
    return this.httpClient.post<AuthToken>(`${this.baseUrl}/register`, {
      email: registerRequest.email,
      username: registerRequest.username,
      password: registerRequest.password
    }, this.httpOptions);
  }

  public isAuthenticated(): boolean {
    return !!sessionStorage.getItem('token');
  }
}
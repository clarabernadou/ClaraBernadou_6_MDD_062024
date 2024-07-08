import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthToken } from '../interfaces/authSession.interface';
import { Login, Register } from '../interfaces/login.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private httpClient: HttpClient) {}

  login(loginRequest: Login): Observable<AuthToken> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = JSON.stringify({ emailOrUsername: loginRequest.emailOrUsername, password: loginRequest.password });
    return this.httpClient.post<AuthToken>(`${this.baseUrl}/login`, body, { headers });
  }

  register(registerRequest: Register): Observable<AuthToken> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = JSON.stringify({ email: registerRequest.email, username: registerRequest.username, password: registerRequest.password });
    return this.httpClient.post<AuthToken>(`${this.baseUrl}/register`, body, { headers });
  }
}
import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor() {}

  public getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public isTokenExpired(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      const exp = decodedToken.exp;
      if (exp * 1000 < Date.now()) {
        return true;
      }
      return false;
    } catch (error) {
      return true;
    }
  }
}
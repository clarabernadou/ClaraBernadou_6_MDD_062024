import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly tokenKey = 'auth_token';
  private readonly tokenHashKey = 'auth_token_hash';

  constructor(private cookieService: CookieService) {}

  public getAuthHeaders(): HttpHeaders | null {
    const token = this.getToken();

    if (token && this.isTokenValid(token)) {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
    } else {
      return null;
    }
  }

  setToken(token: string): void {
    const decodedToken: any = jwtDecode(token);
    const expirationDate = new Date(decodedToken.exp * 1000);

    this.cookieService.set(this.tokenKey, token, {
      expires: expirationDate,
      secure: false,
      sameSite: 'Strict',
      path: '/',
    });

    const tokenHash = this.generateTokenHash(token);
    this.cookieService.set(this.tokenHashKey, tokenHash, {
      expires: expirationDate,
      secure: false,
      sameSite: 'Strict',
      path: '/',
    });
  }

  getToken(): string | null {
    return this.cookieService.get(this.tokenKey);
  }

  clearToken(): void {
    this.cookieService.delete(this.tokenKey, '/');
    this.cookieService.delete(this.tokenHashKey, '/');
  }

  private isTokenValid(token: string): boolean {
    const storedHash = this.cookieService.get(this.tokenHashKey);
    const currentHash = this.generateTokenHash(token);

    if (storedHash !== currentHash) {
      return false;
    }

    return !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    const decodedToken: any = jwtDecode(token);
    const expirationDate = new Date(decodedToken.exp * 1000);
    return expirationDate < new Date();
  }

  private generateTokenHash(token: string): string {
    return CryptoJS.SHA256(token).toString(CryptoJS.enc.Hex);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Theme } from '../interfaces/theme.interface';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private baseUrl = `${environment.baseUrl}/auth/theme`;

  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService,
  ) {}

  public getThemeById(id: number) {
    const headers = this.tokenService.getAuthHeaders();
    return this.httpClient.get<Theme>(`${this.baseUrl}/${id}`, { headers });
  }

  public getAllThemes() {
    const headers = this.tokenService.getAuthHeaders();
    return this.httpClient.get<Theme[]>(`${this.baseUrl}/`, { headers });
  }

  public subscribeToTheme(id: number) {
    const headers = this.tokenService.getAuthHeaders();
    return this.httpClient.post(`${this.baseUrl}/subscribe/${id}`, {}, { headers });
  }

  public unsubscribeToTheme(id: number) {
    const headers = this.tokenService.getAuthHeaders();
    return this.httpClient.delete(`${this.baseUrl}/unsubscribe/${id}`, { headers });
  }
}
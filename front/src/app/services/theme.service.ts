import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Theme } from '../interfaces/theme.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private baseUrl = `${environment.baseUrl}/auth/theme`;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  getThemeById(id: number) {
    const headers = this.authService.getAuthHeaders();
    return this.httpClient.get<Theme>(`${this.baseUrl}/${id}`, { headers });
  }

  getAllThemes() {
    const headers = this.authService.getAuthHeaders();
    return this.httpClient.get<Theme[]>(`${this.baseUrl}/`, { headers });
  }

  subscribeToTheme(id: number) {
    const headers = this.authService.getAuthHeaders();
    return this.httpClient.post(`${this.baseUrl}/subscribe/${id}`, {}, { headers });
  }

  unsubscribeToTheme(id: number) {
    const headers = this.authService.getAuthHeaders();
    return this.httpClient.delete(`${this.baseUrl}/unsubscribe/${id}`, { headers });
  }
}
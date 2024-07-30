import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Theme } from '../interfaces/theme.interface';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private baseUrl = environment.baseUrl + '/auth/theme';

  constructor(private httpClient: HttpClient) {}

  getThemeById(id: number) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.get<Theme>(`${this.baseUrl}/${id}`, { headers });
  }

  getAllThemes() {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.get<Theme[]>(`${this.baseUrl}/`, { headers });
  }

  subscribeToTheme(id: number) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.post(`${this.baseUrl}/subscribe/${id}`, {}, { headers });
  }

  unsubscribeToTheme(id: number) {
    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.httpClient.delete(`${this.baseUrl}/unsubscribe/${id}`, { headers });
  }
}
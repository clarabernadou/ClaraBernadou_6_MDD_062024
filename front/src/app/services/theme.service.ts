import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Theme } from '../interfaces/theme.interface';
import { HttpOptionsService } from './httpOptions.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private baseAuthUrl: string;

  constructor(
    private httpClient: HttpClient,
    private httpOptionsService: HttpOptionsService,
    private apiService: ApiService,
  ) {
    this.baseAuthUrl = this.apiService.getAuthUrl('/theme');
  }

  public getThemeById(id: number) {
    return this.httpClient.get<Theme>(`${this.baseAuthUrl}/${id}`, this.httpOptionsService.getHttpOptions());
  }

  public getAllThemes() {
    return this.httpClient.get<Theme[]>(`${this.baseAuthUrl}/`, this.httpOptionsService.getHttpOptions());
  }

  public subscribeToTheme(id: number) {
    return this.httpClient.post(`${this.baseAuthUrl}/subscribe/${id}`, {}, this.httpOptionsService.getHttpOptions());
  }

  public unsubscribeToTheme(id: number) {
    return this.httpClient.delete(`${this.baseAuthUrl}/unsubscribe/${id}`, this.httpOptionsService.getHttpOptions());
  }
}
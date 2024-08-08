import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public readonly baseUrl: string = environment.baseUrl;

  constructor() {}

  getAuthUrl(path: string = ''): string {
    return `${this.baseUrl}/auth${path}`;
  }
}
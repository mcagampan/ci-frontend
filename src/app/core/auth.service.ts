import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private HttpClient: HttpClient,
    private CookieService: CookieService
  ) {}

  register(name: string, email: string, password: string) {
    return this.HttpClient.post(`${environment.apiURL}/auth/register`, {
      name,
      email,
      password,
    });
  }

  login(email: string, password: string) {
    return this.HttpClient.post(`${environment.apiURL}/auth/login`, {
      email,
      password,
    });
  }

  getAuthorizationToken() {
    return JSON.parse(this.CookieService.get('user')).accessToken;
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { AuthInterceptorService } from './auth-interceptor.service';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(private HttpClient: HttpClient) {}

  getClients() {
    return this.HttpClient.get(`${environment.apiURL}/client`);
  }

  addClient(client) {
    return this.HttpClient.post(`${environment.apiURL}/client`, client);
  }

  updateClient(client) {
    return this.HttpClient.post(
      `${environment.apiURL}/client/${client.id}`,
      client
    );
  }

  deleteClient(id) {
    return this.HttpClient.delete(`${environment.apiURL}/client/${id}`);
  }
}

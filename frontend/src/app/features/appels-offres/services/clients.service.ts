import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ClientResponse } from '../models/appel-offre.model';

@Injectable({ providedIn: 'root' })
export class ClientsService {
  private readonly baseUrl = `${environment.apiUrl}/clients`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<ClientResponse[]> {
    return this.http
      .get<any>(this.baseUrl)
      .pipe(map((res) => (Array.isArray(res) ? res : (res.content ?? []))));
  }

  create(client: {
    clientName: string;
    adresse: string;
    email: string;
    telephone: string;
    secteur: string;
  }): Observable<ClientResponse> {
    return this.http.post<ClientResponse>(this.baseUrl, client);
  }
}

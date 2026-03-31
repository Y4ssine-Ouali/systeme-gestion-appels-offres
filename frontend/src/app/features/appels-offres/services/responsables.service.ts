import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
export interface ResponsableResponse {
  id: number;
  nom: string;
  prenom: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class ResponsablesService {
  private readonly baseUrl = `${environment.apiUrl}/utilisateurs`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<ResponsableResponse[]> {
    return this.http.get<ResponsableResponse[]>(this.baseUrl);
  }
}

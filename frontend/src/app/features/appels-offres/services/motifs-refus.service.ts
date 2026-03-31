import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MotifRefusReference } from '../models/appel-offre.model';

@Injectable({ providedIn: 'root' })
export class MotifsRefusService {
  private readonly baseUrl = `${environment.apiUrl}/motifs-refus`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<MotifRefusReference[]> {
    return this.http.get<MotifRefusReference[]>(this.baseUrl);
  }
}

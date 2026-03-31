import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DocumentAoResponse } from '../models/appel-offre.model';

@Injectable({ providedIn: 'root' })
export class DocumentsAoService {
  private readonly baseUrl = `${environment.apiUrl}/appels-offres`;

  constructor(private readonly http: HttpClient) {}

  list(aoId: number): Observable<DocumentAoResponse[]> {
    return this.http.get<DocumentAoResponse[]>(`${this.baseUrl}/${aoId}/documents`);
  }

  upload(
    aoId: number,
    file: File,
    metadata: { typeDocumentAo: string; nom: string },
  ): Observable<DocumentAoResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    return this.http.post<DocumentAoResponse>(`${this.baseUrl}/${aoId}/documents`, formData);
  }

  download(aoId: number, documentId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${aoId}/documents/download/${documentId}`, {
      responseType: 'blob',
    });
  }

  delete(aoId: number, documentId: number, utilisateurId: number): Observable<void> {
    const params = new HttpParams().set('utilisateurId', utilisateurId.toString());
    return this.http.delete<void>(`${this.baseUrl}/${aoId}/documents/${documentId}`, { params });
  }
}

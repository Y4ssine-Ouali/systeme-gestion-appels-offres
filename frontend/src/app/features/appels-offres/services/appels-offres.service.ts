import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import {
  AOFilterValues,
  AppelOffreRequest,
  AppelOffreResponse,
  AppelOffreSummaryResponse,
  AppelOffreUpdateRequest,
  HistoriqueResponse,
  LotRequest,
  LotResponse,
  PageResponse,
  ParticipationDecisionRequest,
  ParticipationDecisionResponse,
  ValidationDecisionRequest,
} from '../models/appel-offre.model';

@Injectable({ providedIn: 'root' })
export class AppelsOffresService {
  private readonly baseUrl = `${environment.apiUrl}/appels-offres`;

  constructor(private readonly http: HttpClient) {}

  search(filters: AOFilterValues): Observable<PageResponse<AppelOffreSummaryResponse>> {
    const params = new HttpParams()
      .set('page', filters.page.toString())
      .set('size', filters.size.toString())
      .set('sortBy', filters.sortBy)
      .set('sortDir', filters.sortDir);

    return this.http.get<PageResponse<AppelOffreSummaryResponse>>(`${this.baseUrl}/all`, {
      params,
    });
  }

  getById(id: number): Observable<AppelOffreResponse> {
    return this.http.get<AppelOffreResponse>(`${this.baseUrl}/${id}`);
  }

  create(request: AppelOffreRequest): Observable<AppelOffreResponse> {
    return this.http.post<AppelOffreResponse>(this.baseUrl, request);
  }

  update(id: number, request: AppelOffreUpdateRequest): Observable<AppelOffreResponse> {
    return this.http.patch<AppelOffreResponse>(`${this.baseUrl}/${id}`, request);
  }

  getHistorique(id: number, page = 0, size = 20): Observable<PageResponse<HistoriqueResponse>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<PageResponse<HistoriqueResponse>>(`${this.baseUrl}/${id}/historique`, {
      params,
    });
  }

  createLot(aoId: number, request: LotRequest): Observable<LotResponse> {
    return this.http.post<LotResponse>(`${this.baseUrl}/${aoId}/lots`, request);
  }

  updateLot(aoId: number, lotId: number, request: LotRequest): Observable<LotResponse> {
    return this.http.put<LotResponse>(`${this.baseUrl}/${aoId}/lots/${lotId}`, request);
  }

  saveDecision(
    aoId: number,
    request: ParticipationDecisionRequest,
  ): Observable<ParticipationDecisionResponse[]> {
    return this.http.post<ParticipationDecisionResponse[]>(
      `${this.baseUrl}/${aoId}/lots/decisions`,
      request,
    );
  }

  getDecisionsByAo(
    aoId: number,
    page = 0,
    size = 200,
  ): Observable<PageResponse<ParticipationDecisionResponse>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<PageResponse<ParticipationDecisionResponse>>(
      `${this.baseUrl}/${aoId}/lots/decisions`,
      { params },
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  validateDecision(
    aoId: number,
    groupeId: string,
    request: ValidationDecisionRequest,
  ): Observable<LotResponse[]> {
    return this.http.patch<LotResponse[]>(
      `${this.baseUrl}/${aoId}/lots/decisions/groupe/${groupeId}`,
      request,
    );
  }
}

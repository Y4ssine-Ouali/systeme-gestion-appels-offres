import { Injectable, signal, computed } from '@angular/core';
import { Subject, switchMap, tap, catchError, of, finalize } from 'rxjs';
import {
  AOFilterValues,
  AppelOffreResponse,
  AppelOffreSummaryResponse,
  HistoriqueResponse,
  PageResponse,
} from '../models/appel-offre.model';
import { AppelsOffresService } from '../services/appels-offres.service';

@Injectable({ providedIn: 'root' })
export class AppelsOffresStore {
  private readonly _page = signal<PageResponse<AppelOffreSummaryResponse>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 20,
    page: 0,
  });
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  private readonly _filters = signal<AOFilterValues>({
    natureMarche: '',
    dateLimiteDepot: '',
    budgetMin: null,
    page: 0,
    size: 20,
    sortBy: 'id',
    sortDir: 'desc',
  });

  private readonly _selectedAo = signal<AppelOffreResponse | null>(null);
  private readonly _detailLoading = signal(false);

  private readonly _historique = signal<HistoriqueResponse[]>([]);
  private readonly _historiqueLoading = signal(false);
  private readonly _historiquePage = signal(0);
  private readonly _historiqueTotalPages = signal(0);

  readonly items = computed(() => this._page().content);
  readonly totalElements = computed(() => this._page().totalElements);
  readonly totalPages = computed(() => this._page().totalPages);
  readonly currentPage = computed(() => this._page().page);
  readonly pageSize = computed(() => this._page().size);
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly filters = this._filters.asReadonly();

  readonly selectedAo = this._selectedAo.asReadonly();
  readonly detailLoading = this._detailLoading.asReadonly();
  readonly historique = this._historique.asReadonly();
  readonly historiqueLoading = this._historiqueLoading.asReadonly();
  readonly historiquePage = this._historiquePage.asReadonly();
  readonly historiqueTotalPages = this._historiqueTotalPages.asReadonly();

  private readonly search$ = new Subject<void>();

  constructor(private readonly api: AppelsOffresService) {
    this.search$
      .pipe(
        tap(() => {
          this._loading.set(true);
          this._error.set(null);
        }),
        switchMap(() =>
          this.api.search(this._filters()).pipe(
            tap((page) => this._page.set(page)),
            catchError((err) => {
              this._error.set(err?.error?.message ?? 'Erreur lors du chargement');
              return of(null);
            }),
            finalize(() => this._loading.set(false)),
          ),
        ),
      )
      .subscribe();
  }

  loadPage(): void {
    this.search$.next();
  }

  setFilters(filters: Partial<AOFilterValues>): void {
    this._filters.update((current) => ({
      ...current,
      ...filters,
      page: filters.page ?? 0,
    }));
    this.search$.next();
  }

  setPage(page: number): void {
    this._filters.update((current) => ({ ...current, page }));
    this.search$.next();
  }

  loadDetail(id: number): void {
    this._detailLoading.set(true);
    this._selectedAo.set(null);
    this.api
      .getById(id)
      .pipe(
        tap((ao) => this._selectedAo.set(ao)),
        catchError((err) => {
          this._error.set(err?.error?.message ?? 'Erreur lors du chargement du détail');
          return of(null);
        }),
        finalize(() => this._detailLoading.set(false)),
      )
      .subscribe();
  }

  refreshDetail(): void {
    const ao = this._selectedAo();
    if (ao) {
      this.loadDetail(ao.id);
    }
  }

  loadHistorique(id: number, page = 0): void {
    this._historiqueLoading.set(true);
    this.api
      .getHistorique(id, page)
      .pipe(
        tap((res) => {
          this._historique.set(res.content);
          this._historiquePage.set(res.page);
          this._historiqueTotalPages.set(res.totalPages);
        }),
        catchError(() => {
          this._historique.set([]);
          return of(null);
        }),
        finalize(() => this._historiqueLoading.set(false)),
      )
      .subscribe();
  }

  clearDetail(): void {
    this._selectedAo.set(null);
    this._historique.set([]);
  }

  deleteAo(id: number): void {
    this.api.delete(id).pipe(
      tap(() => this.search$.next()),
      catchError((err) => {
        this._error.set(err?.error?.message ?? 'Erreur lors de la suppression');
        return of(null);
      }),
    ).subscribe();
  }
}

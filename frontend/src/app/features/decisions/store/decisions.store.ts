import { Injectable, computed, signal } from '@angular/core';
import { Observable, catchError, finalize, forkJoin, of, switchMap, tap } from 'rxjs';
import { AppelsOffresService } from '../../appels-offres/services/appels-offres.service';
import {
  LotDecisionResponse,
  LotResponse,
  ValidationDecisionRequest,
} from '../../appels-offres/models/appel-offre.model';

export interface DecisionGroup {
  groupeId: string;
  aoId: number;
  aoReference: string;
  aoObjet: string;
  currencySymbol: string;
  decision: 'GO' | 'NO_GO';
  dateDecision: string;
  justificationText: string;
  decideurNom: string;
  statutValidation: 'SOUMISE' | 'VALIDEE' | 'REJETEE';
  validateurNom: string | null;
  dateValidation: string | null;
  commentaireValidation: string | null;
  lots: LotDecisionResponse[];
}

@Injectable({ providedIn: 'root' })
export class DecisionsStore {
  private readonly _groups = signal<DecisionGroup[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _validating = signal(false);

  readonly groups = this._groups.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly validating = this._validating.asReadonly();

  readonly pendingGroups = computed(() =>
    this._groups().filter((g) => g.statutValidation === 'SOUMISE'),
  );
  readonly processedGroups = computed(() =>
    this._groups().filter((g) => g.statutValidation !== 'SOUMISE'),
  );

  private readonly USE_DUMMY = false;

  constructor(private readonly api: AppelsOffresService) {}

  loadAll(): void {
    if (this.USE_DUMMY) {
      this._groups.set(DUMMY_DECISIONS);
      return;
    }

    this._loading.set(true);
    this._error.set(null);

    this.api
      .search({
        natureMarche: '',
        dateLimiteDepot: '',
        budgetMin: null,
        page: 0,
        size: 200,
        sortBy: 'id',
        sortDir: 'desc',
      })
      .pipe(
        switchMap((page) => {
          const aoList = page.content;
          if (aoList.length === 0) return of([]);

          const decisionRequests = aoList.map((ao) =>
            this.api.getDecisionsByAo(ao.id).pipe(
              catchError(() => of(null)),
              tap((decPage) => {
                if (!decPage) return;
                for (const dec of decPage.content) {
                  (dec as any)._aoId = ao.id;
                  (dec as any)._aoReference = ao.reference;
                  (dec as any)._aoObjet = ao.objet;
                  (dec as any)._currencySymbol = ao.currencySymbol;
                }
              }),
            ),
          );
          return forkJoin(decisionRequests);
        }),
        tap((results) => {
          const groupMap = new Map<string, DecisionGroup>();

          for (const decPage of results) {
            if (!decPage) continue;
            for (const dec of decPage.content) {
              const existing = groupMap.get(dec.groupeId);
              if (existing) {
                for (const lot of dec.lots) {
                  if (!existing.lots.some((l) => l.lotId === lot.lotId)) {
                    existing.lots.push(lot);
                  }
                }
              } else {
                groupMap.set(dec.groupeId, {
                  groupeId: dec.groupeId,
                  aoId: (dec as any)._aoId,
                  aoReference: (dec as any)._aoReference,
                  aoObjet: (dec as any)._aoObjet,
                  currencySymbol: (dec as any)._currencySymbol,
                  decision: dec.decision,
                  dateDecision: dec.dateDecision,
                  justificationText: dec.justificationText,
                  decideurNom: dec.decideurNom,
                  statutValidation: dec.statutValidation,
                  validateurNom: dec.validateurNom,
                  dateValidation: dec.dateValidation,
                  commentaireValidation: dec.commentaireValidation,
                  lots: [...dec.lots],
                });
              }
            }
          }

          this._groups.set([...groupMap.values()]);
        }),
        catchError((err) => {
          this._error.set(err?.error?.message ?? 'Erreur lors du chargement des décisions');
          return of(null);
        }),
        finalize(() => this._loading.set(false)),
      )
      .subscribe();
  }

  validateDecision(
    aoId: number,
    groupeId: string,
    request: ValidationDecisionRequest,
  ): Observable<LotResponse[] | null> {
    this._validating.set(true);
    this._error.set(null);

    return this.api.validateDecision(aoId, groupeId, request).pipe(
      tap(() => this.loadAll()),
      catchError((err) => {
        this._error.set(err?.error?.message ?? 'Erreur lors de la validation');
        return of(null);
      }),
      finalize(() => this._validating.set(false)),
    );
  }
}

const DUMMY_DECISIONS: DecisionGroup[] = [
  {
    groupeId: 'grp-001',
    aoId: 1,
    aoReference: 'AO-2026-001',
    aoObjet: 'Fourniture et installation de matériel informatique pour le siège social',
    currencySymbol: 'DT',
    decision: 'GO',
    dateDecision: '2026-03-18',
    justificationText:
      "L'appel d'offre correspond parfaitement à notre domaine d'expertise et le budget est en ligne avec nos capacités.",
    decideurNom: 'Karim Benali',
    statutValidation: 'SOUMISE',
    validateurNom: null,
    dateValidation: null,
    commentaireValidation: null,
    lots: [
      { lotId: 1, lotNumero: 1, lotObjet: 'Ordinateurs portables et stations de travail' },
      { lotId: 2, lotNumero: 2, lotObjet: 'Serveurs et équipements réseau' },
    ],
  },
  {
    groupeId: 'grp-002',
    aoId: 2,
    aoReference: 'AO-2026-007',
    aoObjet: "Mise en place d'un système de vidéosurveillance pour les entrepôts",
    currencySymbol: 'DT',
    decision: 'NO_GO',
    dateDecision: '2026-03-20',
    justificationText:
      "Le délai imposé est trop court et nos équipes sont déjà mobilisées sur d'autres projets.",
    decideurNom: 'Fatima Zahra El Mansouri',
    statutValidation: 'SOUMISE',
    validateurNom: null,
    dateValidation: null,
    commentaireValidation: null,
    lots: [{ lotId: 5, lotNumero: 1, lotObjet: 'Caméras et câblage' }],
  },
  {
    groupeId: 'grp-003',
    aoId: 3,
    aoReference: 'AO-2026-003',
    aoObjet: 'Réhabilitation du réseau électrique bâtiment B',
    currencySymbol: 'DT',
    decision: 'GO',
    dateDecision: '2026-03-10',
    justificationText: 'Projet stratégique pour le client SONELGAZ, partenaire historique.',
    decideurNom: 'Ahmed Mekki',
    statutValidation: 'SOUMISE',
    validateurNom: null,
    dateValidation: null,
    commentaireValidation: null,
    lots: [
      { lotId: 8, lotNumero: 1, lotObjet: 'Travaux de câblage haute tension' },
      { lotId: 9, lotNumero: 2, lotObjet: 'Fourniture de transformateurs' },
      { lotId: 10, lotNumero: 3, lotObjet: 'Installation tableaux de distribution' },
    ],
  },
  {
    groupeId: 'grp-100',
    aoId: 10,
    aoReference: 'AO-2026-010',
    aoObjet: 'Aménagement des bureaux de la direction régionale Est',
    currencySymbol: 'DT',
    decision: 'GO',
    dateDecision: '2026-02-25',
    justificationText: 'Excellente opportunité, client fidèle avec un budget confortable.',
    decideurNom: 'Karim Benali',
    statutValidation: 'VALIDEE',
    validateurNom: 'Mohamed Directeur',
    dateValidation: '2026-02-27',
    commentaireValidation: 'Approuvé. Préparer le dossier de soumission en priorité.',
    lots: [
      { lotId: 20, lotNumero: 1, lotObjet: 'Mobilier de bureau' },
      { lotId: 21, lotNumero: 2, lotObjet: 'Climatisation et faux plafond' },
    ],
  },
  {
    groupeId: 'grp-101',
    aoId: 11,
    aoReference: 'AO-2026-012',
    aoObjet: 'Fourniture de pièces détachées pour flotte automobile',
    currencySymbol: '€',
    decision: 'GO',
    dateDecision: '2026-03-01',
    justificationText: 'Nous avons les stocks nécessaires et les marges sont intéressantes.',
    decideurNom: 'Fatima Zahra El Mansouri',
    statutValidation: 'REJETEE',
    validateurNom: 'Mohamed Directeur',
    dateValidation: '2026-03-03',
    commentaireValidation:
      'Budget trop serré par rapport à nos coûts logistiques actuels. Revoir la proposition avec des marges réalistes.',
    lots: [{ lotId: 25, lotNumero: 1, lotObjet: 'Pièces moteur et transmission' }],
  },
];

import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppelsOffresStore } from '../store/appels-offres.store';
import { DocumentsTabComponent } from '../components/documents-tab/documents-tab';
import { NewLotModalComponent } from '../components/new-lot-modal/new-lot-modal';
import { DecisionModalComponent } from '../components/decision-modal/decision-modal';
import { AuthService } from '../../../core/auth/services/auth.service';
import {
  ETAT_GLOBAL_LABELS,
  MODE_PASSATION_LABELS,
  NATURE_MARCHE_LABELS,
  TYPE_AO_LABELS,
  DECISION_LABELS,
  STATUT_VALIDATION_LABELS,
  LotResponse,
} from '../models/appel-offre.model';

@Component({
  selector: 'app-ao-detail',
  standalone: true,
  imports: [
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    DocumentsTabComponent,
    NewLotModalComponent,
    DecisionModalComponent,
  ],
  templateUrl: './ao-detail.html',
  styleUrl: './ao-detail.css',
})
export class AoDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly store = inject(AppelsOffresStore);
  private readonly auth = inject(AuthService);

  readonly etatLabels = ETAT_GLOBAL_LABELS;
  readonly modeLabels = MODE_PASSATION_LABELS;
  readonly natureLabels = NATURE_MARCHE_LABELS;
  readonly typeLabels = TYPE_AO_LABELS;
  readonly decisionLabels = DECISION_LABELS;
  readonly statutLabels = STATUT_VALIDATION_LABELS;

  readonly ao = this.store.selectedAo;
  readonly loading = this.store.detailLoading;
  readonly historique = this.store.historique;
  readonly historiqueLoading = this.store.historiqueLoading;

  readonly showLotModal = signal(false);
  readonly showDecisionModal = signal(false);
  readonly editingLot = signal<LotResponse | null>(null);

  readonly canDecide = computed(() => this.auth.hasRole('ROLE_RESPONSABLE_COMMERCIAL'));

  readonly hasEligibleLots = computed(() => {
    const ao = this.ao();
    if (!ao?.lots?.length) return false;
    return ao.lots.some((lot) => !lot.decision && !lot.etatAvancement);
  });

  readonly budgetFormatted = computed(() => {
    const ao = this.ao();
    if (!ao?.lots?.length) return '—';
    const total = ao.lots.reduce((sum, l) => sum + (l.budgetEstimatif || 0), 0);
    if (!total) return '—';
    return new Intl.NumberFormat('fr-FR').format(total);
  });

  readonly totalBudgetLots = computed(() => {
    const ao = this.ao();
    if (!ao?.lots?.length) return '—';
    const total = ao.lots.reduce((sum, l) => sum + (l.budgetEstimatif || 0), 0);
    if (!total) return '—';
    return new Intl.NumberFormat('fr-FR').format(total);
  });

  readonly sortedLots = computed(() => {
    const ao = this.ao();
    if (!ao?.lots?.length) return [];
    return [...ao.lots].sort((a, b) => a.numero - b.numero);
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.store.loadDetail(id);
      this.store.loadHistorique(id);
    }
  }

  goBack(): void {
    this.router.navigate(['/appels-offres']);
  }

  formatDate(dateStr: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateStr));
  }

  formatBudget(amount: number): string {
    return new Intl.NumberFormat('fr-FR').format(amount);
  }

  formatDateTime(dateStr: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateStr));
  }

  onLotCreated(): void {
    this.closeLotModal();
    this.store.refreshDetail();
  }

  openEditLot(lot: LotResponse): void {
    this.editingLot.set(lot);
    this.showLotModal.set(true);
  }

  closeLotModal(): void {
    this.showLotModal.set(false);
    this.editingLot.set(null);
  }

  onDecisionSaved(): void {
    this.showDecisionModal.set(false);
    this.store.refreshDetail();
  }
}

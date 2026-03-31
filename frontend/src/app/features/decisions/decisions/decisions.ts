import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../../core/auth/services/auth.service';
import { DecisionsStore, DecisionGroup } from '../store/decisions.store';
import { ValidationModalComponent } from '../components/validation-modal/validation-modal';
import {
  DECISION_LABELS,
  STATUT_VALIDATION_LABELS,
} from '../../appels-offres/models/appel-offre.model';

@Component({
  selector: 'app-decisions',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTabsModule,
    ValidationModalComponent,
  ],
  templateUrl: './decisions.html',
  styleUrl: './decisions.css',
})
export class Decisions implements OnInit {
  readonly store = inject(DecisionsStore);
  private readonly auth = inject(AuthService);

  readonly decisionLabels = DECISION_LABELS;
  readonly statutLabels = STATUT_VALIDATION_LABELS;

  readonly isDirection = computed(() => this.auth.hasRole('ROLE_DIRECTION'));
  readonly validationGroup = signal<DecisionGroup | null>(null);

  ngOnInit(): void {
    this.store.loadAll();
  }

  openValidation(group: DecisionGroup): void {
    this.validationGroup.set(group);
  }

  closeValidation(): void {
    this.validationGroup.set(null);
  }

  onValidated(): void {
    this.validationGroup.set(null);
    this.store.loadAll();
  }

  formatDate(dateStr: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr));
  }

  formatBudget(amount: number): string {
    return new Intl.NumberFormat('fr-FR').format(amount);
  }
}

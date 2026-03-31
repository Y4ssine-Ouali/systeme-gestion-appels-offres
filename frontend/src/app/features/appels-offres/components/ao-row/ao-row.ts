import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppelOffreSummaryResponse, ETAT_GLOBAL_LABELS } from '../../models/appel-offre.model';

@Component({
  selector: 'tr[ao-row]',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './ao-row.html',
  styleUrl: './ao-row.css',
})
export class AORow {
  ao = input.required<AppelOffreSummaryResponse>();
  view = output<AppelOffreSummaryResponse>();
  edit = output<AppelOffreSummaryResponse>();
  delete = output<AppelOffreSummaryResponse>();

  readonly etatLabel = computed(() => {
    const etat = this.ao().etatGlobal;
    return etat ? (ETAT_GLOBAL_LABELS[etat] ?? etat) : '—';
  });

  readonly isUrgent = computed(() => {
    const deadline = new Date(this.ao().dateLimiteDepot);
    const now = new Date();
    const diffDays = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  });

  formatBudget(amount: number): string {
    return new Intl.NumberFormat('fr-FR').format(amount);
  }

  formatDate(dateStr: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateStr));
  }
}

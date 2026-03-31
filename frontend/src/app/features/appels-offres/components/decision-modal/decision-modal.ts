import { Component, computed, inject, input, output, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { finalize } from 'rxjs';
import { AppelsOffresService } from '../../services/appels-offres.service';
import { MotifsRefusService } from '../../services/motifs-refus.service';
import { AuthService } from '../../../../core/auth/services/auth.service';
import {
  LotResponse,
  DecisionParticipation,
  MotifRefusReference,
  ParticipationDecisionRequest,
  CATEGORIE_MOTIF_LABELS,
  CategorieMotif,
} from '../../models/appel-offre.model';

interface MotifSelection {
  motif: MotifRefusReference;
  selected: boolean;
  commentaire: string;
}

interface MotifGroup {
  categorie: CategorieMotif;
  label: string;
  items: MotifSelection[];
}

@Component({
  selector: 'app-decision-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatCheckboxModule,
  ],
  templateUrl: './decision-modal.html',
  styleUrl: './decision-modal.css',
})
export class DecisionModalComponent implements OnInit {
  aoId = input.required<number>();
  lots = input.required<LotResponse[]>();
  currencySymbol = input<string>('DT');

  close = output<void>();
  saved = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AppelsOffresService);
  private readonly motifsService = inject(MotifsRefusService);
  private readonly auth = inject(AuthService);

  readonly submitting = signal(false);
  readonly errorMsg = signal<string | null>(null);
  readonly motifGroups = signal<MotifGroup[]>([]);
  readonly categorieLabels = CATEGORIE_MOTIF_LABELS;

  readonly eligibleLots = computed(() =>
    this.lots().filter((lot) => !lot.decision && !lot.etatAvancement),
  );

  readonly selectedLotIds = signal<Set<number>>(new Set());

  readonly form = this.fb.group({
    decision: ['GO' as DecisionParticipation, Validators.required],
    justificationText: ['', [Validators.required, Validators.maxLength(2000)]],
  });

  get isNoGo(): boolean {
    return this.form.get('decision')?.value === 'NO_GO';
  }

  readonly selectedMotifsCount = computed(() =>
    this.motifGroups().reduce((count, g) => count + g.items.filter((i) => i.selected).length, 0),
  );

  ngOnInit(): void {
    this.motifsService.getAll().subscribe({
      next: (motifs) => {
        const groups = new Map<CategorieMotif, MotifSelection[]>();
        for (const m of motifs) {
          const list = groups.get(m.categorie) ?? [];
          list.push({ motif: m, selected: false, commentaire: '' });
          groups.set(m.categorie, list);
        }
        this.motifGroups.set(
          Array.from(groups.entries()).map(([cat, items]) => ({
            categorie: cat,
            label: this.categorieLabels[cat],
            items,
          })),
        );
      },
    });
  }

  toggleLot(lotId: number): void {
    const current = new Set(this.selectedLotIds());
    if (current.has(lotId)) {
      current.delete(lotId);
    } else {
      current.add(lotId);
    }
    this.selectedLotIds.set(current);
  }

  isLotSelected(lotId: number): boolean {
    return this.selectedLotIds().has(lotId);
  }

  toggleAllLots(checked: boolean): void {
    if (checked) {
      this.selectedLotIds.set(new Set(this.eligibleLots().map((l) => l.id)));
    } else {
      this.selectedLotIds.set(new Set());
    }
  }

  get allSelected(): boolean {
    return (
      this.eligibleLots().length > 0 && this.selectedLotIds().size === this.eligibleLots().length
    );
  }

  toggleMotif(groupIdx: number, itemIdx: number): void {
    this.motifGroups.update((groups) => {
      const updated = groups.map((g, gi) =>
        gi === groupIdx
          ? {
              ...g,
              items: g.items.map((item, ii) =>
                ii === itemIdx ? { ...item, selected: !item.selected } : item,
              ),
            }
          : g,
      );
      return updated;
    });
  }

  updateMotifComment(groupIdx: number, itemIdx: number, value: string): void {
    this.motifGroups.update((groups) =>
      groups.map((g, gi) =>
        gi === groupIdx
          ? {
              ...g,
              items: g.items.map((item, ii) =>
                ii === itemIdx ? { ...item, commentaire: value } : item,
              ),
            }
          : g,
      ),
    );
  }

  formatBudget(amount: number): string {
    return new Intl.NumberFormat('fr-FR').format(amount);
  }

  getCategoryIcon(cat: CategorieMotif): string {
    const icons: Record<CategorieMotif, string> = {
      TECHNIQUE: 'engineering',
      FINANCIER: 'account_balance',
      ADMINISTRATIF: 'assignment',
      JURIDIQUE: 'gavel',
      CAPACITE_INTERNE: 'groups',
      AUTRE: 'more_horiz',
    };
    return icons[cat] ?? 'label';
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }

  onSubmit(): void {
    if (this.selectedLotIds().size === 0) {
      this.errorMsg.set('Veuillez sélectionner au moins un lot.');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMsg.set(null);

    const v = this.form.getRawValue();
    const user = this.auth.currentUser();

    const request: ParticipationDecisionRequest = {
      decision: v.decision as DecisionParticipation,
      dateDecision: new Date().toISOString().split('T')[0],
      justificationText: v.justificationText!,
      decideurId: user!.id,
      lotIds: Array.from(this.selectedLotIds()),
      motifs:
        v.decision === 'NO_GO'
          ? this.motifGroups()
              .flatMap((g) => g.items)
              .filter((i) => i.selected)
              .map((i) => ({
                motifRefusId: i.motif.id,
                commentaire: i.commentaire || undefined,
              }))
          : undefined,
    };

    this.api
      .saveDecision(this.aoId(), request)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => this.saved.emit(),
        error: (err) =>
          this.errorMsg.set(err?.error?.message ?? 'Erreur lors de la soumission de la décision'),
      });
  }
}

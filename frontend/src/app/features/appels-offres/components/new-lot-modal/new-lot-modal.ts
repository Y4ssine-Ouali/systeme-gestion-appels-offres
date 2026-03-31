import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { finalize } from 'rxjs';
import { AppelsOffresService } from '../../services/appels-offres.service';
import { LotRequest, LotResponse } from '../../models/appel-offre.model';

@Component({
  selector: 'app-new-lot-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './new-lot-modal.html',
  styleUrl: './new-lot-modal.css',
})
export class NewLotModalComponent implements OnInit {
  aoId = input.required<number>();
  existingLots = input<LotResponse[]>([]);
  lotToEdit = input<LotResponse | null>(null);
  currencySymbol = input<string>('DT');

  close = output<void>();
  created = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AppelsOffresService);

  readonly submitting = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly form = this.fb.group({
    objet: ['', Validators.required],
    budgetEstimatif: [null as number | null, [Validators.required, Validators.min(0)]],
    cautionnementProvisoire: [null as number | null, [Validators.required, Validators.min(0)]],
  });

  get isEdit(): boolean {
    return this.lotToEdit() != null;
  }

  ngOnInit(): void {
    const lot = this.lotToEdit();
    if (lot) {
      this.form.patchValue({
        objet: lot.objet,
        budgetEstimatif: lot.budgetEstimatif,
        cautionnementProvisoire: lot.cautionnementProvisoire,
      });
    }
  }

  private get nextNumero(): number {
    const lots = this.existingLots();
    return lots.length > 0 ? Math.max(...lots.map((l) => l.numero)) + 1 : 1;
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMsg.set(null);

    const v = this.form.getRawValue();
    const lot = this.lotToEdit();

    const request: LotRequest = {
      numero: lot ? lot.numero : this.nextNumero,
      objet: v.objet!,
      budgetEstimatif: v.budgetEstimatif!,
      cautionnementProvisoire: v.cautionnementProvisoire!,
    };

    const call$ = lot
      ? this.api.updateLot(this.aoId(), lot.id, request)
      : this.api.createLot(this.aoId(), request);

    call$.pipe(finalize(() => this.submitting.set(false))).subscribe({
      next: () => this.created.emit(),
      error: (err) =>
        this.errorMsg.set(
          err?.error?.message ??
            (lot ? 'Erreur lors de la modification du lot' : 'Erreur lors de la création du lot'),
        ),
    });
  }
}

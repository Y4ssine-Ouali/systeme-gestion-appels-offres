import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { AuthService } from '../../../../core/auth/services/auth.service';
import { DecisionsStore, DecisionGroup } from '../../store/decisions.store';
import {
  StatutValidation,
  ValidationDecisionRequest,
} from '../../../appels-offres/models/appel-offre.model';

@Component({
  selector: 'app-validation-modal',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
  ],
  templateUrl: './validation-modal.html',
  styleUrl: './validation-modal.css',
})
export class ValidationModalComponent {
  group = input.required<DecisionGroup>();
  close = output<void>();
  validated = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly store = inject(DecisionsStore);

  readonly submitting = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly form = this.fb.group({
    statut: ['VALIDEE' as StatutValidation, Validators.required],
    commentaireValidation: ['', Validators.maxLength(2000)],
  });

  get isRejet(): boolean {
    return this.form.get('statut')?.value === 'REJETEE';
  }

  onStatutChange(): void {
    const ctrl = this.form.get('commentaireValidation')!;
    if (this.isRejet) {
      ctrl.setValidators([Validators.required, Validators.maxLength(2000)]);
    } else {
      ctrl.setValidators([Validators.maxLength(2000)]);
    }
    ctrl.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.auth.currentUser();
    if (!user) {
      this.errorMsg.set('Utilisateur non connecté');
      return;
    }

    const val = this.form.getRawValue();
    const request: ValidationDecisionRequest = {
      statut: val.statut as 'VALIDEE' | 'REJETEE',
      validateurId: user.id,
      dateValidation: new Date().toISOString().split('T')[0],
      commentaireValidation: val.commentaireValidation || undefined,
    };

    this.submitting.set(true);
    this.errorMsg.set(null);

    this.store.validateDecision(this.group().aoId, this.group().groupeId, request).subscribe({
      next: (result) => {
        this.submitting.set(false);
        if (result) {
          this.validated.emit();
        }
      },
      error: () => {
        this.submitting.set(false);
        this.errorMsg.set('Erreur lors de la validation');
      },
    });
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }

  formatBudget(amount: number): string {
    return new Intl.NumberFormat('fr-FR').format(amount);
  }
}

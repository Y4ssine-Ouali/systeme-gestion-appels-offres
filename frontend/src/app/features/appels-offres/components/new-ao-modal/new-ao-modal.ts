import { Component, inject, OnInit, output, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideNativeDateAdapter } from '@angular/material/core';
import { finalize } from 'rxjs';
import { AppelsOffresService } from '../../services/appels-offres.service';
import { ClientsService } from '../../services/clients.service';
import {
  DynamicAttributesComponent,
  ExtraFieldGroup,
} from '../dynamic-attributes/dynamic-attributes';
import {
  AppelOffreRequest,
  AppelOffreType,
  AttributDynamiqueRequest,
  ClientResponse,
  ModePassation,
  NatureMarche,
  TypeSecteur,
  MODE_PASSATION_LABELS,
  NATURE_MARCHE_LABELS,
  TYPE_AO_LABELS,
} from '../../models/appel-offre.model';

@Component({
  selector: 'app-new-ao-modal',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule,
    DynamicAttributesComponent,
  ],
  templateUrl: './new-ao-modal.html',
  styleUrl: './new-ao-modal.css',
})
export class NewAoModalComponent implements OnInit {
  close = output<void>();
  created = output<void>();

  private readonly fb = inject(FormBuilder);
  private readonly api = inject(AppelsOffresService);
  private readonly clientsService = inject(ClientsService);

  readonly submitting = signal(false);
  readonly errorMsg = signal<string | null>(null);

  readonly clients = signal<ClientResponse[]>([]);
  readonly showNewClientForm = signal(false);
  readonly creatingClient = signal(false);

  readonly types: AppelOffreType[] = ['NATIONAL', 'INTERNATIONAL'];
  readonly modes: ModePassation[] = ['OUVERT', 'RESTREINT', 'CONSULTATION'];
  readonly natures: NatureMarche[] = ['PUBLIC', 'PRIVE'];
  readonly secteurs: TypeSecteur[] = ['PUBLIC', 'PRIVE'];
  readonly currencies = [
    { code: 'TND', label: 'TND — Dinar tunisien (DT)' },
    { code: 'EUR', label: 'EUR — Euro (€)' },
    { code: 'USD', label: 'USD — Dollar américain ($)' },
  ];

  readonly typeLabels = TYPE_AO_LABELS;
  readonly modeLabels = MODE_PASSATION_LABELS;
  readonly natureLabels = NATURE_MARCHE_LABELS;

  readonly form = this.fb.group({
    reference: ['', Validators.required],
    appelOffreType: ['NATIONAL' as AppelOffreType, Validators.required],
    modePassation: ['OUVERT' as ModePassation, Validators.required],
    natureMarche: ['PUBLIC' as NatureMarche, Validators.required],
    objet: ['', Validators.required],
    dateOuverture: [null as Date | null, Validators.required],
    dateLimiteDepot: [null as Date | null, Validators.required],
    adresseReception: ['', Validators.required],
    budgetEstimatif: [null as number | null, [Validators.min(0)]],
    currencyCode: ['TND', Validators.required],
    clientId: [null as number | null, Validators.required],
    possibiliteGroupement: [false],
    attributsDynamiques: new FormArray<FormGroup<ExtraFieldGroup>>([]),
  });

  readonly newClientForm = this.fb.group({
    clientName: ['', Validators.required],
    adresse: [''],
    email: ['', [Validators.required, Validators.email]],
    telephone: [''],
    secteur: ['PUBLIC' as TypeSecteur, Validators.required],
  });

  get attributsArray() {
    return this.form.controls.attributsDynamiques;
  }

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.clientsService.getAll().subscribe({
      next: (data) => this.clients.set(data),
    });
  }

  toggleNewClientForm(): void {
    this.showNewClientForm.update((v) => !v);
  }

  createClient(): void {
    if (this.newClientForm.invalid) {
      this.newClientForm.markAllAsTouched();
      return;
    }

    this.creatingClient.set(true);
    const v = this.newClientForm.getRawValue();
    this.clientsService
      .create({
        clientName: v.clientName!,
        adresse: v.adresse || '',
        email: v.email!,
        telephone: v.telephone || '',
        secteur: v.secteur!,
      })
      .pipe(finalize(() => this.creatingClient.set(false)))
      .subscribe({
        next: (client) => {
          this.clients.update((list) => [...list, client]);
          this.form.controls.clientId.setValue(client.id);
          this.showNewClientForm.set(false);
          this.newClientForm.reset({ secteur: 'PUBLIC' });
        },
        error: (err) =>
          this.errorMsg.set(err?.error?.message ?? 'Erreur lors de la création du client'),
      });
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
    const request: AppelOffreRequest = {
      reference: v.reference!,
      appelOffreType: v.appelOffreType!,
      modePassation: v.modePassation!,
      natureMarche: v.natureMarche!,
      objet: v.objet!,
      dateOuverture: this.formatDate(v.dateOuverture!),
      dateLimiteDepot: this.formatDate(v.dateLimiteDepot!),
      adresseReception: v.adresseReception!,
      budgetEstimatif: v.budgetEstimatif ?? undefined,
      currencyCode: v.currencyCode!,
      clientId: v.clientId!,
      possibiliteGroupement: v.possibiliteGroupement ?? false,
      lots: [],
      attributsDynamiques: (v.attributsDynamiques ?? []) as AttributDynamiqueRequest[],
    };

    this.api
      .create(request)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: () => this.created.emit(),
        error: (err) => this.errorMsg.set(err?.error?.message ?? 'Erreur lors de la création'),
      });
  }

  private formatDate(d: Date): string {
    return d.toISOString().split('T')[0];
  }
}

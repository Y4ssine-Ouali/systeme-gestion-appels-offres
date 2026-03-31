import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AOFilterValues, NatureMarche, NATURE_MARCHE_LABELS } from '../../models/appel-offre.model';

@Component({
  selector: 'app-ao-filter-bar',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
  ],
  templateUrl: './ao-filter-bar.html',
  styleUrl: './ao-filter-bar.css',
})
export class AOFilterBar {
  filtersChanged = output<Partial<AOFilterValues>>();

  readonly natures: NatureMarche[] = ['PUBLIC', 'PRIVE'];
  readonly natureLabels = NATURE_MARCHE_LABELS;

  readonly currencies = [
    { code: 'TND', symbol: 'DT' },
    { code: 'EUR', symbol: '€' },
    { code: 'USD', symbol: '$' },
  ];

  readonly natureMarche = signal<NatureMarche | ''>('');
  readonly dateLimiteDepot = signal<Date | null>(null);
  readonly budgetMin = signal<number | null>(null);
  readonly currency = signal<string>('DT');

  emitFilters(): void {
    this.filtersChanged.emit({
      natureMarche: this.natureMarche(),
      dateLimiteDepot: this.dateLimiteDepot()
        ? this.dateLimiteDepot()!.toISOString().split('T')[0]
        : '',
      budgetMin: this.budgetMin(),
    });
  }
}

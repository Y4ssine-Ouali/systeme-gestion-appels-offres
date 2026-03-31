import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AOFilterBar } from '../components/ao-filter-bar/ao-filter-bar';
import { AODataTable } from '../components/ao-data-table/ao-data-table';
import { AOPagination } from '../components/ao-pagination/ao-pagination';
import { NewAOButton } from '../components/new-ao-button/new-ao-button';
import { AOFilterValues, AppelOffreSummaryResponse } from '../models/appel-offre.model';
import { AppelsOffresStore } from '../store/appels-offres.store';
import { NewAoModalComponent } from '../components/new-ao-modal/new-ao-modal';

@Component({
  selector: 'app-appels-offres',
  standalone: true,
  imports: [AOFilterBar, AODataTable, AOPagination, NewAOButton, NewAoModalComponent],
  templateUrl: './appels-offres.html',
  styleUrl: './appels-offres.css',
})
export class AppelsOffres implements OnInit {
  readonly store = inject(AppelsOffresStore);
  private readonly router = inject(Router);

  readonly showModal = signal(false);

  ngOnInit(): void {
    this.store.loadPage();
  }

  onFiltersChanged(filters: Partial<AOFilterValues>): void {
    this.store.setFilters(filters);
  }

  onPageChange(page: number): void {
    this.store.setPage(page - 1);
  }

  onNewAO(): void {
    this.showModal.set(true);
  }

  onModalClose(): void {
    this.showModal.set(false);
  }

  onAoCreated(): void {
    this.showModal.set(false);
    this.store.loadPage();
  }

  onViewAO(ao: AppelOffreSummaryResponse): void {
    this.router.navigate(['/appels-offres', ao.id]);
  }

  onEditAO(ao: AppelOffreSummaryResponse): void {
    this.router.navigate(['/appels-offres', ao.id]);
  }

  onDeleteAO(ao: AppelOffreSummaryResponse): void {
    if (confirm(`Supprimer l'appel d'offre ${ao.reference} ?`)) {
      this.store.deleteAo(ao.id);
    }
  }
}

import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ao-pagination',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './ao-pagination.html',
  styleUrl: './ao-pagination.css',
})
export class AOPagination {
  totalItems = input.required<number>();
  pageSize = input.required<number>();
  currentPage = input.required<number>();
  pageChange = output<number>();

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalItems() / this.pageSize())));

  readonly startItem = computed(() =>
    this.totalItems() === 0 ? 0 : (this.currentPage() - 1) * this.pageSize() + 1,
  );

  readonly endItem = computed(() =>
    Math.min(this.currentPage() * this.pageSize(), this.totalItems()),
  );

  readonly visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 7) {
      for (let index = 1; index <= total; index++) pages.push(index);
      return pages;
    }

    pages.push(1);
    if (current > 3) pages.push(-1);
    for (let index = Math.max(2, current - 1); index <= Math.min(total - 1, current + 1); index++) {
      pages.push(index);
    }
    if (current < total - 2) pages.push(-1);
    pages.push(total);

    return pages;
  });
}

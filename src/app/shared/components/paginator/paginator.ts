import { Component, computed, input, output } from '@angular/core';
import { Pagination } from '../../interfaces/paginator';

const VISIBLE_PAGES = 5;

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.html',
  styleUrl: './paginator.css',
})
export class Paginator {
  readonly pagination = input.required<Pagination<unknown>>();
  readonly pageChange = output<number>();

  protected readonly pages = computed(() => {
    const totalPages = this.pagination().totalPages;
    const currentPage = this.pagination().number + 1;
    const visiblePages = Math.min(VISIBLE_PAGES, totalPages);

    if (visiblePages <= 0) {
      return [];
    }

    let start = Math.max(1, currentPage - Math.floor(VISIBLE_PAGES / 2));
    let end = start + visiblePages - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - visiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  });

  protected select(event: Event, page: number): void {
    event.preventDefault();
    this.goTo(page);
  }

  private goTo(page: number): void {
    const pagination = this.pagination();

    if (page < 0 || page >= pagination.totalPages || page === pagination.number) {
      return;
    }

    this.pageChange.emit(page);
  }
}

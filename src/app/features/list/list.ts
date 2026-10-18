import { Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { catchError, of, switchMap } from 'rxjs';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { Paginator } from '../../shared/components/paginator/paginator';
import { ListService } from './services/list-service';
import { emptyMoviesPage } from './utils/list-utils';

@Component({
  selector: 'app-list',
  imports: [FormsModule, EmptyState, Paginator],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  private readonly listService = inject(ListService);
  private readonly page = signal(0);
  private readonly pageSize = 20;
  protected readonly year = signal('');
  protected readonly winner = signal('');
  private readonly moviesRequest = computed(() => ({
    page: this.page(),
    year: this.year().trim(),
    winner: this.winner(),
  }));

  protected readonly pagination = toSignal(
    toObservable(this.moviesRequest).pipe(
      switchMap((request) =>
        this.listService
          .getMovies({
            page: request.page,
            size: this.pageSize,
            ...(/^\d+$/.test(request.year) ? { year: Number(request.year) } : {}),
            ...(request.winner === 'true' ? { winner: true } : {}),
            ...(request.winner === 'false' ? { winner: false } : {}),
          })
          .pipe(catchError(() => of(emptyMoviesPage(request.page, this.pageSize)))),
      ),
    ),
  );

  protected onPageChange(page: number): void {
    this.page.set(page);
  }

  protected onYearChange(year: string): void {
    this.year.set(year);
    this.page.set(0);
  }

  protected onWinnerChange(winner: string): void {
    this.winner.set(winner);
    this.page.set(0);
  }
}

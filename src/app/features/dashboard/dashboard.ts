import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, of, switchMap } from 'rxjs';
import { Card } from '../../shared/components/card/card';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { MovieData } from '../list/interfaces/list-interface';
import {
  maxMinWinIntervalForProducers,
  StudiosWithWinCountStudios,
  YearsWithMultipleWinners,
} from './interfaces/dashboard-interface';
import { DashboardService } from './services/dashboard-service';

@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, Card, EmptyState],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  private readonly dashboardService = inject(DashboardService);
  protected readonly year = signal('');
  private readonly winnerSearch = signal<{ year: number } | null>(null);

  protected readonly years = toSignal(
    this.dashboardService
      .getYearsWithMultipleWinners()
      .pipe(catchError(() => of<YearsWithMultipleWinners>({ years: [] }))),
  );
  protected readonly producers = toSignal(
    this.dashboardService
      .getMaxMinWinIntervalForProducers()
      .pipe(catchError(() => of<maxMinWinIntervalForProducers>({ min: [], max: [] }))),
  );
  protected readonly topStudios = toSignal(
    this.dashboardService.getStudiosWithWinCount().pipe(
      map((response) =>
        [...response.studios].sort((left, right) => right.winCount - left.winCount).slice(0, 3),
      ),
      catchError(() => of<StudiosWithWinCountStudios[]>([])),
    ),
  );
  protected readonly winners = toSignal(
    toObservable(this.winnerSearch).pipe(
      switchMap((search) => {
        if (!search || !Number.isInteger(search.year)) {
          return of<MovieData[] | undefined>(search ? [] : undefined);
        }

        return this.dashboardService
          .getWinnersByYear(search.year)
          .pipe(catchError(() => of<MovieData[]>([])));
      }),
    ),
  );

  protected searchWinners(): void {
    const trimmed = this.year().trim();
    this.winnerSearch.set({ year: /^\d+$/.test(trimmed) ? Number(trimmed) : Number.NaN });
  }
}

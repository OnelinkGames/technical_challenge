import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { routes } from '../../../shared/utils/api';
import { MovieData } from '../../list/interfaces/list-interface';
import {
  maxMinWinIntervalForProducers,
  StudiosWithWinCount,
  YearsWithMultipleWinners,
} from '../interfaces/dashboard-interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly http = inject(HttpClient);

  getYearsWithMultipleWinners(): Observable<YearsWithMultipleWinners> {
    return this.http.get<YearsWithMultipleWinners>(routes.YEARS_WITH_MULTIPLE_WINNERS);
  }

  getWinnersByYear(year: number): Observable<MovieData[]> {
    return this.http.get<MovieData[]>(routes.WINNERS_BY_YEAR, {
      params: new HttpParams().set('year', year),
    });
  }

  getStudiosWithWinCount(): Observable<StudiosWithWinCount> {
    return this.http.get<StudiosWithWinCount>(routes.STUDIOS_WITH_WIN_COUNT);
  }

  getMaxMinWinIntervalForProducers(): Observable<maxMinWinIntervalForProducers> {
    return this.http.get<maxMinWinIntervalForProducers>(routes.MAX_MIN_INTERVAL_FOR_PRODUCERS);
  }
}

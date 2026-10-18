import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pagination } from '../../../shared/interfaces/paginator';
import { routes } from '../../../shared/utils/api';
import { MovieData } from '../interfaces/list-interface';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  private readonly http = inject(HttpClient);

  getMovies(filters: {
    page: number;
    size: number;
    winner?: boolean;
    year?: number;
  }): Observable<Pagination<MovieData>> {
    return this.http.get<Pagination<MovieData>>(routes.MOVIES, {
      params: this.toParams(filters),
    });
  }

  getMovie(id: number): Observable<MovieData> {
    return this.http.get<MovieData>(`${routes.MOVIES}/${id}`);
  }

  private toParams(filters?: {
    page?: number;
    size?: number;
    winner?: boolean;
    year?: number;
  }): HttpParams {
    let params = new HttpParams();

    if (!filters) {
      return params;
    }

    if (filters.page !== undefined) {
      params = params.set('page', filters.page);
    }

    if (filters.size !== undefined) {
      params = params.set('size', filters.size);
    }

    if (filters.winner !== undefined) {
      params = params.set('winner', filters.winner);
    }

    if (filters.year !== undefined) {
      params = params.set('year', filters.year);
    }

    return params;
  }
}

import { Pagination, Sort } from '../../../shared/interfaces/paginator';
import { MovieData } from '../interfaces/list-interface';

export const emptySort: Sort = { unsorted: true, sorted: false, empty: true };

export function emptyMoviesPage(pageNumber: number, pageSize: number): Pagination<MovieData> {
  return {
    totalPages: 0,
    totalElements: 0,
    pageable: {
      unpaged: false,
      pageNumber,
      paged: true,
      pageSize,
      offset: pageNumber * pageSize,
      sort: emptySort,
    },
    numberOfElement: 0,
    first: true,
    last: true,
    size: pageSize,
    content: [],
    number: pageNumber,
    sort: emptySort,
    empty: true,
  };
}

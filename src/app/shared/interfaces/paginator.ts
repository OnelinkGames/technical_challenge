export interface Sort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

export interface Pageable {
  unpaged: boolean;
  pageNumber: number;
  paged: boolean;
  pageSize: number;
  offset: number;
  sort: Sort;
}

export interface Pagination<T> {
  totalPages: number;
  totalElements: number;
  pageable: Pageable;
  numberOfElement: number;
  first: boolean;
  last: boolean;
  size: number;
  content: T[];
  number: number;
  sort: Sort;
  empty: boolean;
}

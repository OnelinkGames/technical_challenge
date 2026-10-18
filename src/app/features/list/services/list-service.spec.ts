import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Pagination, Sort } from '../../../shared/interfaces/paginator';
import { routes } from '../../../shared/utils/api';
import { MovieData } from '../interfaces/list-interface';
import { ListService } from './list-service';

const sort: Sort = {
  unsorted: true,
  sorted: false,
  empty: true,
};

const movie: MovieData = {
  id: 1,
  year: 1980,
  title: "Can't Stop the Music",
  studios: ['Associated Film Distribution'],
  producers: ['Allan Carr'],
  winner: true,
};

describe('ListService', () => {
  let service: ListService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET the paginated movie list', () => {
    const response: Pagination<MovieData> = {
      totalPages: 1,
      totalElements: 1,
      pageable: {
        unpaged: false,
        pageNumber: 0,
        paged: true,
        pageSize: 10,
        offset: 0,
        sort,
      },
      numberOfElement: 1,
      first: true,
      last: true,
      size: 10,
      content: [movie],
      number: 0,
      sort,
      empty: false,
    };

    service.getMovies({ page: 0, size: 10, winner: true, year: 1980 }).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const request = httpMock.expectOne(
      (req) =>
        req.url === routes.MOVIES &&
        req.params.get('page') === '0' &&
        req.params.get('size') === '10' &&
        req.params.get('winner') === 'true' &&
        req.params.get('year') === '1980',
    );
    expect(request.request.method).toBe('GET');
    request.flush(response);
  });

  it('should GET a movie by id', () => {
    service.getMovie(movie.id).subscribe((data) => {
      expect(data).toEqual(movie);
    });

    const request = httpMock.expectOne(`${routes.MOVIES}/${movie.id}`);
    expect(request.request.method).toBe('GET');
    request.flush(movie);
  });
});

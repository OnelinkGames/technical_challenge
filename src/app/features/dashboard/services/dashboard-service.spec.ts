import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { routes } from '../../../shared/utils/api';
import { MovieData } from '../../list/interfaces/list-interface';
import {
  maxMinWinIntervalForProducers,
  StudiosWithWinCount,
  YearsWithMultipleWinners,
} from '../interfaces/dashboard-interface';
import { DashboardService } from './dashboard-service';

const movie: MovieData = {
  id: 1,
  year: 1980,
  title: "Can't Stop the Music",
  studios: ['Associated Film Distribution'],
  producers: ['Allan Carr'],
  winner: true,
};

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should GET years with multiple winners', () => {
    const response: YearsWithMultipleWinners = {
      years: [{ year: 1986, winnerCount: 2 }],
    };

    service.getYearsWithMultipleWinners().subscribe((data) => {
      expect(data).toEqual(response);
    });

    const request = httpMock.expectOne(routes.YEARS_WITH_MULTIPLE_WINNERS);
    expect(request.request.method).toBe('GET');
    request.flush(response);
  });

  it('should GET winners by year', () => {
    service.getWinnersByYear(2018).subscribe((data) => {
      expect(data).toEqual([movie]);
    });

    const request = httpMock.expectOne(
      (req) => req.url === routes.WINNERS_BY_YEAR && req.params.get('year') === '2018',
    );
    expect(request.request.method).toBe('GET');
    request.flush([movie]);
  });

  it('should GET studios with win count', () => {
    const response: StudiosWithWinCount = {
      studios: [{ name: 'Columbia Pictures', winCount: 7 }],
    };

    service.getStudiosWithWinCount().subscribe((data) => {
      expect(data).toEqual(response);
    });

    const request = httpMock.expectOne(routes.STUDIOS_WITH_WIN_COUNT);
    expect(request.request.method).toBe('GET');
    request.flush(response);
  });

  it('should GET the max and min win interval for producers', () => {
    const response: maxMinWinIntervalForProducers = {
      min: [
        {
          producer: 'Joel Silver',
          interval: 1,
          previousWin: 1990,
          followingWin: 1991,
        },
      ],
      max: [
        {
          producer: 'Matthew Vaughn',
          interval: 13,
          previousWin: 2002,
          followingWin: 2015,
        },
      ],
    };

    service.getMaxMinWinIntervalForProducers().subscribe((data) => {
      expect(data).toEqual(response);
    });

    const request = httpMock.expectOne(routes.MAX_MIN_INTERVAL_FOR_PRODUCERS);
    expect(request.request.method).toBe('GET');
    request.flush(response);
  });
});

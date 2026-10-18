import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { routes } from '../../shared/utils/api';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  let fixture: ComponentFixture<Dashboard>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(Dashboard);
  });

  afterEach(() => {
    httpMock.verify();
  });

  async function flushDashboard(): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    httpMock.expectOne(routes.YEARS_WITH_MULTIPLE_WINNERS).flush({
      years: [
        { year: 1986, winnerCount: 2 },
        { year: 1990, winnerCount: 2 },
      ],
    });
    httpMock.expectOne(routes.STUDIOS_WITH_WIN_COUNT).flush({
      studios: [
        { name: 'Columbia Pictures', winCount: 7 },
        { name: 'Paramount Pictures', winCount: 6 },
        { name: 'Warner Bros.', winCount: 5 },
        { name: '20th Century Fox', winCount: 4 },
      ],
    });
    httpMock.expectOne(routes.MAX_MIN_INTERVAL_FOR_PRODUCERS).flush({
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
    });
    fixture.detectChanges();
  }

  function card(title: string): HTMLElement {
    const match = Array.from(fixture.nativeElement.querySelectorAll('article')).find((item) =>
      (item as HTMLElement).querySelector('h2')?.textContent?.includes(title),
    );

    if (!match) {
      throw new Error(`Card ${title} was not found`);
    }

    return match as HTMLElement;
  }

  function tableRows(table: HTMLTableElement): string[][] {
    return Array.from(table.querySelectorAll('tbody tr')).map((row) =>
      Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent?.trim() ?? ''),
    );
  }

  it('should create', async () => {
    await flushDashboard();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the dashboard title', async () => {
    await flushDashboard();
    expect(fixture.nativeElement.querySelector('h1')?.textContent).toContain('Dashboard');
  });

  it('shows years with multiple winners', async () => {
    await flushDashboard();

    const years = card('List years with multiple winners');
    const table = years.querySelector('table') as HTMLTableElement;

    expect(
      Array.from(table.querySelectorAll('th')).map((header) => header.textContent?.trim()),
    ).toEqual(['Year', 'Win Count']);
    expect(tableRows(table)).toEqual([
      ['1986', '2'],
      ['1990', '2'],
    ]);
  });

  it('shows only the top 3 studios', async () => {
    await flushDashboard();

    const studios = card('Top 3 studios with winners');
    const table = studios.querySelector('table') as HTMLTableElement;

    expect(
      Array.from(table.querySelectorAll('th')).map((header) => header.textContent?.trim()),
    ).toEqual(['Name', 'Win Count']);
    expect(tableRows(table)).toEqual([
      ['Columbia Pictures', '7'],
      ['Paramount Pictures', '6'],
      ['Warner Bros.', '5'],
    ]);
  });

  it('shows the maximum and minimum producer intervals', async () => {
    await flushDashboard();

    const producers = card('Producers with longest and shortest interval between wins');
    const tables = Array.from(producers.querySelectorAll('table')) as HTMLTableElement[];

    expect(producers.textContent).toContain('Maximum');
    expect(producers.textContent).toContain('Minimum');
    expect(
      Array.from(tables[0].querySelectorAll('th')).map((header) => header.textContent?.trim()),
    ).toEqual(['Producer', 'Interval', 'Previous Year', 'Following Year']);
    expect(tableRows(tables[0])).toEqual([['Matthew Vaughn', '13', '2002', '2015']]);
    expect(tableRows(tables[1])).toEqual([['Joel Silver', '1', '1990', '1991']]);
  });

  it('shows an empty winners by year table', async () => {
    await flushDashboard();

    const winners = card('List movie winners by year');
    const table = winners.querySelector('table') as HTMLTableElement;

    expect(
      Array.from(table.querySelectorAll('th')).map((header) => header.textContent?.trim()),
    ).toEqual(['Id', 'Year', 'Title']);
    expect(winners.querySelector('input')?.getAttribute('placeholder')).toBe('search by year');
    expect(winners.querySelector('button')?.getAttribute('aria-label')).toBe('Search');
    expect(table.querySelectorAll('tbody tr')).toHaveLength(0);
    expect(winners.querySelector('app-empty-state')).toBeNull();
  });

  it('lists movie winners for the searched year', async () => {
    await flushDashboard();

    const winners = card('List movie winners by year');
    const input = winners.querySelector('input') as HTMLInputElement;
    input.value = '2018';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await fixture.whenStable();
    httpMock.expectNone((req) => req.url === routes.WINNERS_BY_YEAR);

    winners.querySelector('button')?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const request = httpMock.expectOne(
      (req) => req.url === routes.WINNERS_BY_YEAR && req.params.get('year') === '2018',
    );
    expect(request.request.method).toBe('GET');
    request.flush([
      {
        id: 197,
        year: 2018,
        title: 'Green Book',
        studios: ['Participant Media'],
        producers: ['Jim Burke'],
        winner: true,
      },
    ]);
    fixture.detectChanges();

    const table = winners.querySelector('table') as HTMLTableElement;
    expect(tableRows(table)).toEqual([['197', '2018', 'Green Book']]);
  });

  it('shows the empty state when the searched year has no winners', async () => {
    await flushDashboard();

    const winners = card('List movie winners by year');
    const input = winners.querySelector('input') as HTMLInputElement;
    input.value = '1800';
    input.dispatchEvent(new Event('input'));
    winners.querySelector('button')?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    httpMock
      .expectOne((req) => req.url === routes.WINNERS_BY_YEAR && req.params.get('year') === '1800')
      .flush([]);
    fixture.detectChanges();

    expect(winners.querySelector('app-empty-state')?.textContent).toContain('No results found.');
  });

  it('shows the empty state when a dashboard request fails or returns no rows', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    httpMock
      .expectOne(routes.YEARS_WITH_MULTIPLE_WINNERS)
      .flush('error', { status: 500, statusText: 'Server Error' });
    httpMock.expectOne(routes.STUDIOS_WITH_WIN_COUNT).flush({ studios: [] });
    httpMock.expectOne(routes.MAX_MIN_INTERVAL_FOR_PRODUCERS).flush({ min: [], max: [] });
    fixture.detectChanges();

    expect(
      card('List years with multiple winners').querySelector('app-empty-state')?.textContent,
    ).toContain('No results found.');
    expect(
      card('Top 3 studios with winners').querySelector('app-empty-state')?.textContent,
    ).toContain('No results found.');

    const producers = card('Producers with longest and shortest interval between wins');
    const emptyStates = Array.from(producers.querySelectorAll('app-empty-state'));
    expect(emptyStates).toHaveLength(2);
    expect(emptyStates.every((state) => state.textContent?.includes('No results found.'))).toBe(
      true,
    );
  });

  it('shows the empty state when the winners search fails', async () => {
    await flushDashboard();

    const winners = card('List movie winners by year');
    const input = winners.querySelector('input') as HTMLInputElement;
    input.value = '2018';
    input.dispatchEvent(new Event('input'));
    winners.querySelector('button')?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    httpMock
      .expectOne((req) => req.url === routes.WINNERS_BY_YEAR && req.params.get('year') === '2018')
      .flush('error', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(winners.querySelector('app-empty-state')?.textContent).toContain('No results found.');
  });
});

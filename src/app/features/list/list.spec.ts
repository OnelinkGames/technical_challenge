import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pagination, Sort } from '../../shared/interfaces/paginator';
import { routes } from '../../shared/utils/api';
import { MovieData } from './interfaces/list-interface';
import { List } from './list';

const sort: Sort = {
  unsorted: true,
  sorted: false,
  empty: true,
};

const firstPageMovies: MovieData[] = [
  {
    id: 1,
    year: 1980,
    title: "Can't Stop the Music",
    studios: ['Associated Film Distribution'],
    producers: ['Allan Carr'],
    winner: true,
  },
  {
    id: 2,
    year: 1980,
    title: 'Cruising',
    studios: ['Lorimar Productions'],
    producers: ['Jerry Weintraub'],
    winner: false,
  },
];

const secondPageMovies: MovieData[] = [
  {
    id: 11,
    year: 1981,
    title: 'Mommie Dearest',
    studios: ['Paramount Pictures'],
    producers: ['Frank Yablans'],
    winner: true,
  },
];

function page(content: MovieData[], pageNumber: number, totalPages = 2): Pagination<MovieData> {
  return {
    totalPages,
    totalElements: 11,
    pageable: {
      unpaged: false,
      pageNumber,
      paged: true,
      pageSize: 10,
      offset: pageNumber * 10,
      sort,
    },
    numberOfElement: content.length,
    first: pageNumber === 0,
    last: pageNumber === totalPages - 1,
    size: 10,
    content,
    number: pageNumber,
    sort,
    empty: content.length === 0,
  };
}

describe('List', () => {
  let fixture: ComponentFixture<List>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [List],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(List);
  });

  afterEach(() => {
    httpMock.verify();
  });

  async function flushPage(
    pageNumber: number,
    content: MovieData[],
    filters: { year?: string; winner?: string } = {},
  ): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    const request = httpMock.expectOne(
      (req) =>
        req.url === routes.MOVIES &&
        req.params.get('page') === String(pageNumber) &&
        req.params.get('size') === '20' &&
        req.params.get('year') === (filters.year ?? null) &&
        req.params.get('winner') === (filters.winner ?? null),
    );
    expect(request.request.method).toBe('GET');
    request.flush(page(content, pageNumber));
    fixture.detectChanges();
  }

  it('should create', async () => {
    await flushPage(0, firstPageMovies);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the movie table from the first page', async () => {
    await flushPage(0, firstPageMovies);

    const compiled = fixture.nativeElement as HTMLElement;
    const headers = Array.from(compiled.querySelectorAll('thead th')).map((header) => {
      const label = header.querySelector('span');
      return (label ?? header).textContent?.trim();
    });
    const rows = Array.from(compiled.querySelectorAll('tbody tr')).map((row) =>
      Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent?.trim()),
    );

    expect(compiled.querySelector('h3')?.textContent).toContain('List movies');
    expect(headers).toEqual(['ID', 'Year', 'Title', 'Winner?']);
    expect(rows).toEqual([
      ['1', '1980', "Can't Stop the Music", 'Yes'],
      ['2', '1980', 'Cruising', 'No'],
    ]);
    expect(compiled.querySelector('tfoot app-paginator')).toBeTruthy();
  });

  it('loads another page when the paginator changes page', async () => {
    await flushPage(0, firstPageMovies);

    const next = Array.from(
      fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>,
    ).find((item) => item.textContent?.trim() === '>');
    next?.click();
    fixture.detectChanges();
    await flushPage(1, secondPageMovies);

    const compiled = fixture.nativeElement as HTMLElement;
    const rows = Array.from(compiled.querySelectorAll('tbody tr')).map((row) =>
      Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent?.trim()),
    );

    expect(rows).toEqual([['11', '1981', 'Mommie Dearest', 'Yes']]);
  });

  it('shows the empty state when loading movies fails', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    httpMock
      .expectOne((req) => req.url === routes.MOVIES)
      .flush('error', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-empty-state')?.textContent).toContain(
      'No results found.',
    );
  });

  it('filters by year on each keystroke', async () => {
    await flushPage(0, firstPageMovies);

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '2';
    input.dispatchEvent(new Event('input'));
    await flushPage(0, [], { year: '2' });
    expect(fixture.nativeElement.querySelector('app-empty-state')?.textContent).toContain(
      'No results found.',
    );

    input.value = '2015';
    input.dispatchEvent(new Event('input'));
    await flushPage(
      0,
      [
        {
          id: 180,
          year: 2015,
          title: 'Fantastic Four',
          studios: ['Twentieth Century Fox'],
          producers: ['Simon Kinberg'],
          winner: false,
        },
      ],
      { year: '2015' },
    );

    const rows = Array.from(fixture.nativeElement.querySelectorAll('tbody tr')).map((row) =>
      Array.from((row as HTMLTableRowElement).querySelectorAll('td')).map((cell) =>
        cell.textContent?.trim(),
      ),
    );
    expect(rows).toEqual([['180', '2015', 'Fantastic Four', 'No']]);
  });

  it('filters winners from the dropdown and can show every result again', async () => {
    await flushPage(0, firstPageMovies);

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    const options = Array.from(select.options).map((option) => option.text);

    expect(options).toEqual(['Yes/No', 'Yes', 'No']);

    select.value = 'true';
    select.dispatchEvent(new Event('change'));
    await flushPage(0, [firstPageMovies[0]], { winner: 'true' });

    select.value = 'false';
    select.dispatchEvent(new Event('change'));
    await flushPage(0, [firstPageMovies[1]], { winner: 'false' });

    select.value = '';
    select.dispatchEvent(new Event('change'));
    await flushPage(0, firstPageMovies);

    const rows = Array.from(fixture.nativeElement.querySelectorAll('tbody tr')).map(
      (row) => (row as HTMLTableRowElement).textContent,
    );
    expect(rows.some((row) => row?.includes('Yes'))).toBe(true);
    expect(rows.some((row) => row?.includes('No'))).toBe(true);
  });

  it('returns to the first page when a filter changes', async () => {
    await flushPage(0, firstPageMovies);

    const next = Array.from(
      fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLAnchorElement>,
    ).find((item) => item.textContent?.trim() === '>');
    next?.click();
    await flushPage(1, secondPageMovies);

    const select = fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    select.value = 'true';
    select.dispatchEvent(new Event('change'));
    await flushPage(0, [firstPageMovies[0]], { winner: 'true' });

    const rows = Array.from(fixture.nativeElement.querySelectorAll('tbody tr')).map((row) =>
      Array.from((row as HTMLTableRowElement).querySelectorAll('td')).map((cell) =>
        cell.textContent?.trim(),
      ),
    );
    expect(rows).toEqual([['1', '1980', "Can't Stop the Music", 'Yes']]);
  });
});

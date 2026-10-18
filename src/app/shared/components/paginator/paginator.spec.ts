import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pagination, Sort } from '../../interfaces/paginator';
import { Paginator } from './paginator';

const sort: Sort = {
  unsorted: true,
  sorted: false,
  empty: true,
};

function pagination(pageNumber: number, totalPages: number): Pagination<unknown> {
  return {
    totalPages,
    totalElements: totalPages,
    pageable: {
      unpaged: false,
      pageNumber,
      paged: true,
      pageSize: 10,
      offset: pageNumber * 10,
      sort,
    },
    numberOfElement: 1,
    first: pageNumber === 0,
    last: totalPages === 0 || pageNumber >= totalPages - 1,
    size: 10,
    content: [],
    number: pageNumber,
    sort,
    empty: totalPages === 0,
  };
}

describe('Paginator', () => {
  let fixture: ComponentFixture<Paginator>;
  let component: Paginator;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Paginator],
    }).compileComponents();

    fixture = TestBed.createComponent(Paginator);
    component = fixture.componentInstance;
  });

  function links(): HTMLAnchorElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('a'));
  }

  function linkLabels(): string[] {
    return links().map((link) => link.textContent?.trim() ?? '');
  }

  function link(label: string): HTMLAnchorElement {
    const match = links().find((item) => item.textContent?.trim() === label);

    if (!match) {
      throw new Error(`Link ${label} was not found`);
    }

    return match;
  }

  it('should create', () => {
    fixture.componentRef.setInput('pagination', pagination(0, 1));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('shows the first five pages with first and previous disabled', () => {
    fixture.componentRef.setInput('pagination', pagination(0, 10));
    fixture.detectChanges();

    expect(linkLabels()).toEqual(['<<', '<', '1', '2', '3', '4', '5', '>', '>>']);
    expect(link('<<').getAttribute('aria-disabled')).toBe('true');
    expect(link('<').getAttribute('aria-disabled')).toBe('true');
    expect(link('>').getAttribute('aria-disabled')).toBeNull();
    expect(link('>>').getAttribute('aria-disabled')).toBeNull();
  });

  it('keeps the page window limited to five pages', () => {
    fixture.componentRef.setInput('pagination', pagination(6, 10));
    fixture.detectChanges();

    expect(linkLabels()).toEqual(['<<', '<', '5', '6', '7', '8', '9', '>', '>>']);
  });

  it('shows the last five pages with next and last disabled', () => {
    fixture.componentRef.setInput('pagination', pagination(9, 10));
    fixture.detectChanges();

    expect(linkLabels()).toEqual(['<<', '<', '6', '7', '8', '9', '10', '>', '>>']);
    expect(link('>').getAttribute('aria-disabled')).toBe('true');
    expect(link('>>').getAttribute('aria-disabled')).toBe('true');
  });

  it('shows only the existing pages when there are fewer than five', () => {
    fixture.componentRef.setInput('pagination', pagination(1, 3));
    fixture.detectChanges();

    expect(linkLabels()).toEqual(['<<', '<', '1', '2', '3', '>', '>>']);
  });

  it('emits the selected page', () => {
    fixture.componentRef.setInput('pagination', pagination(0, 10));
    fixture.detectChanges();

    const pages: number[] = [];
    component.pageChange.subscribe((page) => pages.push(page));

    link('4').click();
    link('>').click();
    link('>>').click();

    expect(pages).toEqual([3, 1, 9]);
  });

  it('emits the first and previous pages', () => {
    fixture.componentRef.setInput('pagination', pagination(4, 10));
    fixture.detectChanges();

    const pages: number[] = [];
    component.pageChange.subscribe((page) => pages.push(page));

    link('<<').click();
    link('<').click();

    expect(pages).toEqual([0, 3]);
  });

  it('does not emit when the current page is selected', () => {
    fixture.componentRef.setInput('pagination', pagination(2, 10));
    fixture.detectChanges();

    const pages: number[] = [];
    component.pageChange.subscribe((page) => pages.push(page));

    link('3').click();

    expect(pages).toEqual([]);
    expect(link('3').getAttribute('aria-current')).toBe('page');
    expect(link('3').classList.contains('current')).toBe(true);
  });
});

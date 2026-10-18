import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  let fixture: ComponentFixture<EmptyState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyState],
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyState);
  });

  it('should create', () => {
    fixture.componentRef.setInput('message', 'No results found.');
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the message passed to the component', () => {
    fixture.componentRef.setInput('message', 'No movies found.');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No movies found.');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Toast } from './toast';
import { ToastService } from './service/toast-service';

describe('Toast', () => {
  let fixture: ComponentFixture<Toast>;
  let service: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toast],
    }).compileComponents();

    fixture = TestBed.createComponent(Toast);
    service = TestBed.inject(ToastService);
    fixture.detectChanges();
  });

  it('stays in the top right without taking space in the layout', () => {
    const host = fixture.nativeElement as HTMLElement;
    const style = getComputedStyle(host);

    expect(style.position).toBe('absolute');
    expect(style.top).toBe('16px');
    expect(style.right).toBe('16px');
  });

  it('stacks messages and closes the one that was dismissed', () => {
    service.show('First message');
    service.show('Second message');
    fixture.detectChanges();

    const toasts = Array.from(fixture.nativeElement.querySelectorAll('.toast')) as HTMLElement[];
    expect(toasts.map((toast) => toast.textContent)).toEqual([
      expect.stringContaining('First message'),
      expect.stringContaining('Second message'),
    ]);

    toasts[0].querySelector('button')?.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('First message');
    expect(fixture.nativeElement.textContent).toContain('Second message');
  });
});

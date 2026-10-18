import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from '../app.routes';

describe('Layout', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    });
  });

  it('renders the header and the menu links', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');

    const page = harness.fixture.nativeElement as HTMLElement;
    expect(page.querySelector('header')?.textContent).toContain('Frontend Angular Test');

    const links = Array.from(page.querySelectorAll('nav a')).map((link) => ({
      text: link.textContent?.trim(),
      href: link.getAttribute('href'),
    }));
    expect(links).toEqual([
      { text: 'Dashboard', href: '/dashboard' },
      { text: 'List', href: '/list' },
    ]);
  });

  it('loads the list page in the content area by default', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');

    const page = harness.fixture.nativeElement as HTMLElement;
    expect(page.querySelector('app-layout')).toBeTruthy();
    expect(page.querySelector('main app-list')).toBeTruthy();
    expect(page.querySelector('main app-dashboard')).toBeNull();
  });

  it('loads the dashboard page from its menu link', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/dashboard');

    const page = harness.fixture.nativeElement as HTMLElement;
    expect(page.querySelector('main app-dashboard')).toBeTruthy();
    expect(page.querySelector('main app-list')).toBeNull();
  });

  it('loads the list page from its menu link', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/list');

    const page = harness.fixture.nativeElement as HTMLElement;
    expect(page.querySelector('main app-list')).toBeTruthy();
  });
});

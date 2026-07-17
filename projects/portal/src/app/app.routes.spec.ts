import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app.routes';

describe('portal routes', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes, withComponentInputBinding())],
    });
  });

  it('navigates to the landing page', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');
    const element = harness.routeNativeElement;

    expect(element?.querySelector('h1')?.textContent).toContain(
      'Commit message checks at native speed.',
    );
  });

  it('renders the not-found page for an unknown route', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/missing-page');
    const element = harness.routeNativeElement;

    expect(element?.querySelector('h1')?.textContent).toContain('Page not found');
  });
});

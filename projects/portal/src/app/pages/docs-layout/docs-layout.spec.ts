import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { DocsLayout } from './docs-layout';

function configure(matches: boolean): Promise<void> {
  return TestBed.configureTestingModule({
    imports: [DocsLayout],
    providers: [
      provideRouter([]),
      {
        provide: BreakpointObserver,
        useValue: {
          observe: () => of({ matches, breakpoints: {} } satisfies BreakpointState),
        },
      },
    ],
  }).compileComponents();
}

describe('DocsLayout', () => {
  afterEach(() => TestBed.resetTestingModule());

  it('uses an accessible overlay menu on small screens', async () => {
    await configure(true);
    const fixture = TestBed.createComponent(DocsLayout);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const button = element.querySelector<HTMLButtonElement>('button[aria-controls]');

    expect(button?.getAttribute('aria-controls')).toBe('docs-navigation');
    expect(button?.getAttribute('aria-expanded')).toBe('false');
    expect(element.querySelector('nav[aria-label="Documentation navigation"]')).not.toBeNull();
  });

  it('opens persistent navigation on larger screens', async () => {
    await configure(false);
    const fixture = TestBed.createComponent(DocsLayout);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('button[aria-controls]')).toBeNull();
    expect(element.querySelector('mat-sidenav')?.classList).toContain('mat-drawer-opened');
  });
});

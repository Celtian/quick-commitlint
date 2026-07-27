import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotFound } from './not-found';

describe('NotFound', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NotFound],
      providers: [provideRouter([])],
    });
  });

  it('offers routes back to useful content', async () => {
    const fixture = TestBed.createComponent(NotFound);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h1')?.textContent).toContain('Page not found');
    expect(element.querySelectorAll('a')).toHaveLength(2);
  });
});

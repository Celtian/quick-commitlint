import { TestBed } from '@angular/core/testing';
import { THEME_STORAGE_KEY, Theme } from './theme';

function useSystemTheme(matches: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: vi.fn().mockReturnValue({
      matches,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });
}

describe('Theme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.style.colorScheme = '';
    useSystemTheme(false);
  });

  afterEach(() => TestBed.resetTestingModule());

  it('restores and persists an explicit preference', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    const service = TestBed.inject(Theme);

    expect(service.preference()).toBe('dark');
    expect(service.resolved()).toBe('dark');

    service.setPreference('light');
    TestBed.tick();

    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    expect(document.documentElement.style.colorScheme).toBe('light');
  });

  it('falls back to the device theme for an invalid stored value', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'invalid');
    useSystemTheme(true);
    const service = TestBed.inject(Theme);

    expect(service.preference()).toBe('system');
    expect(service.resolved()).toBe('dark');
    TestBed.tick();
    expect(document.documentElement.style.colorScheme).toBe('light dark');
  });
});

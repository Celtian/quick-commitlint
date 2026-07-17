import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  computed,
  DestroyRef,
  effect,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = Exclude<ThemePreference, 'system'>;

export const THEME_STORAGE_KEY = 'quick-commitlint-theme';

const THEME_PREFERENCES: readonly ThemePreference[] = ['light', 'dark', 'system'];

@Injectable({ providedIn: 'root' })
export class Theme {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly systemDark = signal(false);
  private readonly mediaQuery = this.isBrowser
    ? this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)')
    : undefined;

  readonly preference = signal<ThemePreference>(this.readPreference());
  readonly resolved = computed<ResolvedTheme>(() => {
    const preference = this.preference();
    return preference === 'system' ? (this.systemDark() ? 'dark' : 'light') : preference;
  });

  constructor() {
    this.systemDark.set(this.mediaQuery?.matches ?? false);
    this.mediaQuery?.addEventListener('change', this.handleSystemThemeChange);
    this.destroyRef.onDestroy(() =>
      this.mediaQuery?.removeEventListener('change', this.handleSystemThemeChange),
    );

    effect(() => {
      const preference = this.preference();
      this.document.documentElement.style.colorScheme =
        preference === 'system' ? 'light dark' : preference;

      if (this.isBrowser) {
        this.document.defaultView?.localStorage.setItem(THEME_STORAGE_KEY, preference);
      }
    });
  }

  setPreference(preference: ThemePreference): void {
    this.preference.set(preference);
  }

  private readonly handleSystemThemeChange = (event: MediaQueryListEvent): void => {
    this.systemDark.set(event.matches);
  };

  private readPreference(): ThemePreference {
    if (!this.isBrowser) {
      return 'system';
    }

    const stored = this.document.defaultView?.localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_PREFERENCES.includes(stored as ThemePreference)
      ? (stored as ThemePreference)
      : 'system';
  }
}

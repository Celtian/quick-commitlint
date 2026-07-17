import {
  SecurityContext,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideMarkdown, SANITIZE } from 'ngx-markdown';
import { routes } from './app.routes';
import { SeoTitleStrategy } from './core/seo-title-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled',
      }),
    ),
    provideClientHydration(withEventReplay()),
    provideMarkdown({
      sanitize: {
        provide: SANITIZE,
        useValue: SecurityContext.HTML,
      },
    }),
    { provide: TitleStrategy, useClass: SeoTitleStrategy },
  ],
};

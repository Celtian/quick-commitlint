import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { SITE_URL } from '../site';

const DEFAULT_TITLE = 'Quick Commitlint';
const DEFAULT_DESCRIPTION =
  'Quick Commitlint is a fast, dependency-free Conventional Commit message linter built with Zig.';

@Injectable({ providedIn: 'root' })
export class SeoTitleStrategy extends TitleStrategy {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot) ?? DEFAULT_TITLE;
    const description = this.findDescription(snapshot) ?? DEFAULT_DESCRIPTION;
    const canonicalUrl = this.createCanonicalUrl(snapshot.url);

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: DEFAULT_TITLE });
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' });

    let canonical = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.rel = 'canonical';
      this.document.head.append(canonical);
    }
    canonical.href = canonicalUrl;
  }

  private findDescription(snapshot: RouterStateSnapshot): string | undefined {
    let route = snapshot.root;
    let description: string | undefined;

    while (route) {
      const candidate = route.data['description'];
      if (typeof candidate === 'string') {
        description = candidate;
      }
      route = route.firstChild!;
    }

    return description;
  }

  private createCanonicalUrl(routerUrl: string): string {
    const path = routerUrl.split(/[?#]/u, 1)[0].replace(/^\/+|\/+$/gu, '');
    return new URL(path ? `${path}/` : '', SITE_URL).href;
  }
}

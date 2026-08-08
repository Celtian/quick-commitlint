import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { provideRouter, Router, Routes, TitleStrategy } from '@angular/router';
import { SITE_URL, SOCIAL_IMAGE_ALT, SOCIAL_IMAGE_URL } from '../site';
import { SeoTitleStrategy } from './seo-title-strategy';

const CUSTOM_TITLE = 'Configuration | Quick Commitlint';
const CUSTOM_DESCRIPTION = 'Configure Quick Commitlint for a project.';
const DEFAULT_TITLE = 'Quick Commitlint';
const DEFAULT_DESCRIPTION =
  'Quick Commitlint is a fast, dependency-free Conventional Commit message linter built with Zig.';

@Component({ template: '' })
class TestPage {}

const testRoutes: Routes = [
  {
    path: 'docs',
    data: { description: 'Quick Commitlint documentation.' },
    children: [
      {
        path: 'configuration',
        component: TestPage,
        title: CUSTOM_TITLE,
        data: { description: CUSTOM_DESCRIPTION },
      },
    ],
  },
  {
    path: 'defaults',
    component: TestPage,
  },
];

describe('SeoTitleStrategy', () => {
  beforeEach(() => {
    document.head.querySelector('link[rel="canonical"]')?.remove();
    TestBed.configureTestingModule({
      providers: [
        provideRouter(testRoutes),
        { provide: TitleStrategy, useClass: SeoTitleStrategy },
      ],
    });
  });

  it('applies the deepest route metadata and creates a canonical URL', async () => {
    const router = TestBed.inject(Router);
    const meta = TestBed.inject(Meta);
    const title = TestBed.inject(Title);

    await router.navigateByUrl('/docs/configuration?source=test#install');

    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const canonicalUrl = new URL('docs/configuration/', SITE_URL).href;

    expect(title.getTitle()).toBe(CUSTOM_TITLE);
    expect(meta.getTag('name="description"')?.content).toBe(CUSTOM_DESCRIPTION);
    expect(meta.getTag('property="og:title"')?.content).toBe(CUSTOM_TITLE);
    expect(meta.getTag('property="og:description"')?.content).toBe(CUSTOM_DESCRIPTION);
    expect(meta.getTag('property="og:type"')?.content).toBe('website');
    expect(meta.getTag('property="og:site_name"')?.content).toBe(DEFAULT_TITLE);
    expect(meta.getTag('property="og:url"')?.content).toBe(canonicalUrl);
    expect(meta.getTag('property="og:image"')?.content).toBe(SOCIAL_IMAGE_URL);
    expect(meta.getTag('property="og:image:type"')?.content).toBe('image/png');
    expect(meta.getTag('property="og:image:width"')?.content).toBe('1200');
    expect(meta.getTag('property="og:image:height"')?.content).toBe('630');
    expect(meta.getTag('property="og:image:alt"')?.content).toBe(SOCIAL_IMAGE_ALT);
    expect(meta.getTag('name="twitter:card"')?.content).toBe('summary_large_image');
    expect(meta.getTag('name="twitter:title"')?.content).toBe(CUSTOM_TITLE);
    expect(meta.getTag('name="twitter:description"')?.content).toBe(CUSTOM_DESCRIPTION);
    expect(meta.getTag('name="twitter:image"')?.content).toBe(SOCIAL_IMAGE_URL);
    expect(meta.getTag('name="twitter:image:alt"')?.content).toBe(SOCIAL_IMAGE_ALT);
    expect(canonical?.href).toBe(canonicalUrl);
  });

  it('uses defaults and reuses an existing canonical link', async () => {
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = 'https://example.com/old/';
    document.head.append(canonical);

    const router = TestBed.inject(Router);
    const meta = TestBed.inject(Meta);
    const title = TestBed.inject(Title);

    await router.navigateByUrl('/defaults?source=test#top');

    expect(title.getTitle()).toBe(DEFAULT_TITLE);
    expect(meta.getTag('name="description"')?.content).toBe(DEFAULT_DESCRIPTION);
    expect(meta.getTag('name="twitter:title"')?.content).toBe(DEFAULT_TITLE);
    expect(meta.getTag('name="twitter:description"')?.content).toBe(DEFAULT_DESCRIPTION);
    expect(document.head.querySelector('link[rel="canonical"]')).toBe(canonical);
    expect(canonical.href).toBe(new URL('defaults/', SITE_URL).href);
  });
});

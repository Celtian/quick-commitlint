import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

interface ExpectedPage {
  readonly route: string;
  readonly heading: string;
  readonly title: string;
  readonly description: string;
}

const outputDirectory = path.resolve('dist/portal/browser');
const siteUrl = 'https://celtian.github.io/quick-commitlint/';

const pages: readonly ExpectedPage[] = [
  {
    route: '',
    heading: 'Commit message checks at native speed.',
    title: 'Quick Commitlint — Fast native commit message linting',
    description:
      'Quick Commitlint is a fast, dependency-free Conventional Commit message linter built with Zig.',
  },
  {
    route: 'docs',
    heading: 'Getting started',
    title: 'Getting started | Quick Commitlint',
    description: 'Install Quick Commitlint and lint your first Conventional Commit message.',
  },
  {
    route: 'docs/getting-started',
    heading: 'Getting started',
    title: 'Getting started | Quick Commitlint',
    description: 'Install Quick Commitlint and lint your first Conventional Commit message.',
  },
  {
    route: 'docs/usage',
    heading: 'Usage',
    title: 'Usage | Quick Commitlint',
    description: 'Use Quick Commitlint from standard input, files, and Git commit hooks.',
  },
  {
    route: 'docs/message-format',
    heading: 'Commit message format',
    title: 'Commit message format | Quick Commitlint',
    description:
      'Understand the commit header, body, footer, and breaking-change syntax parsed by Quick Commitlint.',
  },
  {
    route: 'docs/configuration',
    heading: 'Configuration',
    title: 'Configuration | Quick Commitlint',
    description: 'Configure Quick Commitlint presets, rules, severities, and conditions.',
  },
  {
    route: 'docs/presets',
    heading: 'Presets',
    title: 'Presets | Quick Commitlint',
    description:
      'Compare every Conventional and Angular preset rule, type, and default used by Quick Commitlint.',
  },
  {
    route: 'docs/rules',
    heading: 'Rules',
    title: 'Rules | Quick Commitlint',
    description: 'Reference the rules supported by Quick Commitlint and its built-in presets.',
  },
  {
    route: 'docs/compatibility',
    heading: 'Commitlint compatibility',
    title: 'Commitlint compatibility | Quick Commitlint',
    description:
      'See which commitlint behavior Quick Commitlint supports and where the native CLI deliberately differs.',
  },
  {
    route: 'docs/cli',
    heading: 'CLI reference',
    title: 'CLI reference | Quick Commitlint',
    description: 'Quick Commitlint command-line options, inputs, outputs, and exit codes.',
  },
  {
    route: 'docs/development',
    heading: 'Development',
    title: 'Development | Quick Commitlint',
    description: 'Build, test, package, benchmark, and contribute to Quick Commitlint.',
  },
  {
    route: '404',
    heading: 'Page not found',
    title: 'Page not found | Quick Commitlint',
    description: 'The requested Quick Commitlint documentation page could not be found.',
  },
];

function pagePath(route: string): string {
  return route
    ? path.join(outputDirectory, route, 'index.html')
    : path.join(outputDirectory, 'index.html');
}

function canonicalUrl(route: string): string {
  return new URL(route ? `${route}/` : '', siteUrl).href;
}

async function main(): Promise<void> {
  const renderedPages = new Map<string, string>();

  for (const page of pages) {
    const html = await readFile(pagePath(page.route), 'utf8');
    renderedPages.set(page.route, html);
    const label = page.route || '/';

    assert.match(html, /<html[^>]+lang="en"/u, `${label} must declare English content`);
    assert.match(html, /<header\b/u, `${label} must contain a header landmark`);
    assert.match(html, /<main\b[^>]*id="main-content"/u, `${label} must contain the main landmark`);
    assert.match(html, /<footer\b/u, `${label} must contain a footer landmark`);
    assert.match(html, /<h1\b/u, `${label} must contain a level-one heading`);
    assert.ok(html.includes(page.heading), `${label} must prerender its visible heading`);
    assert.ok(html.includes(`<title>${page.title}</title>`), `${label} must prerender its title`);
    assert.ok(html.includes(page.description), `${label} must prerender its description`);
    assert.ok(html.includes(canonicalUrl(page.route)), `${label} must prerender its canonical URL`);
    assert.ok(!html.includes('href="../'), `${label} must not contain base-href-unsafe links`);
  }

  const ruleReference = renderedPages.get('docs/rules') ?? '';
  for (const rule of [
    'body-leading-blank',
    'body-max-line-length',
    'footer-leading-blank',
    'footer-max-line-length',
    'header-max-length',
    'header-trim',
    'scope-case',
    'subject-case',
    'subject-empty',
    'subject-exclamation-mark',
    'subject-full-stop',
    'type-case',
    'type-empty',
    'type-enum',
  ]) {
    assert.ok(ruleReference.includes(rule), `rules reference must document ${rule}`);
  }

  const presetReference = renderedPages.get('docs/presets') ?? '';
  assert.ok(
    presetReference.includes('Conventional'),
    'preset reference must document Conventional',
  );
  assert.ok(presetReference.includes('Angular'), 'preset reference must document Angular');

  await readFile(path.join(outputDirectory, 'robots.txt'), 'utf8');
  const sitemap = await readFile(path.join(outputDirectory, 'sitemap.xml'), 'utf8');
  for (const page of pages.filter((page) => page.route !== 'docs' && page.route !== '404')) {
    assert.ok(
      sitemap.includes(canonicalUrl(page.route)),
      `sitemap must contain ${canonicalUrl(page.route)}`,
    );
  }

  console.log(`Verified ${pages.length} prerendered portal pages and SEO assets.`);
}

void main();

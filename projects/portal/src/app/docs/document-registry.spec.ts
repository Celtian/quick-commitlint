import { DOCUMENTS, DOCUMENT_GROUPS } from './document-registry';

const rules = [
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
] as const;

describe('document registry', () => {
  let markdownByPath: ReadonlyMap<string, string>;

  beforeAll(async () => {
    const markdown = await Promise.all(DOCUMENTS.map((document) => document.load()));
    markdownByPath = new Map(
      DOCUMENTS.map((document, index) => [document.path, markdown[index]!] as const),
    );
  });

  function markdownFor(path: string): string {
    const markdown = markdownByPath.get(path);
    expect(markdown).toBeDefined();
    return markdown!;
  }

  it('uses unique paths and known navigation groups', () => {
    expect(new Set(DOCUMENTS.map((document) => document.path)).size).toBe(DOCUMENTS.length);
    expect(DOCUMENTS.every((document) => DOCUMENT_GROUPS.includes(document.group))).toBe(true);
  });

  it('loads Markdown with a matching level-one heading', () => {
    for (const document of DOCUMENTS) {
      const markdown = markdownFor(document.path);
      expect(markdown.startsWith(`# ${document.heading}\n`)).toBe(true);
    }
  });

  it('documents every supported rule and both presets', () => {
    const ruleDocument = DOCUMENTS.find((document) => document.path === 'rules');
    const presetDocument = DOCUMENTS.find((document) => document.path === 'presets');
    expect(ruleDocument).toBeDefined();
    expect(presetDocument).toBeDefined();

    const ruleMarkdown = markdownFor(ruleDocument!.path);
    const presetMarkdown = markdownFor(presetDocument!.path);

    for (const rule of rules) {
      expect(ruleMarkdown).toContain(`\`${rule}\``);
      expect(presetMarkdown).toContain(`\`${rule}\``);
    }
    expect(presetMarkdown).toContain('`conventional`');
    expect(presetMarkdown).toContain('`angular`');
  });

  it('identifies the commitlint CLI and both reference preset versions', () => {
    const compatibilityMarkdown = markdownFor('compatibility');
    const performanceMarkdown = markdownFor('performance');

    expect(compatibilityMarkdown).toContain('`@commitlint/cli` 21.2.1');
    expect(compatibilityMarkdown).toContain('`@commitlint/config-conventional` 21.2.0');
    expect(compatibilityMarkdown).toContain('`@commitlint/config-angular` 21.2.0');
    expect(compatibilityMarkdown).toContain('[Performance](docs/performance/)');
    expect(performanceMarkdown).toContain('## Reference cold-process benchmark');
    expect(performanceMarkdown).toMatch(
      /\|\s+Conventional\s+\|\s+\d+\.\d{3} ms\s+\|\s+\d+\.\d{3} ms\s+\|\s+\d+\.\d×\s+\|/u,
    );
    expect(performanceMarkdown).toMatch(
      /\|\s+Angular\s+\|\s+\d+\.\d{3} ms\s+\|\s+\d+\.\d{3} ms\s+\|\s+\d+\.\d×\s+\|/u,
    );
  });
});

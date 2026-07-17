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
  it('uses unique paths and known navigation groups', () => {
    expect(new Set(DOCUMENTS.map((document) => document.path)).size).toBe(DOCUMENTS.length);
    expect(DOCUMENTS.every((document) => DOCUMENT_GROUPS.includes(document.group))).toBe(true);
  });

  it('loads Markdown with a matching level-one heading', async () => {
    for (const document of DOCUMENTS) {
      const markdown = await document.load();
      expect(markdown.startsWith(`# ${document.heading}\n`)).toBe(true);
    }
  });

  it('documents every supported rule and both presets', async () => {
    const ruleDocument = DOCUMENTS.find((document) => document.path === 'rules');
    const presetDocument = DOCUMENTS.find((document) => document.path === 'presets');
    expect(ruleDocument).toBeDefined();
    expect(presetDocument).toBeDefined();

    const [ruleMarkdown, presetMarkdown] = await Promise.all([
      ruleDocument!.load(),
      presetDocument!.load(),
    ]);
    for (const rule of rules) {
      expect(ruleMarkdown).toContain(`\`${rule}\``);
      expect(presetMarkdown).toContain(`\`${rule}\``);
    }
    expect(presetMarkdown).toContain('`conventional`');
    expect(presetMarkdown).toContain('`angular`');
  });
});

export interface DocumentDefinition {
  readonly path: string;
  readonly label: string;
  readonly group: DocumentGroup;
  readonly title: string;
  readonly description: string;
  readonly heading: string;
  readonly load: () => Promise<string>;
}

export type DocumentGroup = 'Guide' | 'Reference' | 'Project';

export const DOCUMENT_GROUPS = [
  'Guide',
  'Reference',
  'Project',
] as const satisfies readonly DocumentGroup[];

export const DOCUMENTS = [
  {
    path: 'getting-started',
    label: 'Getting started',
    group: 'Guide',
    title: 'Getting started | Quick Commitlint',
    description: 'Install Quick Commitlint and lint your first Conventional Commit message.',
    heading: 'Getting started',
    load: () => import('./content/getting-started.md').then((module) => module.default),
  },
  {
    path: 'usage',
    label: 'Usage',
    group: 'Guide',
    title: 'Usage | Quick Commitlint',
    description: 'Use Quick Commitlint from standard input, files, and Git commit hooks.',
    heading: 'Usage',
    load: () => import('./content/usage.md').then((module) => module.default),
  },
  {
    path: 'message-format',
    label: 'Message format',
    group: 'Guide',
    title: 'Commit message format | Quick Commitlint',
    description:
      'Understand the commit header, body, footer, and breaking-change syntax parsed by Quick Commitlint.',
    heading: 'Commit message format',
    load: () => import('./content/message-format.md').then((module) => module.default),
  },
  {
    path: 'configuration',
    label: 'Configuration',
    group: 'Reference',
    title: 'Configuration | Quick Commitlint',
    description: 'Configure Quick Commitlint presets, rules, severities, and conditions.',
    heading: 'Configuration',
    load: () => import('./content/configuration.md').then((module) => module.default),
  },
  {
    path: 'presets',
    label: 'Presets',
    group: 'Reference',
    title: 'Presets | Quick Commitlint',
    description:
      'Compare every Conventional and Angular preset rule, type, and default used by Quick Commitlint.',
    heading: 'Presets',
    load: () => import('./content/presets.md').then((module) => module.default),
  },
  {
    path: 'rules',
    label: 'Rules',
    group: 'Reference',
    title: 'Rules | Quick Commitlint',
    description: 'Reference the rules supported by Quick Commitlint and its built-in presets.',
    heading: 'Rules',
    load: () => import('./content/rules.md').then((module) => module.default),
  },
  {
    path: 'cli',
    label: 'CLI reference',
    group: 'Reference',
    title: 'CLI reference | Quick Commitlint',
    description: 'Quick Commitlint command-line options, inputs, outputs, and exit codes.',
    heading: 'CLI reference',
    load: () => import('./content/cli.md').then((module) => module.default),
  },
  {
    path: 'compatibility',
    label: 'Commitlint compatibility',
    group: 'Reference',
    title: 'Commitlint compatibility | Quick Commitlint',
    description:
      'See which commitlint behavior Quick Commitlint supports and where the native CLI deliberately differs.',
    heading: 'Commitlint compatibility',
    load: () => import('./content/compatibility.md').then((module) => module.default),
  },
  {
    path: 'development',
    label: 'Development',
    group: 'Project',
    title: 'Development | Quick Commitlint',
    description: 'Build, test, package, benchmark, and contribute to Quick Commitlint.',
    heading: 'Development',
    load: () => import('./content/development.md').then((module) => module.default),
  },
] as const satisfies readonly DocumentDefinition[];

export interface DocumentDefinition {
  readonly path: string;
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly heading: string;
  readonly load: () => Promise<string>;
}

export const DOCUMENTS = [
  {
    path: 'getting-started',
    label: 'Getting started',
    title: 'Getting started | Quick Commitlint',
    description: 'Install Quick Commitlint and lint your first Conventional Commit message.',
    heading: 'Getting started',
    load: () => import('./content/getting-started.md').then((module) => module.default),
  },
  {
    path: 'usage',
    label: 'Usage',
    title: 'Usage | Quick Commitlint',
    description: 'Use Quick Commitlint from standard input, files, and Git commit hooks.',
    heading: 'Usage',
    load: () => import('./content/usage.md').then((module) => module.default),
  },
  {
    path: 'configuration',
    label: 'Configuration',
    title: 'Configuration | Quick Commitlint',
    description: 'Configure Quick Commitlint presets, rules, severities, and conditions.',
    heading: 'Configuration',
    load: () => import('./content/configuration.md').then((module) => module.default),
  },
  {
    path: 'rules',
    label: 'Rules',
    title: 'Rules | Quick Commitlint',
    description: 'Reference the rules supported by Quick Commitlint and its built-in presets.',
    heading: 'Rules',
    load: () => import('./content/rules.md').then((module) => module.default),
  },
  {
    path: 'cli',
    label: 'CLI reference',
    title: 'CLI reference | Quick Commitlint',
    description: 'Quick Commitlint command-line options, inputs, outputs, and exit codes.',
    heading: 'CLI reference',
    load: () => import('./content/cli.md').then((module) => module.default),
  },
  {
    path: 'development',
    label: 'Development',
    title: 'Development | Quick Commitlint',
    description: 'Build, test, package, benchmark, and contribute to Quick Commitlint.',
    heading: 'Development',
    load: () => import('./content/development.md').then((module) => module.default),
  },
] as const satisfies readonly DocumentDefinition[];

import { spawnSync } from 'child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';

const native = resolve(__dirname, '..', 'zig-out', 'bin', 'quick-commitlint');
const commitlint = resolve(__dirname, '..', 'node_modules', '@commitlint', 'cli', 'cli.js');

type CompatibilityCase = {
  name: string;
  message: string;
  expectedPass: boolean;
  expectedRule?: string;
  unexpectedRule?: string;
};

const conventionalTypes = [
  'build',
  'chore',
  'ci',
  'docs',
  'feat',
  'fix',
  'perf',
  'refactor',
  'revert',
  'style',
  'test'
];
const angularTypes = ['build', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'];

const conventionalCorpus: CompatibilityCase[] = [
  ...conventionalTypes.map((type) => ({
    name: `allows ${type} type`,
    message: `${type}: some message`,
    expectedPass: true
  })),
  {
    name: 'rejects unknown type',
    message: 'foo: some message',
    expectedPass: false,
    expectedRule: 'type-enum'
  },
  {
    name: 'rejects uppercase type',
    message: 'FIX: some message',
    expectedPass: false,
    expectedRule: 'type-case'
  },
  {
    name: 'rejects empty type',
    message: ': some message',
    expectedPass: false,
    expectedRule: 'type-empty'
  },
  {
    name: 'allows uppercase scope',
    message: 'fix(SCOPE): some message',
    expectedPass: true
  },
  {
    name: 'rejects sentence-case subject',
    message: 'fix(scope): Some message',
    expectedPass: false,
    expectedRule: 'subject-case'
  },
  {
    name: 'rejects start-case subject',
    message: 'fix(scope): Some Message',
    expectedPass: false,
    expectedRule: 'subject-case'
  },
  {
    name: 'rejects pascal-case subject',
    message: 'fix(scope): SomeMessage',
    expectedPass: false,
    expectedRule: 'subject-case'
  },
  {
    name: 'rejects upper-case subject',
    message: 'fix(scope): SOMEMESSAGE',
    expectedPass: false,
    expectedRule: 'subject-case'
  },
  {
    name: 'allows lower-case subject',
    message: 'fix(scope): some message',
    expectedPass: true
  },
  {
    name: 'allows mixed-case subject',
    message: 'fix(scope): some Message',
    expectedPass: true
  },
  {
    name: 'rejects empty subject',
    message: 'fix:',
    expectedPass: false,
    expectedRule: 'subject-empty'
  },
  {
    name: 'rejects subject full stop',
    message: 'fix: some message.',
    expectedPass: false,
    expectedRule: 'subject-full-stop'
  },
  {
    name: 'allows breaking-change exclamation mark',
    message: 'feat!: change public API',
    expectedPass: true
  },
  {
    name: 'allows 100-character header',
    message: `fix: ${'a'.repeat(95)}`,
    expectedPass: true
  },
  {
    name: 'rejects 101-character header',
    message: `fix: ${'a'.repeat(96)}`,
    expectedPass: false,
    expectedRule: 'header-max-length'
  },
  {
    name: 'rejects leading header whitespace',
    message: ' fix: some message',
    expectedPass: false,
    expectedRule: 'header-trim'
  },
  {
    name: 'rejects trailing header whitespace',
    message: 'fix: some message ',
    expectedPass: false,
    expectedRule: 'header-trim'
  },
  {
    name: 'warns when body has no leading blank',
    message: 'feat: some message\nbody',
    expectedPass: true,
    expectedRule: 'body-leading-blank'
  },
  {
    name: 'allows body with leading blank',
    message: 'feat: some message\n\nbody',
    expectedPass: true,
    unexpectedRule: 'body-leading-blank'
  },
  {
    name: 'allows 100-character body line',
    message: `feat: some message\n\n${'a'.repeat(100)}`,
    expectedPass: true
  },
  {
    name: 'rejects 101-character body line',
    message: `feat: some message\n\n${'a'.repeat(101)}`,
    expectedPass: false,
    expectedRule: 'body-max-line-length'
  },
  {
    name: 'warns when footer has no leading blank',
    message: 'feat: some message\nRefs: #1',
    expectedPass: true,
    expectedRule: 'footer-leading-blank'
  },
  {
    name: 'allows footer with leading blank',
    message: 'feat: some message\n\nRefs: #1',
    expectedPass: true,
    unexpectedRule: 'footer-leading-blank'
  },
  {
    name: 'allows 100-character footer line',
    message: `feat: some message\n\nBREAKING CHANGE: ${'a'.repeat(83)}`,
    expectedPass: true
  },
  {
    name: 'rejects 101-character footer line',
    message: `feat: some message\n\nBREAKING CHANGE: ${'a'.repeat(84)}`,
    expectedPass: false,
    expectedRule: 'footer-max-line-length'
  }
];

const angularCorpus: CompatibilityCase[] = [
  ...angularTypes.map((type) => ({
    name: `allows ${type} type`,
    message: `${type}: some message`,
    expectedPass: true
  })),
  {
    name: 'rejects unknown type',
    message: 'foo: some message',
    expectedPass: false,
    expectedRule: 'type-enum'
  },
  {
    name: 'rejects uppercase type',
    message: 'FIX: some message',
    expectedPass: false,
    expectedRule: 'type-case'
  },
  {
    name: 'rejects empty type',
    message: ': some message',
    expectedPass: false,
    expectedRule: 'type-empty'
  },
  {
    name: 'allows lowercase scope',
    message: 'fix(scope): some message',
    expectedPass: true
  },
  {
    name: 'rejects uppercase scope',
    message: 'fix(SCOPE): some message',
    expectedPass: false,
    expectedRule: 'scope-case'
  },
  {
    name: 'rejects sentence-case subject',
    message: 'fix(scope): Some message',
    expectedPass: false,
    expectedRule: 'subject-case'
  },
  {
    name: 'rejects start-case subject',
    message: 'fix(scope): Some Message',
    expectedPass: false,
    expectedRule: 'subject-case'
  },
  {
    name: 'rejects pascal-case subject',
    message: 'fix(scope): SomeMessage',
    expectedPass: false,
    expectedRule: 'subject-case'
  },
  {
    name: 'rejects upper-case subject',
    message: 'fix(scope): SOMEMESSAGE',
    expectedPass: false,
    expectedRule: 'subject-case'
  },
  {
    name: 'allows lower-case subject',
    message: 'fix(scope): some message',
    expectedPass: true
  },
  {
    name: 'allows mixed-case subject',
    message: 'fix(scope): some Message',
    expectedPass: true
  },
  {
    name: 'rejects empty subject',
    message: 'fix:',
    expectedPass: false,
    expectedRule: 'subject-empty'
  },
  {
    name: 'rejects subject full stop',
    message: 'fix: some message.',
    expectedPass: false,
    expectedRule: 'subject-full-stop'
  },
  {
    name: 'rejects breaking-change exclamation mark',
    message: 'feat!: change public API',
    expectedPass: false,
    expectedRule: 'subject-exclamation-mark'
  },
  {
    name: 'allows 72-character header',
    message: `fix: ${'a'.repeat(67)}`,
    expectedPass: true
  },
  {
    name: 'rejects 73-character header',
    message: `fix: ${'a'.repeat(68)}`,
    expectedPass: false,
    expectedRule: 'header-max-length'
  },
  {
    name: 'warns when body has no leading blank',
    message: 'feat: some message\nbody',
    expectedPass: true,
    expectedRule: 'body-leading-blank'
  },
  {
    name: 'allows body with leading blank',
    message: 'feat: some message\n\nbody',
    expectedPass: true,
    unexpectedRule: 'body-leading-blank'
  },
  {
    name: 'warns when footer has no leading blank',
    message: 'feat: some message\nRefs: #1',
    expectedPass: true,
    expectedRule: 'footer-leading-blank'
  },
  {
    name: 'allows footer with leading blank',
    message: 'feat: some message\n\nRefs: #1',
    expectedPass: true,
    unexpectedRule: 'footer-leading-blank'
  }
];

const temp = mkdtempSync(join(tmpdir(), 'quick-commitlint-differential-'));
const angularConfig = join(temp, 'angular.json');
writeFileSync(angularConfig, '{"preset":"angular"}\n');

function compare(
  corpus: ReadonlyArray<CompatibilityCase>,
  nativeArgs: string[],
  preset: string
): void {
  for (const testCase of corpus) {
    const nativeResult = spawnSync(native, nativeArgs, { input: testCase.message, encoding: 'utf8' });
    const nodeResult = spawnSync(process.execPath, [commitlint, '--extends', preset], {
      input: testCase.message,
      encoding: 'utf8',
      cwd: resolve(__dirname, '..')
    });
    const nativePass = nativeResult.status === 0;
    const nodePass = nodeResult.status === 0;
    if (
      nativePass !== testCase.expectedPass ||
      nodePass !== testCase.expectedPass ||
      nativePass !== nodePass
    ) {
      throw new Error(
        `Differential mismatch for ${testCase.name} (${JSON.stringify(testCase.message)}) using ${preset}: ` +
          `quick-commitlint=${nativeResult.status}, commitlint=${nodeResult.status}, ` +
          `expectedPass=${testCase.expectedPass}`
      );
    }

    const nativeOutput = `${nativeResult.stdout}${nativeResult.stderr}`;
    const nodeOutput = `${nodeResult.stdout}${nodeResult.stderr}`;
    if (testCase.expectedRule) {
      const marker = `[${testCase.expectedRule}]`;
      if (!nativeOutput.includes(marker) || !nodeOutput.includes(marker)) {
        throw new Error(
          `Missing ${testCase.expectedRule} diagnostic for ${testCase.name}: ` +
            `quick-commitlint=${JSON.stringify(nativeOutput)}, commitlint=${JSON.stringify(nodeOutput)}`
        );
      }
    }
    if (testCase.unexpectedRule) {
      const marker = `[${testCase.unexpectedRule}]`;
      if (nativeOutput.includes(marker) || nodeOutput.includes(marker)) {
        throw new Error(
          `Unexpected ${testCase.unexpectedRule} diagnostic for ${testCase.name}: ` +
            `quick-commitlint=${JSON.stringify(nativeOutput)}, commitlint=${JSON.stringify(nodeOutput)}`
        );
      }
    }
  }
}

try {
  compare(conventionalCorpus, [], '@commitlint/config-conventional');
  compare(angularCorpus, ['--config', angularConfig], '@commitlint/config-angular');
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log(
  `Differential compatibility: ${conventionalCorpus.length + angularCorpus.length} cases passed.`
);

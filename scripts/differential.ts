import { spawnSync } from 'child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';

const native = resolve(__dirname, '..', 'zig-out', 'bin', 'quick-commitlint');
const commitlint = resolve(__dirname, '..', 'node_modules', '@commitlint', 'cli', 'cli.js');

const conventionalCorpus = [
  ['feat: add parser', true],
  ['fix(core): handle empty input', true],
  ['docs: update readme', true],
  ['chore: publish package', true],
  ['feat!: change public API', true],
  ['wat: unknown type', false],
  ['FEAT: uppercase type', false],
  ['fix:', false],
  ['fix: Add capitalized subject', false],
  ['fix: finish with a period.', false],
  ['feat: add parser\nbody without blank', true]
] as const;

const angularCorpus = [
  ['feat: add parser', true],
  ['fix(core): handle empty input', true],
  ['chore: publish package', false],
  ['feat!: change public API', false],
  ['fix(Core): handle empty input', false],
  ['fix: Add capitalized subject', false]
] as const;

const temp = mkdtempSync(join(tmpdir(), 'quick-commitlint-differential-'));
const angularConfig = join(temp, 'angular.json');
writeFileSync(angularConfig, '{"preset":"angular"}\n');

function compare(
  corpus: ReadonlyArray<readonly [string, boolean]>,
  nativeArgs: string[],
  preset: string
): void {
  for (const [message, expected] of corpus) {
    const nativeResult = spawnSync(native, nativeArgs, { input: message, encoding: 'utf8' });
    const nodeResult = spawnSync(process.execPath, [commitlint, '--extends', preset], {
      input: message,
      encoding: 'utf8',
      cwd: resolve(__dirname, '..')
    });
    const nativePass = nativeResult.status === 0;
    const nodePass = nodeResult.status === 0;
    if (nativePass !== expected || nodePass !== expected || nativePass !== nodePass) {
      throw new Error(
        `Differential mismatch for ${JSON.stringify(message)} using ${preset}: ` +
          `quick-commitlint=${nativeResult.status}, commitlint=${nodeResult.status}, expected=${expected}`
      );
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

import { spawnSync } from 'child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';

const native = resolve(__dirname, '..', 'zig-out', 'bin', 'quick-commitlint');
const expectedVersion = JSON.parse(readFileSync(resolve(__dirname, '..', 'package.json'), 'utf8')).version;
const temp = mkdtempSync(join(tmpdir(), 'quick-commitlint-integration-'));

function run(args: string[], input?: string | Buffer, cwd = temp) {
  return spawnSync(native, args, { input, cwd, encoding: input instanceof Buffer ? undefined : 'utf8' });
}

function expectStatus(actual: number | null, expected: number, context: string): void {
  if (actual !== expected) throw new Error(`${context}: expected status ${expected}, received ${actual}`);
}

function expectTimedSummary(output: string, context: string): void {
  if (!/\d+\.\d{2} ms/.test(output)) throw new Error(`${context}: missing two-decimal timing.`);
}

try {
  const valid = run([], 'feat: add parser');
  expectStatus(valid.status, 0, 'valid stdin');
  if (valid.stdout !== '') throw new Error('Lint results must be written to stderr.');
  const validOutput = String(valid.stderr);
  if (!validOutput.includes('\x1b[32m✔\x1b[0m')) throw new Error('Valid summary is not green.');
  if (!validOutput.includes('0 errors') || !validOutput.includes('0 warnings')) {
    throw new Error('Valid summary has incorrect counts.');
  }
  expectTimedSummary(validOutput, 'valid summary');

  const invalid = run([], 'wat: some message');
  expectStatus(invalid.status, 1, 'invalid stdin');
  if (invalid.stdout !== '') throw new Error('Lint results must be written to stderr.');
  const invalidOutput = String(invalid.stderr);
  if (!invalidOutput.includes('\x1b[31m✖\x1b[0m')) throw new Error('Error symbol is not red.');
  if (!invalidOutput.includes('\x1b[36m[type-enum]\x1b[0m')) throw new Error('Rule identifier is not cyan.');
  if (!invalidOutput.includes('1 error') || invalidOutput.includes('1 errors')) {
    throw new Error('Error summary has incorrect singularization.');
  }
  expectTimedSummary(invalidOutput, 'error summary');

  const warning = run([], 'feat: add parser\nbody without blank');
  expectStatus(warning.status, 0, 'warning-only stdin');
  if (warning.stdout !== '') throw new Error('Lint results must be written to stderr.');
  const warningOutput = String(warning.stderr);
  if (!warningOutput.includes('\x1b[33m⚠\x1b[0m')) throw new Error('Warning symbol is not yellow.');
  if (!warningOutput.includes('\x1b[36m[body-leading-blank]\x1b[0m')) {
    throw new Error('Warning rule identifier is not cyan.');
  }
  if (!warningOutput.includes('1 warning') || warningOutput.includes('1 warnings')) {
    throw new Error('Warning summary has incorrect singularization.');
  }
  expectTimedSummary(warningOutput, 'warning summary');

  const messagePath = join(temp, 'COMMIT_EDITMSG');
  writeFileSync(messagePath, 'fix(core): handle CRLF\r\n\r\nbody\r\n');
  expectStatus(run([messagePath]).status, 0, 'message file with CRLF');

  const parent = join(temp, 'repository');
  const child = join(parent, 'packages', 'app');
  mkdirSync(child, { recursive: true });
  writeFileSync(join(parent, '.quick-commitlint.json'), '{"preset":"angular"}\n');
  expectStatus(run([], 'chore: publish', child).status, 1, 'discovered Angular config');

  const explicit = join(temp, 'conventional.json');
  writeFileSync(explicit, '{"preset":"conventional"}\n');
  expectStatus(run(['--config', explicit], 'chore: publish', child).status, 0, 'explicit config precedence');

  const malformed = join(temp, 'malformed.json');
  writeFileSync(malformed, '{"unknown":true}\n');
  expectStatus(run(['--config', malformed], 'feat: parser').status, 2, 'unknown config key');

  expectStatus(run([], Buffer.from([0x66, 0x65, 0x61, 0x74, 0x3a, 0x20, 0xff])).status, 2, 'invalid UTF-8');
  const unknown = run(['--unknown']);
  expectStatus(unknown.status, 2, 'unknown CLI option');
  if (!String(unknown.stderr).includes('\x1b[31merror\x1b[0m')) throw new Error('CLI error is not red.');

  const oversized = join(temp, 'oversized-message');
  writeFileSync(oversized, Buffer.alloc(1024 * 1024 + 1, 0x61));
  expectStatus(run([oversized]).status, 2, 'message size limit');

  const oversizedConfig = join(temp, 'oversized-config.json');
  writeFileSync(oversizedConfig, Buffer.alloc(256 * 1024 + 1, 0x20));
  expectStatus(run(['--config', oversizedConfig], 'feat: parser').status, 2, 'config size limit');

  const version = run(['--version']);
  expectStatus(version.status, 0, 'version');
  if (String(version.stdout).trim() !== `quick-commitlint ${expectedVersion}`) {
    throw new Error('Incorrect version output.');
  }

  const help = run(['--help']);
  expectStatus(help.status, 0, 'help');
  if (!String(help.stdout).includes('\x1b[96mQuick Commitlint\x1b[0m')) throw new Error('Help title is not cyan.');
  if (!String(help.stdout).includes('\x1b[33mUsage:\x1b[0m')) throw new Error('Help section is not yellow.');
  if (!String(help.stdout).includes('\x1b[32m-c, --config <path>\x1b[0m')) throw new Error('Help option is not green.');
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('CLI integration: all cases passed.');

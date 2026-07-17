import { spawnSync } from 'child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';

const native = resolve(__dirname, '..', 'zig-out', 'bin', 'quick-commitlint');
const temp = mkdtempSync(join(tmpdir(), 'quick-commitlint-integration-'));

function run(args: string[], input?: string | Buffer, cwd = temp) {
  return spawnSync(native, args, { input, cwd, encoding: input instanceof Buffer ? undefined : 'utf8' });
}

function expectStatus(actual: number | null, expected: number, context: string): void {
  if (actual !== expected) throw new Error(`${context}: expected status ${expected}, received ${actual}`);
}

try {
  const valid = run([], 'feat: add parser');
  expectStatus(valid.status, 0, 'valid stdin');
  if (valid.stdout !== '' || valid.stderr !== '') throw new Error('Successful lint must be silent.');

  const invalid = run([], 'wat: Add parser.');
  expectStatus(invalid.status, 1, 'invalid stdin');
  if (!String(invalid.stderr).includes('error[type-enum]')) throw new Error('Missing type-enum diagnostic.');
  if (!String(invalid.stderr).includes('\x1b[31merror[type-enum]\x1b[0m')) {
    throw new Error('Error diagnostic is not red.');
  }

  const warning = run([], 'feat: add parser\nbody without blank');
  expectStatus(warning.status, 0, 'warning-only stdin');
  if (!String(warning.stderr).includes('warning[body-leading-blank]')) throw new Error('Missing warning.');
  if (!String(warning.stderr).includes('\x1b[33mwarning[body-leading-blank]\x1b[0m')) {
    throw new Error('Warning diagnostic is not yellow.');
  }

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
  if (String(version.stdout).trim() !== 'quick-commitlint 0.0.1') throw new Error('Incorrect version output.');

  const help = run(['--help']);
  expectStatus(help.status, 0, 'help');
  if (!String(help.stdout).includes('\x1b[96mQuick Commitlint\x1b[0m')) throw new Error('Help title is not cyan.');
  if (!String(help.stdout).includes('\x1b[33mUsage:\x1b[0m')) throw new Error('Help section is not yellow.');
  if (!String(help.stdout).includes('\x1b[32m-c, --config <path>\x1b[0m')) throw new Error('Help option is not green.');
} finally {
  rmSync(temp, { recursive: true, force: true });
}

console.log('CLI integration: all cases passed.');

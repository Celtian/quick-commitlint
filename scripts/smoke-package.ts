import { spawnSync } from 'child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';

import { platforms } from './platforms';

const projectRoot = resolve(__dirname, '..');
const distDir = join(projectRoot, 'dist', 'quick-commitlint');
const projectManifest = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(distDir, 'package.json'), 'utf8'));
const expectedVersion = projectManifest.version;

if (manifest.version !== expectedVersion) {
  throw new Error(`Packaged version ${manifest.version} does not match ${expectedVersion}.`);
}
if (manifest.bin?.['quick-commitlint'] !== 'bin/quick-commitlint.js') {
  throw new Error('Packaged bin does not point to the portable launcher.');
}
if ('os' in manifest || 'cpu' in manifest) {
  throw new Error('The cross-platform package must not restrict npm installation by OS or CPU.');
}
if (manifest.dependencies && Object.keys(manifest.dependencies).length !== 0) {
  throw new Error('The published package has runtime package dependencies.');
}
if (manifest.engines?.node !== projectManifest.engines.node || 'npm' in manifest.engines) {
  throw new Error('The published package must declare only the supported Node.js runtime.');
}

const dryRun = JSON.parse(runNpm(['pack', '--dry-run', '--json'], distDir).stdout);
const files = dryRun[0].files.map((file: { path: string }) => file.path).sort();
const required = ['LICENSE', 'README.md', 'bin/quick-commitlint.js', 'package.json'];
for (const platform of platforms) {
  required.push(`bin/native/${platform.id}/${platform.binary}`);
}
for (const file of required) {
  if (!files.includes(file)) throw new Error(`Package is missing ${file}.`);
}

const packed = JSON.parse(runNpm(['pack', '--json'], distDir).stdout);
const tarball = join(distDir, packed[0].filename);
const installDir = mkdtempSync(join(tmpdir(), 'quick-commitlint-package-'));

try {
  writeFileSync(join(installDir, 'package.json'), '{"private":true}\n');
  mkdirSync(join(installDir, 'node_modules'), { recursive: true });
  runNpm(['install', '--ignore-scripts', '--no-package-lock', tarball], installDir);

  const executable = join(
    installDir,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'quick-commitlint.cmd' : 'quick-commitlint',
  );
  const version = runCli(executable, ['--version']).stdout.trim();
  if (version !== `quick-commitlint ${expectedVersion}`) {
    throw new Error(`Unexpected version: ${version}`);
  }

  const valid = runCli(executable, [], 'feat: verify packaged command');
  if (valid.status !== 0) throw new Error(`Valid message exited with ${valid.status}.`);

  const invalid = runCli(executable, [], 'invalid: verify packaged command');
  if (invalid.status !== 1 || !invalid.stderr.includes('[type-enum]')) {
    throw new Error(`Invalid message produced an unexpected result:\n${invalid.stderr}`);
  }
} finally {
  rmSync(tarball, { force: true });
  rmSync(installDir, { recursive: true, force: true });
}

console.log('Cross-platform npm package smoke test passed.');

function runNpm(args: string[], cwd: string): { stdout: string; stderr: string; status: number } {
  const result = spawnSync('npm', args, { cwd, encoding: 'utf8' });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`npm ${args.join(' ')} failed:\n${result.stdout}${result.stderr}`);
  }
  return { stdout: result.stdout, stderr: result.stderr, status: result.status };
}

function runCli(
  executable: string,
  args: string[],
  input?: string,
): { stdout: string; stderr: string; status: number | null } {
  const result = spawnSync(executable, args, {
    encoding: 'utf8',
    input,
    shell: process.platform === 'win32',
  });
  if (result.error) throw result.error;
  return { stdout: result.stdout, stderr: result.stderr, status: result.status };
}

import { execFileSync } from 'child_process';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';

const projectRoot = resolve(__dirname, '..');
const distDir = join(projectRoot, 'dist', 'quick-commitlint');
const projectManifest = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(join(distDir, 'package.json'), 'utf8'));
const expectedVersion = projectManifest.version;

if (manifest.version !== expectedVersion) {
  throw new Error(`Packaged version ${manifest.version} does not match ${expectedVersion}.`);
}
if (manifest.bin?.['quick-commitlint'] !== 'bin/quick-commitlint') {
  throw new Error('Packaged bin does not point directly to the native executable.');
}
if (manifest.dependencies && Object.keys(manifest.dependencies).length !== 0) {
  throw new Error('The published package has runtime dependencies.');
}

const dryRun = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--json'], { cwd: distDir, encoding: 'utf8' }),
);
const files = dryRun[0].files.map((file: { path: string }) => file.path).sort();
for (const required of ['LICENSE', 'README.md', 'bin/quick-commitlint', 'package.json']) {
  if (!files.includes(required)) throw new Error(`Package is missing ${required}.`);
}

const packed = JSON.parse(
  execFileSync('npm', ['pack', '--json'], { cwd: distDir, encoding: 'utf8' }),
);
const tarball = join(distDir, packed[0].filename);
const installDir = mkdtempSync(join(tmpdir(), 'quick-commitlint-package-'));

try {
  writeFileSync(join(installDir, 'package.json'), '{"private":true}\n');
  mkdirSync(join(installDir, 'node_modules'), { recursive: true });
  execFileSync('npm', ['install', '--ignore-scripts', '--no-package-lock', tarball], {
    cwd: installDir,
    stdio: 'pipe',
  });
  const executable = join(installDir, 'node_modules', '.bin', 'quick-commitlint');
  const version = execFileSync(executable, ['--version'], { encoding: 'utf8' }).trim();
  if (version !== `quick-commitlint ${expectedVersion}`)
    throw new Error(`Unexpected version: ${version}`);
} finally {
  rmSync(tarball, { force: true });
  rmSync(installDir, { recursive: true, force: true });
}

console.log('npm package smoke test passed.');

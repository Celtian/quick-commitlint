import {
  chmodSync,
  copyFileSync,
  emptyDirSync,
  ensureDirSync,
  pathExistsSync,
  writeFileSync,
} from 'fs-extra';
import { join, resolve } from 'path';

import { platforms } from './platforms';

const rootDir = resolve(__dirname, '..');
const pkg = require(join(rootDir, 'package.json'));

pkg.scripts = undefined;
pkg.devDependencies = undefined;
pkg.packageManager = undefined;
pkg.engines = { node: pkg.engines.node };
pkg.files = undefined;
pkg.bin = {
  'quick-commitlint': 'bin/quick-commitlint.js',
};

const distDir = join(rootDir, 'dist', 'quick-commitlint');
emptyDirSync(distDir);
writeFileSync(join(distDir, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');

for (const file of ['README.md', 'LICENSE']) {
  copyFileSync(join(rootDir, file), join(distDir, file));
}

const binDir = join(distDir, 'bin');
ensureDirSync(binDir);
const launcherPath = join(binDir, 'quick-commitlint.js');
copyFileSync(join(rootDir, 'npm', 'quick-commitlint.js'), launcherPath);
chmodSync(launcherPath, 0o755);

for (const platform of platforms) {
  const source = join(rootDir, 'zig-out', 'platforms', platform.id, 'bin', platform.binary);
  if (!pathExistsSync(source)) {
    throw new Error(`Missing ${platform.id} binary. Run "yarn build:release" first.`);
  }

  const nativeDir = join(binDir, 'native', platform.id);
  ensureDirSync(nativeDir);
  const destination = join(nativeDir, platform.binary);
  copyFileSync(source, destination);
  if (platform.os !== 'win32') chmodSync(destination, 0o755);
}

console.log('Created the cross-platform npm package in dist/quick-commitlint/.');

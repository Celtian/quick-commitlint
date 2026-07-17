import { ensureDirSync, writeFileSync } from 'fs-extra';
import { join, resolve } from 'path';

const pkg = require(resolve(__dirname, '..', 'package.json'));

pkg.scripts = undefined;
pkg.devDependencies = undefined;
pkg.packageManager = undefined;
pkg.engines = undefined;
pkg.files = undefined;
pkg.bin = {
  'quick-commitlint': 'bin/quick-commitlint'
};
pkg.os = ['linux'];
pkg.cpu = ['x64'];

const distDir = join(__dirname, '..', 'dist');
ensureDirSync(distDir);
writeFileSync(join(distDir, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');

console.log('Generated the npm package manifest in dist/.');

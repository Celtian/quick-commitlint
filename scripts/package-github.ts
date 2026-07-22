import { readJsonSync, writeFileSync } from 'fs-extra';
import { join, resolve } from 'path';

const distDir = resolve(__dirname, '..', 'dist', 'quick-commitlint');
const pkg = readJsonSync(join(distDir, 'package.json'));

pkg.name = '@celtian/quick-commitlint';
pkg.publishConfig = {
  registry: 'https://npm.pkg.github.com',
};

writeFileSync(join(distDir, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');

console.log('Prepared dist/quick-commitlint/package.json for GitHub Packages.');

import { spawnSync } from 'child_process';
import { emptyDirSync, ensureDirSync } from 'fs-extra';
import { resolve } from 'path';

import { platforms } from './platforms';

const rootDir = resolve(__dirname, '..');
const outputDir = resolve(rootDir, 'zig-out', 'platforms');
emptyDirSync(outputDir);

for (const platform of platforms) {
  const prefix = resolve(outputDir, platform.id);
  ensureDirSync(prefix);
  console.log(`Building ${platform.id} (${platform.target})...`);

  const result = spawnSync(
    'zig',
    [
      'build',
      `-Dtarget=${platform.target}`,
      '-Dcpu=baseline',
      '-Doptimize=ReleaseFast',
      '--prefix',
      prefix,
    ],
    { cwd: rootDir, stdio: 'inherit' },
  );

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

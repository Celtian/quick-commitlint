import { spawnSync } from 'child_process';
import { writeFileSync, mkdtempSync, rmSync } from 'fs';
import { arch, cpus, platform, tmpdir } from 'os';
import { join, resolve } from 'path';

const root = resolve(__dirname, '..');
const packaged = resolve(root, 'dist', 'quick-commitlint', 'bin', 'quick-commitlint.js');
const commitlint = resolve(root, 'node_modules', '@commitlint', 'cli', 'cli.js');
const iterations = Number(process.env.BENCHMARK_ITERATIONS ?? 40);
const temp = mkdtempSync(join(tmpdir(), 'quick-commitlint-benchmark-'));
const messagePath = join(temp, 'COMMIT_EDITMSG');
const conventionalConfigPath = join(temp, 'quick-commitlint-conventional.json');
const angularConfigPath = join(temp, 'quick-commitlint-angular.json');
const message = 'feat(benchmark): measure native startup';
writeFileSync(messagePath, `${message}\n`);
writeFileSync(
  conventionalConfigPath,
  '{"preset":"conventional","rules":{"header-max-length":[2,"always",100]}}\n',
);
writeFileSync(angularConfigPath, '{"preset":"angular"}\n');

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
}

function measure(command: string, args: string[], input?: string): number {
  const samples: number[] = [];
  for (let index = 0; index < iterations + 3; index += 1) {
    const start = process.hrtime.bigint();
    const result = spawnSync(command, args, {
      cwd: root,
      input,
      stdio: ['pipe', 'ignore', 'ignore'],
    });
    const elapsed = Number(process.hrtime.bigint() - start) / 1_000_000;
    if (result.status !== 0) throw new Error(`${command} exited with ${result.status}`);
    if (index >= 3) samples.push(elapsed);
  }
  return median(samples);
}

try {
  const nodeVersionResult = spawnSync('node', ['--version'], { encoding: 'utf8' });
  if (nodeVersionResult.status !== 0) throw new Error('Could not determine the Node.js version.');
  const cpu = cpus()[0]?.model ?? 'unknown CPU';
  const packagedFile = measure('node', [packaged, messagePath]);
  const quickConventional = measure('node', [packaged], message);
  const quickConventionalConfig = measure(
    'node',
    [packaged, '--config', conventionalConfigPath],
    message,
  );
  const commitlintConventional = measure(
    'node',
    [commitlint, '--extends', '@commitlint/config-conventional'],
    message,
  );
  const quickAngular = measure('node', [packaged, '--config', angularConfigPath], message);
  const commitlintAngular = measure(
    'node',
    [commitlint, '--extends', '@commitlint/config-angular'],
    message,
  );
  const conventionalRatio = commitlintConventional / quickConventional;
  const angularRatio = commitlintAngular / quickAngular;

  console.log(
    `environment: ${platform()} ${arch()}, ${cpu}, Node ${nodeVersionResult.stdout.trim()}`,
  );
  console.log(`measured iterations per command: ${iterations} after 3 warmups`);
  console.log(`quick-commitlint file median: ${packagedFile.toFixed(3)} ms`);
  console.log(`quick-commitlint conventional median: ${quickConventional.toFixed(3)} ms`);
  console.log(
    `quick-commitlint conventional JSON config median: ${quickConventionalConfig.toFixed(3)} ms`,
  );
  console.log(`commitlint conventional median: ${commitlintConventional.toFixed(3)} ms`);
  console.log(`conventional cold-process improvement: ${conventionalRatio.toFixed(1)}x`);
  console.log(`quick-commitlint angular median: ${quickAngular.toFixed(3)} ms`);
  console.log(`commitlint angular median: ${commitlintAngular.toFixed(3)} ms`);
  console.log(`angular cold-process improvement: ${angularRatio.toFixed(1)}x`);

  for (const [preset, ratio] of [
    ['conventional', conventionalRatio],
    ['angular', angularRatio],
  ] as const) {
    if (ratio < 10) {
      throw new Error(`Performance gate failed for ${preset}: ${ratio.toFixed(1)}x is below 10x.`);
    }
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}

import { spawnSync } from 'child_process';
import { writeFileSync, mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';

const root = resolve(__dirname, '..');
const native = resolve(root, 'dist', 'quick-commitlint', 'bin', 'quick-commitlint');
const commitlint = resolve(root, 'node_modules', '@commitlint', 'cli', 'cli.js');
const iterations = Number(process.env.BENCHMARK_ITERATIONS ?? 40);
const temp = mkdtempSync(join(tmpdir(), 'quick-commitlint-benchmark-'));
const messagePath = join(temp, 'COMMIT_EDITMSG');
const configPath = join(temp, 'quick-commitlint.json');
writeFileSync(messagePath, 'feat(benchmark): measure native startup\n');
writeFileSync(
  configPath,
  '{"preset":"conventional","rules":{"header-max-length":[2,"always",100]}}\n',
);

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
  const nativeFile = measure(native, [messagePath]);
  const nativeStdin = measure(native, [], 'feat(benchmark): measure native startup');
  const nativeConfig = measure(
    native,
    ['--config', configPath],
    'feat(benchmark): measure native startup',
  );
  const nodeStdin = measure(
    process.execPath,
    [commitlint, '--extends', '@commitlint/config-conventional'],
    'feat(benchmark): measure native startup',
  );
  const ratio = nodeStdin / nativeStdin;
  console.log(`quick-commitlint file median: ${nativeFile.toFixed(3)} ms`);
  console.log(`quick-commitlint stdin median: ${nativeStdin.toFixed(3)} ms`);
  console.log(`quick-commitlint JSON config median: ${nativeConfig.toFixed(3)} ms`);
  console.log(`commitlint stdin median: ${nodeStdin.toFixed(3)} ms`);
  console.log(`cold-process improvement: ${ratio.toFixed(1)}x`);
  if (ratio < 10) throw new Error(`Performance gate failed: ${ratio.toFixed(1)}x is below 10x.`);
} finally {
  rmSync(temp, { recursive: true, force: true });
}

# Performance

Quick Commitlint runs message parsing, JSON configuration, and lint rules in a bundled native Zig executable. The npm command uses a small Node.js launcher to select that executable. Commitlint loads its Node.js configuration and linting stack in the CLI process.

## Reference cold-process benchmark

| Preset       | Quick Commitlint median | Commitlint median | Improvement |
| ------------ | ----------------------: | ----------------: | ----------: |
| Conventional |               20.686 ms |        250.597 ms |       12.1× |
| Angular      |               20.535 ms |        250.228 ms |       12.2× |

## Method

The table contains median wall-clock results from 40 measured launches after 3 warmups on:

- Linux x64 under WSL2
- 13th Gen Intel Core i9-13900H
- Node.js 24.18.0
- `@commitlint/cli` 21.2.1
- `@commitlint/config-conventional` and `@commitlint/config-angular` 21.2.0

Each command received the same valid message through standard input. Quick Commitlint used its built-in default for Conventional and a strict JSON file for Angular. Commitlint extended the corresponding configuration package.

This benchmark measures complete cold-process startup and one lint operation. It does not measure long-running API throughput. Results vary with the machine, operating system, filesystem, and process state, so treat the numbers as a reference run rather than a performance guarantee.

## Reproduce the benchmark

Build the release package, then run the benchmark:

```bash
bun run package
bun run benchmark
```

The command reports the environment, median time for each tool, and the relative improvement for both presets. Set `BENCHMARK_ITERATIONS` to change the measured sample count:

```bash
BENCHMARK_ITERATIONS=100 bun run benchmark
```

See [Commitlint compatibility](docs/compatibility/) for differences in configuration, extensibility, parsing, ignores, and input modes.

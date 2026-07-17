# Development

Quick Commitlint uses Zig for the published binary and Node.js tooling for development and packaging.

## Requirements

- Zig 0.16.0
- Node.js 24
- Yarn 1.22.22

## Validate a change

```bash
yarn install
yarn validate
```

## Build and test the package

```bash
yarn clean
yarn validate
yarn build:release
yarn script:package-npm
yarn copy-files
yarn package:smoke
```

## Benchmark

Run the cold-process benchmark against `@commitlint/cli`:

```bash
yarn benchmark
```

The documentation portal is an Angular 22 static site. Run it locally with `yarn portal:start` and validate it with `yarn portal:validate`.

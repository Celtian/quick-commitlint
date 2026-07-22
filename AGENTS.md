# Repository Guidance

## Toolchain

- Use Zig 0.16.0, Node.js 24, and Yarn 1.22.22.
- Node is used for development, publishing, and the small platform launcher; all linting executes in the bundled Zig binary.
- Treat `package.json` as the sole source of truth for the release version. Keep `build.zig.zon` at the neutral `0.0.0` placeholder and derive build/test/package expectations from `package.json`.
- Never change the `build.zig.zon` fingerprint.

## Required validation

Run `yarn validate` after source, build, test, packaging, or workflow changes. For packaging changes, also run the release build, package scripts, and `yarn package:smoke`. Run `git diff --check` before handoff. Do not weaken tests to make validation pass.

If the global Zig cache is not writable, set `ZIG_GLOBAL_CACHE_DIR` to a directory under `/tmp`.

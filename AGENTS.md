# Repository Guidance

## Toolchain

- Use Zig 0.16.0, Node.js 24, and Yarn 1.22.22.
- Node is used for development and publishing only; the published command must execute the Zig binary directly.
- Keep version `0.0.1` synchronized in `package.json`, `build.zig.zon`, `src/version.zig`, tests, and documentation until a release change is explicitly requested.
- Never change the `build.zig.zon` fingerprint.

## Required validation

Run `yarn validate` after source, build, test, packaging, or workflow changes. For packaging changes, also run the release build, package scripts, and `yarn package:smoke`. Run `git diff --check` before handoff. Do not weaken tests to make validation pass.

If the global Zig cache is not writable, set `ZIG_GLOBAL_CACHE_DIR` to a directory under `/tmp`.

<div align="center">

# Quick Commitlint

**A very fast, dependency-free commit message linter built with Zig.**

[![npm version](https://badge.fury.io/js/quick-commitlint.svg)](https://www.npmjs.com/package/quick-commitlint)
[![Zig 0.16.0](https://img.shields.io/badge/Zig-0.16.0-F7A41D?logo=zig&logoColor=white)](https://ziglang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

`quick-commitlint` checks Conventional Commit messages with a native Linux x86-64 executable. Node and Yarn are used to distribute the package, but the installed command starts the Zig binary directly and has no runtime dependencies.

## Install

```bash
npm install quick-commitlint --save-dev
```

```bash
yarn add quick-commitlint --dev
```

The initial release supports Linux x86-64 only.

## Use in a commit hook

Pass the commit-message file as the only positional argument:

```bash
quick-commitlint "$1"
```

Or lint a message from standard input:

```bash
echo "feat(parser): add fast validation" | quick-commitlint
```

Valid messages produce no output and exit with status `0`. Rule errors exit with status `1`; command, file, UTF-8, and configuration errors exit with status `2`. Warnings are printed but do not fail the hook.

## Configuration

Without configuration, the built-in `conventional` preset is used. Quick Commitlint searches for the nearest `.quick-commitlint.json` from the current directory upward. Use `--config` to select a file explicitly.

```json
{
  "preset": "angular",
  "rules": {
    "header-max-length": [2, "always", 80],
    "subject-full-stop": [0]
  }
}
```

Configuration is strict JSON. Unknown keys, duplicate keys, unsupported rules, and invalid values are errors. Supported severities are `0` (disabled), `1` (warning), and `2` (error); conditions are `always` and `never`.

### Presets and rules

The `conventional` and `angular` presets model the corresponding commitlint 21.2 presets. The supported rule union is:

- `body-leading-blank`, `body-max-line-length`
- `footer-leading-blank`, `footer-max-line-length`
- `header-max-length`, `header-trim`
- `scope-case`
- `subject-case`, `subject-empty`, `subject-exclamation-mark`, `subject-full-stop`
- `type-case`, `type-empty`, `type-enum`

Unlike commitlint, generated messages such as merges, reverts, fixups, tags, and initial commits are not ignored.

## CLI

```text
quick-commitlint [options] [commit-message-file]

-c, --config <path>  Use an explicit JSON configuration file.
-h, --help           Display usage information.
-V, --version        Display the installed version.
```

Input must be UTF-8 and may use LF or CRLF line endings. Length rules count Unicode code points. Case rules use ASCII semantics so international subjects remain valid.

## Development

Requirements:

- Zig 0.16.0
- Node.js 24
- Yarn 1.22.22

```bash
yarn install
yarn validate
```

Build the publishable Linux x86-64 package and test its tarball:

```bash
yarn clean
yarn validate
yarn build:release
yarn script:package-npm
yarn copy-files
yarn package:smoke
```

Run the cold-process benchmark against `@commitlint/cli`:

```bash
yarn benchmark
```

## License

Copyright &copy; 2026 [Dominik Hladík](https://github.com/Celtian).

Licensed under the [MIT License](LICENSE).

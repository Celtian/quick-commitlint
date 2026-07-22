<div align="center">

# ⚡ Quick Commitlint

**A very fast, dependency-free commit message linter built with Zig.**

[![npm version](https://badge.fury.io/js/quick-commitlint.svg)](https://www.npmjs.com/package/quick-commitlint)
[![Zig 0.16.0](https://img.shields.io/badge/Zig-0.16.0-F7A41D?logo=zig&logoColor=white)](https://ziglang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Documentation](https://celtian.github.io/quick-commitlint/) · [Source](https://github.com/Celtian/quick-commitlint)

<img
  src="https://raw.githubusercontent.com/Celtian/quick-commitlint/master/docs/assets/terminal-demo.gif"
  alt="Quick Commitlint terminal demo"
  width="900"
/>

</div>

`quick-commitlint` checks Conventional Commit messages with native Zig executables for macOS, Linux, and Windows. A small Node.js launcher selects the executable bundled for the current platform; the package has no runtime npm dependencies.

## ✨ Why use it?

| Feature                          | Details                                                                           |
| -------------------------------- | --------------------------------------------------------------------------------- |
| ⚡ **Fast native linting**       | A thin launcher hands all linting work to the bundled Zig executable.             |
| 📦 **Zero package dependencies** | All supported native executables ship in the npm package.                         |
| 🧩 **Familiar configuration**    | Uses commitlint-style rule tuples with built-in conventional and Angular presets. |
| 🔒 **Strict and predictable**    | Rejects malformed JSON, unknown options, duplicate keys, and invalid UTF-8.       |
| 🌍 **International subjects**    | Counts Unicode code points while keeping syntax checks fast and ASCII-based.      |

## 🚀 Install

```bash
npm install quick-commitlint --save-dev
```

```bash
yarn add quick-commitlint --dev
```

The package includes native executables for macOS arm64/x64, Linux arm64/x64, and Windows x64. The launcher requires Node.js 24 or 25.

## 🪝 Use in a commit hook

Pass the commit-message file as the only positional argument:

```bash
quick-commitlint "$1"
```

Or lint a message from standard input:

```bash
echo "feat(parser): add fast validation" | quick-commitlint
```

Every lint result includes the elapsed lint time in milliseconds. Valid messages and warning-only results exit with status `0`; rule errors exit with status `1`; command, file, UTF-8, and configuration errors exit with status `2`.

## ⚙️ Configuration

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

### 🧰 Presets and rules

The `conventional` and `angular` presets model the corresponding commitlint 21.2 presets. The supported rule union is:

- `body-leading-blank`, `body-max-line-length`
- `footer-leading-blank`, `footer-max-line-length`
- `header-max-length`, `header-trim`
- `scope-case`
- `subject-case`, `subject-empty`, `subject-exclamation-mark`, `subject-full-stop`
- `type-case`, `type-empty`, `type-enum`

Unlike commitlint, generated messages such as merges, reverts, fixups, tags, and initial commits are not ignored.

## 🧭 CLI

```text
quick-commitlint [options] [commit-message-file]

-c, --config <path>  Use an explicit JSON configuration file.
-h, --help           Display usage information.
-V, --version        Display the installed version.
```

Input must be UTF-8 and may use LF or CRLF line endings. Length rules count Unicode code points. Case rules use ASCII semantics so international subjects remain valid.

## 📚 Documentation portal

The documentation site is an English-only Angular 22 static application in `projects/portal`. It uses Angular Material/CDK, plain CSS with Material 3 system tokens, Tailwind CSS v4 helpers, and build-time Markdown rendering.

Run it locally:

```bash
yarn portal:start
```

Validate or build the prerendered site:

```bash
yarn portal:validate
yarn portal:build:pages
```

Every public route is prerendered for SEO. Pushing a `v*` tag that points at the current `master` commit runs `.github/workflows/main.yml`, publishes the native packages, and then deploys `dist/portal/browser` to the `gh-pages` branch as the workflow's final step. The repository must provide the `ACTIONS_DEPLOY_KEY` secret and configure GitHub Pages to publish from `gh-pages`.

## 🏗️ Development

Requirements:

- Zig 0.16.0
- Node.js 24
- Yarn 1.22.22

```bash
yarn install
yarn validate
```

Build the publishable cross-platform package and test its tarball:

```bash
yarn clean
yarn validate
yarn package
```

Build artifacts are kept as sibling outputs with no overlap between the website and published native package:

```text
dist/
├── portal/
│   └── browser/             # Angular SSG output for GitHub Pages
└── quick-commitlint/
    ├── bin/
    │   ├── quick-commitlint.js # Platform launcher
    │   └── native/            # Five platform-specific Zig executables
    ├── LICENSE
    ├── README.md
    └── package.json         # Publishable npm manifest
```

`yarn clean` removes the complete `dist` tree. Portal builds recreate only `dist/portal`; the release packaging scripts recreate only `dist/quick-commitlint`.

Run the cold-process benchmark against `@commitlint/cli`:

```bash
yarn benchmark
```

<details>
<summary><strong>🎬 Regenerate the terminal demo</strong></summary>

The README animation is defined in `docs/terminal-demo.tape` and rendered with the official VHS Docker image:

```bash
yarn demo:render
```

The render script validates the GIF type and size, then extracts representative frames for visual inspection.

</details>

## 📄 License

Copyright &copy; 2026 [Dominik Hladík](https://github.com/Celtian).

Licensed under the [MIT License](LICENSE).

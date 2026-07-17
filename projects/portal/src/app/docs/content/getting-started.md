# Getting started

Quick Commitlint is a native Linux x86-64 command that checks commit messages against a focused set of commitlint-compatible rules. The installed command starts the Zig binary directly and has no Node.js runtime dependencies.

## Install

With npm:

```bash
npm install quick-commitlint --save-dev
```

With Yarn:

```bash
yarn add quick-commitlint --dev
```

## Lint your first message

Pipe a Conventional Commit message to the command:

```bash
echo "feat(parser): add fast validation" | quick-commitlint
```

A valid message exits with status `0`. Rule errors exit with status `1`; command, file, UTF-8, and configuration errors exit with status `2`.

Quick Commitlint uses the `conventional` preset automatically. Add `.quick-commitlint.json` at the repository root to choose Angular or override individual rules:

```json
{
  "preset": "angular",
  "rules": {
    "header-max-length": [2, "always", 80]
  }
}
```

Continue with [Usage](docs/usage/), review the accepted [commit message format](docs/message-format/), or compare the complete [preset defaults](docs/presets/).

## Platform support

The current package supports Linux x86-64. Node and a package manager are only used to download the package; the command itself is a native executable.

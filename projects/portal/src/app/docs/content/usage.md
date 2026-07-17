# Usage

Quick Commitlint reads exactly one commit message from a file or from standard input, discovers project configuration, evaluates all enabled rules, and prints one report.

## Read a commit message file

Pass the path as the only positional argument:

```bash
quick-commitlint .git/COMMIT_EDITMSG
```

Use `--` when the filename starts with a hyphen:

```bash
quick-commitlint -- -message.txt
```

## Read standard input

Omit the positional argument to read stdin:

```bash
printf '%s\n' 'fix(cli): report invalid input' | quick-commitlint
git show -s --format=%B HEAD | quick-commitlint
```

The entire input is one message; the tool does not split a stream into multiple commits.

## Select configuration

By default, the nearest `.quick-commitlint.json` from the current directory upward is used. Without a file, Quick Commitlint uses `conventional`.

```bash
quick-commitlint --config config/angular.json .git/COMMIT_EDITMSG
```

An explicit path takes precedence over discovered configuration. See [Configuration](docs/configuration/) for discovery and strict JSON rules.

## Use a Git commit hook

Git calls `commit-msg` with the path to the proposed message. A minimal hook is:

```sh
#!/bin/sh
quick-commitlint "$1"
```

With Husky, put the command in `.husky/commit-msg`:

```sh
quick-commitlint "$1"
```

Make sure the hook file is executable when it is managed directly by Git.

## Introduce a rule gradually

Severity `1` reports a warning but exits successfully. Start a new policy as a warning, clean up existing messages or team practices, and then raise it to `2`:

```json
{
  "rules": {
    "scope-case": [1, "always", "lower-case"]
  }
}
```

## Interpret a report

Every lint run writes a colored report to stderr:

```text
  ✖  type is not allowed  [type-enum]

  ✖  1 error · 0 warnings · 0.12 ms
```

- `✖` findings have severity `2` and produce exit status `1`.
- `⚠` findings have severity `1` and keep exit status `0`.
- `✔` means no enabled rule produced a finding.
- The bracketed name identifies the rule to adjust or investigate.

## Input behavior

Messages must be UTF-8 and may use LF or CRLF line endings. Length rules count Unicode code points. Case rules use documented ASCII semantics, allowing international subject text without pretending to provide locale-aware casing.

Message and configuration input are limited to 1 MiB and 256 KiB respectively. See the [CLI reference](docs/cli/) for every option, stream, error category, and exit code.

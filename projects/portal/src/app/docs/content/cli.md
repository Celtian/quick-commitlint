# CLI reference

```text
quick-commitlint [options] [commit-message-file]

-c, --config <path>  Use an explicit JSON configuration file.
-h, --help           Display usage information.
-V, --version        Display the installed version.
```

## Arguments and options

| Input                   | Description                                                        |
| ----------------------- | ------------------------------------------------------------------ |
| `commit-message-file`   | Optional path to exactly one UTF-8 commit-message file             |
| `-c`, `--config <path>` | Use this JSON file instead of discovering `.quick-commitlint.json` |
| `-h`, `--help`          | Print colored help to stdout and exit successfully                 |
| `-V`, `--version`       | Print `quick-commitlint <version>` to stdout and exit successfully |
| `--`                    | End option parsing; later values are positional                    |

Options may appear before or after the message path until `--` is encountered. `--config` may appear only once and requires a separate value; `--config=path` is not supported.

Use `--` for a message filename beginning with a hyphen:

```bash
quick-commitlint -- -commit-message
```

Unknown options, a duplicate config option, a missing config path, and more than one message path are command errors.

## Read standard input

When no message file is supplied, the entire message is read from stdin:

```bash
printf '%s\n' 'fix(cli): preserve exit status' | quick-commitlint
```

This is useful in CI and scripts:

```bash
git log -1 --pretty=%B | quick-commitlint
```

## Read a file

```bash
quick-commitlint .git/COMMIT_EDITMSG
quick-commitlint -c config/commitlint.json .git/COMMIT_EDITMSG
```

Relative paths are resolved against the current working directory. Configuration discovery also starts there, independently of the message file's directory.

## Input limits

| Input          | Maximum size |
| -------------- | ------------ |
| Commit message | 1 MiB        |
| Configuration  | 256 KiB      |

Inputs must be valid UTF-8. LF and CRLF line endings are accepted.

## Output streams

Lint reports are always written to stderr, including a valid zero-finding result. Each report contains:

- a colored `✖`, `⚠`, or `✔` status;
- one line per finding with its message and `[rule-name]`;
- error and warning totals;
- elapsed lint time in milliseconds with two decimal places.

ANSI colors are currently emitted unconditionally; there is no color or formatter option. Help and version output use stdout. Argument, file, UTF-8, configuration, and runtime errors use stderr.

## Exit codes

| Code | Meaning                                                                      |
| ---- | ---------------------------------------------------------------------------- |
| `0`  | Valid message, no findings, or warnings only                                 |
| `1`  | One or more severity-`2` rule errors                                         |
| `2`  | Invalid arguments, I/O failure, invalid UTF-8, invalid config, or size limit |

Severity-`1` warnings intentionally keep status `0`, which allows a rule to be introduced gradually.

## Git commit hook

Git passes the commit-message filename as the first argument to a `commit-msg` hook:

```sh
#!/bin/sh
quick-commitlint "$1"
```

With Husky, put the command in `.husky/commit-msg`. The hook blocks the commit only for status `1` or `2`.

## CI examples

Lint the current commit:

```bash
git show -s --format=%B HEAD | quick-commitlint
```

Lint a message stored by the CI provider:

```bash
printf '%s' "$COMMIT_MESSAGE" | quick-commitlint --config .quick-commitlint.json
```

## Help and version

```bash
quick-commitlint --help
quick-commitlint --version
```

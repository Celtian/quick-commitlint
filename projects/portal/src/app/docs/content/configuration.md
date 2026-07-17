# Configuration

Without configuration, Quick Commitlint uses the built-in `conventional` preset. It searches for the nearest `.quick-commitlint.json` from the current directory upward.

## Example

```json
{
  "preset": "angular",
  "rules": {
    "header-max-length": [2, "always", 80],
    "subject-full-stop": [0]
  }
}
```

Use `--config` to select a file explicitly:

```bash
quick-commitlint --config config/commitlint.json .git/COMMIT_EDITMSG
```

## Rule tuples

A rule tuple contains a severity, an optional condition, and optional rule-specific data.

| Value | Meaning  |
| ----- | -------- |
| `0`   | Disabled |
| `1`   | Warning  |
| `2`   | Error    |

Conditions are `always` and `never`. Configuration is strict JSON: unknown keys, duplicate keys, unsupported rules, and invalid values are errors.

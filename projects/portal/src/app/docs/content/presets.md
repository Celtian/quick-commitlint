# Presets

Quick Commitlint includes two built-in presets: `conventional` and `angular`. They model the corresponding commitlint 21.2 configurations and can be selected with the top-level `preset` property.

```json
{
  "preset": "angular"
}
```

If `preset` is omitted, `conventional` is used. Project rules are applied after the preset and override only the named defaults.

## Complete preset comparison

`[0]` means disabled, `1` is a warning, and `2` is an error.

| Rule                       | Conventional default                                                                                            | Angular default                                                                                        |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `body-leading-blank`       | `[1, "always"]`                                                                                                 | `[1, "always"]`                                                                                        |
| `body-max-line-length`     | `[2, "always", 100]`                                                                                            | `[0]`                                                                                                  |
| `footer-leading-blank`     | `[1, "always"]`                                                                                                 | `[1, "always"]`                                                                                        |
| `footer-max-line-length`   | `[2, "always", 100]`                                                                                            | `[0]`                                                                                                  |
| `header-max-length`        | `[2, "always", 100]`                                                                                            | `[2, "always", 72]`                                                                                    |
| `header-trim`              | `[2, "always"]`                                                                                                 | `[0]`                                                                                                  |
| `scope-case`               | `[0]`                                                                                                           | `[2, "always", "lower-case"]`                                                                          |
| `subject-case`             | `[2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]]`                                    | `[2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]]`                           |
| `subject-empty`            | `[2, "never"]`                                                                                                  | `[2, "never"]`                                                                                         |
| `subject-exclamation-mark` | `[0]`                                                                                                           | `[2, "never"]`                                                                                         |
| `subject-full-stop`        | `[2, "never", "."]`                                                                                             | `[2, "never", "."]`                                                                                    |
| `type-case`                | `[2, "always", "lower-case"]`                                                                                   | `[2, "always", "lower-case"]`                                                                          |
| `type-empty`               | `[2, "never"]`                                                                                                  | `[2, "never"]`                                                                                         |
| `type-enum`                | `[2, "always", ["build", "chore", "ci", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test"]]` | `[2, "always", ["build", "ci", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test"]]` |

## Conventional

The default preset accepts common Conventional Commit headers and limits headers, body lines, and footer lines to 100 code points.

```text
feat(parser): add fast validation
fix!: remove the obsolete fallback
chore(release): publish binaries
```

Scopes are not case-checked and the `!` breaking marker is allowed. Subjects must be present, must not end in `.`, and must not match sentence, start, Pascal, or uppercase forms.

## Angular

The Angular preset is stricter about headers:

- The header limit is 72 code points.
- Scopes must be lowercase.
- The `!` breaking marker is rejected.
- `chore` is not an allowed type.
- Body and footer line limits are disabled.
- Header trimming is disabled.

```text
feat(core): add signal support
fix(router): preserve query parameters
```

Use a `BREAKING CHANGE:` footer rather than `!` when following this preset.

## Type reference

The linter checks only whether a type appears in `type-enum`; these descriptions are conventions for authors and reviewers.

| Type       | Intended use                                               | Presets           |
| ---------- | ---------------------------------------------------------- | ----------------- |
| `build`    | Build system or external dependency changes                | Both              |
| `chore`    | Maintenance that does not fit another user-facing category | Conventional only |
| `ci`       | Continuous integration configuration and scripts           | Both              |
| `docs`     | Documentation-only changes                                 | Both              |
| `feat`     | A new feature                                              | Both              |
| `fix`      | A bug fix                                                  | Both              |
| `perf`     | A performance improvement                                  | Both              |
| `refactor` | Code changes that are neither a feature nor a bug fix      | Both              |
| `revert`   | Reverting an earlier change                                | Both              |
| `style`    | Formatting or style changes without behavior changes       | Both              |
| `test`     | Adding or correcting tests                                 | Both              |

## Override a preset

This example starts with Angular, permits `chore`, raises the header limit, and allows the `!` marker:

```json
{
  "preset": "angular",
  "rules": {
    "header-max-length": [2, "always", 100],
    "subject-exclamation-mark": [0],
    "type-enum": [
      2,
      "always",
      ["build", "chore", "ci", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test"]
    ]
  }
}
```

## Unsupported preset names

Any name other than `conventional` or `angular` is a configuration error with exit status `2`. Quick Commitlint does not load npm preset packages or accept names such as `@commitlint/config-conventional`; use the short built-in name.

See [Configuration](docs/configuration/) for the complete JSON grammar and [Rules](docs/rules/) for each rule's behavior.

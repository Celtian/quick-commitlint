# Configuration

Quick Commitlint uses one strict JSON configuration object. Without a discovered or explicit file, it applies the built-in `conventional` preset.

## Configuration file discovery

The default filename is `.quick-commitlint.json`. Starting in the current working directory, Quick Commitlint checks that directory and then each parent directory up to the filesystem root. The nearest file wins.

Discovery is based on the process working directory, not the location of the commit-message file.

```text
repository/
├── .quick-commitlint.json
└── packages/
    └── application/  ← running here discovers the repository file
```

Pass `--config` or `-c` to skip discovery and use an explicit path:

```bash
quick-commitlint --config config/commitlint.json .git/COMMIT_EDITMSG
```

All relative config and message paths are resolved from the current working directory.

## Top-level object

Only two properties are supported:

| Property | Type                            | Default        | Purpose                                    |
| -------- | ------------------------------- | -------------- | ------------------------------------------ |
| `preset` | `"conventional"` or `"angular"` | `conventional` | Select the initial complete rule set       |
| `rules`  | object                          | `{}`           | Override individual rules from that preset |

```json
{
  "preset": "angular",
  "rules": {
    "header-max-length": [2, "always", 80],
    "subject-full-stop": [0]
  }
}
```

Rule overrides do not clear the preset. In this example, every Angular default remains active except the two named rules.

## Rule tuple anatomy

A rule is a JSON array containing a severity, a condition when required, and rule-specific data when required.

```text
[severity, condition, value]
```

### Severity

| Value | Name     | Effect                                                |
| ----- | -------- | ----------------------------------------------------- |
| `0`   | Disabled | The rule cannot add a finding                         |
| `1`   | Warning  | A finding is reported, but the process still succeeds |
| `2`   | Error    | A finding is reported and the process exits with `1`  |

`[0]` is the concise form accepted for every disabled rule. A severity of `1` or `2` requires the rule's complete tuple.

### Condition

Conditions are exact lowercase strings:

- `"always"` requires the rule predicate to match.
- `"never"` inverts the predicate.

The meaning follows the rule. For example, `type-empty` tests whether the type is empty, so `[2, "never"]` requires a nonempty type. `type-enum` tests membership, so `[2, "always", ["feat", "fix"]]` permits those values while `"never"` forbids them.

### Exact tuple forms

Tuple arity is strict; extra or missing items are errors.

| Rule value kind | Complete form                              | Used by                                   |
| --------------- | ------------------------------------------ | ----------------------------------------- |
| None            | `[severity, condition]`                    | blank, trim, empty, and exclamation rules |
| Limit           | `[severity, condition, nonnegativeInt]`    | maximum-length rules                      |
| String          | `[severity, condition, nonemptyString]`    | `subject-full-stop`                       |
| Case            | `[severity, condition, case]`              | `scope-case`, `type-case`, `subject-case` |
| Case list       | `[severity, condition, nonemptyCases[]]`   | `subject-case` only                       |
| Enum            | `[severity, condition, nonemptyStrings[]]` | `type-enum`                               |

`scope-case` and `type-case` accept one case string. Only `subject-case` accepts either one case or a nonempty array of cases.

## Supported case values

| Value           | Native check                                                                  |
| --------------- | ----------------------------------------------------------------------------- |
| `lower-case`    | No ASCII uppercase letter is present                                          |
| `upper-case`    | At least one ASCII uppercase letter and no ASCII lowercase letter are present |
| `sentence-case` | The first ASCII letter is uppercase                                           |
| `start-case`    | Each word after space, `-`, `_`, or tab begins with an uppercase ASCII letter |
| `pascal-case`   | The first ASCII letter is uppercase and no space, `-`, `_`, or tab is present |

These checks are intentionally ASCII-oriented. Non-ASCII letters do not by themselves violate `lower-case`. Length rules still count all Unicode code points.

## Complete custom example

```json
{
  "preset": "conventional",
  "rules": {
    "body-leading-blank": [1, "always"],
    "body-max-line-length": [2, "always", 120],
    "footer-leading-blank": [1, "always"],
    "footer-max-line-length": [2, "always", 120],
    "header-max-length": [2, "always", 80],
    "header-trim": [2, "always"],
    "scope-case": [2, "always", "lower-case"],
    "subject-case": [2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
    "subject-empty": [2, "never"],
    "subject-exclamation-mark": [0],
    "subject-full-stop": [2, "never", "."],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      ["build", "chore", "ci", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test"]
    ]
  }
}
```

See [Presets](docs/presets/) for the exact built-in values and [Rules](docs/rules/) for the behavior of every entry.

## Strict validation

Configuration parsing fails with exit status `2` for:

- malformed JSON;
- unknown or duplicate top-level properties;
- unknown or duplicate rule names;
- any preset other than `conventional` or `angular`;
- a severity other than the integers `0`, `1`, or `2`;
- any condition other than `always` or `never`;
- an invalid tuple length or value type;
- a negative length limit;
- an empty case list, enum list, enum value, or full-stop string;
- an unsupported case name;
- configuration input larger than 256 KiB.

Quick Commitlint does not load JavaScript modules or npm configuration packages. Properties used by full commitlint—such as `extends`, `parserPreset`, `plugins`, and `ignores`—are unknown here and cause an error. See [Commitlint compatibility](docs/compatibility/) before migrating an existing configuration.

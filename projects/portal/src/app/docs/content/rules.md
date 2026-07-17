# Rules

Quick Commitlint supports 14 rules. A rule tuple contains severity `0`, `1`, or `2`, an `always` or `never` condition when enabled, and an optional value determined by the rule.

`always` requires the described predicate; `never` inverts it. `[0]` disables any rule. See [Configuration](docs/configuration/) for tuple validation and [Presets](docs/presets/) for the complete side-by-side defaults.

## Rule summary

| Rule                       | Value                           | Conventional | Angular     |
| -------------------------- | ------------------------------- | ------------ | ----------- |
| `body-leading-blank`       | none                            | warning      | warning     |
| `body-max-line-length`     | nonnegative integer             | 100          | off         |
| `footer-leading-blank`     | none                            | warning      | warning     |
| `footer-max-line-length`   | nonnegative integer             | 100          | off         |
| `header-max-length`        | nonnegative integer             | 100          | 72          |
| `header-trim`              | none                            | error        | off         |
| `scope-case`               | one case                        | off          | lower       |
| `subject-case`             | one case or nonempty case array | error        | error       |
| `subject-empty`            | none                            | error        | error       |
| `subject-exclamation-mark` | none                            | off          | error       |
| `subject-full-stop`        | nonempty string                 | `.` error    | `.` error   |
| `type-case`                | one case                        | lower error  | lower error |
| `type-empty`               | none                            | error        | error       |
| `type-enum`                | nonempty string array           | error        | error       |

## Body rules

### `body-leading-blank`

Requires a blank line between the header and body when configured with `always`.

```json
"body-leading-blank": [1, "always"]
```

Both presets enable it as a warning. A message without a body passes.

```text
# passes
feat: add parser

Explain the implementation.

# warns
feat: add parser
Explain the implementation.
```

### `body-max-line-length`

Checks every parsed body line against a nonnegative Unicode code-point limit.

```json
"body-max-line-length": [2, "always", 100]
```

The Conventional preset sets 100 as an error; Angular disables the rule. With `always`, every line must be at most the limit. With `never`, the predicate is inverted, so the rule reports unless at least one line exceeds the supplied limit. URLs receive no special exemption.

## Footer rules

### `footer-leading-blank`

Requires a blank line before a recognized final footer paragraph with `always`.

```json
"footer-leading-blank": [1, "always"]
```

Both presets enable it as a warning. A message without a recognized footer passes.

```text
# passes
fix: close descriptor

Refs: #42

# warns
fix: close descriptor
Refs: #42
```

Only a recognized [footer trailer](docs/message-format/) activates this rule.

### `footer-max-line-length`

Checks every line of a recognized footer against a Unicode code-point limit.

```json
"footer-max-line-length": [2, "always", 100]
```

The Conventional preset sets 100 as an error; Angular disables the rule. The same `always` and inverted `never` semantics as `body-max-line-length` apply.

## Header rules

### `header-max-length`

Checks the complete first line, including type, scope, breaking marker, separator, and subject.

```json
"header-max-length": [2, "always", 100]
```

Conventional limits the header to 100 code points; Angular limits it to 72. With `never`, a header at or below the value is rejected instead.

### `header-trim`

Checks whether the header equals the same header after removing leading and trailing ASCII spaces and tabs.

```json
"header-trim": [2, "always"]
```

Conventional enables this as an error; Angular disables it. `never` reverses the check and therefore requires leading or trailing whitespace.

```text
# passes with always
feat: add parser

# fails with always
 feat: add parser
```

## Scope rule

### `scope-case`

Checks the optional text inside `type(scope): subject` against one supported case.

```json
"scope-case": [2, "always", "lower-case"]
```

Conventional disables this rule. Angular requires lowercase scope. An absent or empty scope is skipped; this rule does not require a scope.

```text
# passes Angular
feat(core): add parser

# fails Angular
feat(Core): add parser
```

`never` forbids the selected case rather than requiring another specific case.

## Subject rules

### `subject-case`

Checks the parsed subject against one case or any case in a nonempty array.

```json
"subject-case": [
  2,
  "never",
  ["sentence-case", "start-case", "pascal-case", "upper-case"]
]
```

Both presets use the tuple above, forbidding a subject that matches any listed case. Lowercase natural-language subjects normally pass.

```text
# passes
feat: add native parser

# fails
feat: Add native parser
feat: Add Native Parser
feat: AddNativeParser
feat: ADD NATIVE PARSER
```

An empty subject is skipped here and handled by `subject-empty`.

### `subject-empty`

Tests whether the parsed subject is empty.

```json
"subject-empty": [2, "never"]
```

Both presets use `never`, requiring a nonempty subject.

```text
# passes
fix: close descriptor

# fails
fix:
```

### `subject-exclamation-mark`

Tests whether the parsed header has `!` immediately before the colon.

```json
"subject-exclamation-mark": [2, "never"]
```

Angular uses `never` and rejects `feat!:` and `feat(scope)!:`. Conventional disables the rule and allows both. With `always`, the rule requires the marker.

### `subject-full-stop`

Tests whether the subject ends with the configured nonempty string.

```json
"subject-full-stop": [2, "never", "."]
```

Both presets forbid a trailing period. The value is not restricted to one character; for example, `[2, "always", "!"]` requires an exclamation suffix.

```text
# passes the preset
docs: explain configuration

# fails the preset
docs: explain configuration.
```

## Type rules

### `type-case`

Checks the parsed type against one supported case.

```json
"type-case": [2, "always", "lower-case"]
```

Both presets require lowercase type. An empty type is skipped here and handled by `type-empty`.

```text
# passes
feat: add parser

# fails
FEAT: add parser
```

### `type-empty`

Tests whether the parsed type is empty.

```json
"type-empty": [2, "never"]
```

Both presets use `never`, requiring a parsed type. A missing `: ` separator or invalid header prefix can make the parsed type empty.

### `type-enum`

Tests exact, case-sensitive membership in a nonempty list of strings.

```json
"type-enum": [2, "always", ["feat", "fix", "docs"]]
```

With `always`, only listed types pass. With `never`, listed types are forbidden. An empty type is skipped and left to `type-empty`.

Conventional permits:

```text
build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test
```

Angular permits the same list except `chore`.

## Case semantics

Case checks inspect ASCII letters and separators:

| Case            | Match definition                                                        |
| --------------- | ----------------------------------------------------------------------- |
| `lower-case`    | Contains no ASCII uppercase letters                                     |
| `upper-case`    | Contains at least one ASCII uppercase and no ASCII lowercase letters    |
| `sentence-case` | Its first ASCII letter is uppercase                                     |
| `start-case`    | Every word after space, hyphen, underscore, or tab starts uppercase     |
| `pascal-case`   | Its first ASCII letter is uppercase and it has none of those separators |

These are focused native predicates, not locale-aware text transformations. Empty fields are skipped by case and enum rules, so pair them with `subject-empty` or `type-empty` when presence is required.

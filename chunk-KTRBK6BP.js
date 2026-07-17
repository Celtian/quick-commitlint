import"./chunk-7CGTOI24.js";var a=`# Commit message format

Quick Commitlint parses one UTF-8 commit message. The first line is the header; later paragraphs may form a body and a footer.

\`\`\`text
type(scope)!: subject

body

Footer-Token: value
\`\`\`

Only the header is required. LF and CRLF line endings are accepted.

## Header

The header must contain the exact separator \`: \`\u2014a colon followed by one space.

\`\`\`text
feat(parser): add native validation
\u2502    \u2502        \u2502
\u2502    \u2502        \u2514\u2500 subject
\u2502    \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 optional scope
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 type
\`\`\`

The type must contain one or more ASCII letters, digits, or underscores. Presets normally restrict it further with \`type-enum\`. A scope is optional and is the text inside the final parentheses before the separator.

| Header                              | Parsed result                                     |
| ----------------------------------- | ------------------------------------------------- |
| \`feat: add parser\`                  | type \`feat\`, no scope, subject \`add parser\`       |
| \`fix(cli): handle stdin\`            | type \`fix\`, scope \`cli\`, subject \`handle stdin\`   |
| \`feat(api)!: remove legacy command\` | breaking marker present                           |
| \`feat:add parser\`                   | malformed: the required \`: \` separator is missing |
| \`feature-name: add parser\`          | malformed: \`-\` is not valid in the parsed type    |

A malformed prefix is not partially accepted. Its type, scope, subject, and breaking marker are treated as empty, so enabled \`type-empty\`, \`subject-empty\`, and related rules report the problem.

## Breaking changes

An exclamation mark immediately before the colon marks a breaking change:

\`\`\`text
feat!: remove the legacy API
feat(api)!: remove the legacy API
\`\`\`

The Conventional preset permits this marker. The Angular preset rejects it through \`subject-exclamation-mark\`. A breaking change can also be described in the final footer paragraph:

\`\`\`text
feat(api): remove the legacy API

BREAKING CHANGE: clients must use the v2 endpoint
\`\`\`

## Body

Everything after the header and before a recognized final footer paragraph is the body. The built-in presets warn when a body starts immediately after the header instead of after a blank line.

\`\`\`text
feat(parser): expose diagnostics

Return all findings so editors can display them together.
\`\`\`

The Conventional preset checks every body line against a 100-code-point limit. The Angular preset does not set a body line limit.

## Footer recognition

Only the final paragraph can be a footer. Its first line must begin with one of these trailer forms:

- \`BREAKING CHANGE:\`
- \`BREAKING-CHANGE:\`
- an ASCII alphanumeric or hyphenated token followed by \`:\`
- an ASCII alphanumeric or hyphenated token followed by \` #\`

\`\`\`text
fix(cli): preserve exit status

Keep the native process status when invoked from a hook.

Refs: #42
Reviewed-by: A. Developer
\`\`\`

Because \`Refs: #42\` starts the final paragraph, both lines are treated as the footer. A paragraph whose first line is ordinary prose remains part of the body, even if a later line resembles a trailer.

## Parsing boundaries

- Input must be valid UTF-8.
- Header and line length rules count Unicode code points, not UTF-8 bytes.
- Case rules use documented ASCII-oriented checks.
- Merge, revert, fixup, tag, and initial commit messages are not automatically ignored.
- There is no configurable parser, custom scope delimiter, or multiple-scope syntax.

See the [Rules reference](docs/rules/) for validation semantics and [Commitlint compatibility](docs/compatibility/) for deliberate differences from the JavaScript tool.
`;export{a as default};

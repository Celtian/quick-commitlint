var n=`# Commitlint compatibility

Quick Commitlint is a focused native implementation of a tested subset of Commitlint behavior. It is designed for projects that want the included Conventional or Angular rules without loading Commitlint's JavaScript configuration and rule stack for every commit.

The comparison baseline is \`@commitlint/cli\` 21.2.1 with \`@commitlint/config-conventional\` 21.2.0 and \`@commitlint/config-angular\` 21.2.0, matching the packages pinned by this repository. Consult Commitlint's official [CLI](https://commitlint.js.org/reference/cli.html), [configuration](https://commitlint.js.org/reference/configuration.html), and [plugin](https://commitlint.js.org/reference/plugins.html) references for its complete feature set.

Quick Commitlint is not a drop-in replacement for every Commitlint configuration.

## At a glance

| Area                  | Quick Commitlint                                                                                                    | Commitlint                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Runtime               | Small Node.js launcher selects a bundled native Zig linting executable; the package has no runtime npm dependencies | Node.js CLI with JavaScript packages for loading configuration, parsing, formatting, and linting         |
| Default configuration | Uses the built-in \`conventional\` preset when no configuration is found                                              | Normally loads discovered or supplied rules; \`--default-config\` can provide a Conventional fallback      |
| Configuration files   | Strict \`.quick-commitlint.json\` JSON                                                                                | JS, TS, JSON, YAML, extensionless, and \`package.json\` or \`package.yaml\` configuration                    |
| Presets               | Exactly \`conventional\` and \`angular\`, embedded in the executable                                                    | Shareable npm or local configurations composed through \`extends\`                                         |
| Rules                 | Fixed 14-rule subset with static JSON values                                                                        | Larger built-in rule set plus plugins, local rules, and function or promise values                       |
| Parser                | Fixed native parser                                                                                                 | Configurable parser presets and parser options                                                           |
| Ignores               | Lints every supplied message                                                                                        | Provides default generated-message ignores and custom ignore functions                                   |
| Inputs                | Standard input or one commit-message file                                                                           | Standard input, edit or environment files, the last commit, Git ranges, and ranges from the last tag     |
| Output                | Colored lint report on stderr; help and version on stdout                                                           | Configurable colors, formatters, quiet and verbose modes, help URLs, and strict warning/error exit codes |
| Platforms             | Bundled for macOS arm64/x64, Linux arm64/x64, and Windows x64                                                       | Runs where its supported Node.js and Git versions are available                                          |

## Conventional and Angular presets

| Mode         | Quick Commitlint                                               | Commitlint reference                     | Tested compatibility                                                                    |
| ------------ | -------------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------------- |
| Conventional | Built-in \`conventional\` preset, active by default              | \`@commitlint/config-conventional\` 21.2.0 | Supported preset defaults and diagnostics are compared through \`@commitlint/cli\` 21.2.1 |
| Angular      | Built-in \`angular\` preset, selected with \`"preset": "angular"\` | \`@commitlint/config-angular\` 21.2.0      | Supported preset defaults and diagnostics are compared through \`@commitlint/cli\` 21.2.1 |

The differential corpus currently exercises 66 Conventional and Angular cases. It checks pass/fail behavior and expected diagnostics for the supported preset rules. This protects the intended compatibility boundary; it does not claim parity for Commitlint rules or features that Quick Commitlint does not implement.

Within that boundary, Quick Commitlint supports:

- The 14-rule union listed in the [Rules reference](docs/rules/)
- The complete embedded defaults documented in the [Presets reference](docs/presets/)
- Commitlint-style severity, condition, and value tuples
- Conventional header, body, footer, scope, subject, and breaking-marker checks
- JSON rule overrides layered on either preset
- Warning-only success and rule-error failure statuses

## Configuration features not supported

Quick Commitlint does not implement:

- \`extends\`
- \`parserPreset\` or \`parserOpts\`
- \`plugins\`
- custom rule functions
- \`ignores\` or \`defaultIgnores\`
- formatter selection
- prompt configuration
- help URLs
- configuration in \`package.json\`
- JavaScript, TypeScript, YAML, or extensionless configuration files

Adding any unknown top-level key or rule is an error rather than being silently ignored.

## Parser and ignore differences

The native parser expects an exact \`: \` header separator and an ASCII alphanumeric or underscore type. It does not provide custom header patterns, custom scope delimiters, or multiple-scope parsing. Only a recognized final paragraph becomes the footer.

Generated commit messages\u2014merge, revert, fixup, tag, and initial messages\u2014are linted. If a workflow wants to ignore them, it must avoid invoking Quick Commitlint for those messages or preprocess the input before calling it.

For measured Conventional and Angular cold-start numbers, methodology, and reproduction steps, see the dedicated [Performance](docs/performance/) page.

## Choosing between them

Quick Commitlint is a good fit when:

- one of the two built-in presets is close to the desired policy;
- the supported JSON overrides are sufficient;
- fast native linting and no additional runtime npm dependencies matter;
- macOS arm64/x64, Linux arm64/x64, or Windows x64 is the deployment platform.

Use Commitlint when the project depends on shareable npm configurations, plugins, custom parsers, custom ignores, Git-range linting, or rules outside the supported subset.
`;export{n as default};
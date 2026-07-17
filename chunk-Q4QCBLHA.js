import"./chunk-7CGTOI24.js";var i=`# Commitlint compatibility

Quick Commitlint is a focused native implementation of a tested subset of commitlint behavior. It is designed for projects that want the included Conventional or Angular rules without starting Node.js for every commit.

It is not a drop-in replacement for every commitlint configuration.

## Supported behavior

- Built-in \`conventional\` and \`angular\` presets matching the local commitlint 21.2 reference packages
- The 14 rules listed in the [Rules reference](docs/rules/)
- Commitlint-style severity, condition, and value tuples
- Conventional header, body, footer, scope, subject, and breaking-marker checks
- JSON rule overrides layered on a preset
- Warning-only success and rule-error failure statuses

The repository runs differential cases against \`@commitlint/cli\`, \`@commitlint/config-conventional\`, and \`@commitlint/config-angular\` 21.2 to protect the intended preset behavior.

## Deliberate differences

| Area                  | Quick Commitlint                                                    | Full commitlint                                                  |
| --------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Runtime               | Native Linux x86-64 Zig binary                                      | Node.js                                                          |
| Default configuration | Built-in \`conventional\` when no config is found                     | Normally requires a discovered or supplied configuration         |
| Configuration files   | Strict \`.quick-commitlint.json\` JSON                                | Multiple JS/TS/JSON/YAML formats through its configuration stack |
| Presets               | Exactly \`conventional\` and \`angular\`                                | Shareable npm configurations and \`extends\`                       |
| Rules                 | Fixed 14-rule subset                                                | Larger rule set plus plugins and local rules                     |
| Rule values           | Static JSON values                                                  | Values may be supplied by JavaScript functions and promises      |
| Parser                | Fixed native parser                                                 | Configurable parser presets and parser options                   |
| Ignores               | Every message is linted                                             | Default and custom ignore functions are available                |
| Output                | Colored report is always written to stderr; help/version use stdout | More output and formatting controls                              |

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

## Parser differences

The native parser expects an exact \`: \` header separator and an ASCII alphanumeric or underscore type. It does not provide custom header patterns, custom scope delimiters, or multiple-scope parsing. Only a recognized final paragraph becomes the footer.

Generated commit messages\u2014merge, revert, fixup, tag, and initial messages\u2014are linted. If a workflow wants to ignore them, it must avoid invoking Quick Commitlint for those messages or preprocess the input before calling it.

## Choosing Quick Commitlint

Quick Commitlint is a good fit when:

- one of the two built-in presets is close to the desired policy;
- the supported JSON overrides are sufficient;
- fast native startup and a dependency-free installed command matter;
- Linux x86-64 is the deployment platform.

Use full commitlint when the project depends on shareable npm configurations, plugins, custom parsers, custom ignores, or rules outside the supported subset.
`;export{i as default};

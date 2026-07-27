import"./chunk-7CGTOI24.js";var n=`# Development

Quick Commitlint uses Zig for the published binary, Bun for development and packaging scripts, and Node.js for the published launcher.

## Requirements

- Zig 0.16.0
- Node.js 24
- Bun 1.3.14

## Validate a change

\`\`\`bash
bun install
bun run validate
\`\`\`

## Build and test the package

\`\`\`bash
bun run clean
bun run validate
bun run package
\`\`\`

## Benchmark

Run the cold-process benchmark against \`@commitlint/cli\`:

\`\`\`bash
bun run benchmark
\`\`\`

The documentation portal is an Angular 22 static site. Run it locally with \`bun run portal:start\` and validate it with \`bun run portal:validate\`.

The pre-commit hook runs ESLint and Prettier fixes on staged TypeScript and Angular template files. Run \`bun run validate\` before handoff because the hook does not run the full test and build suite.

## Documentation architecture

Documentation Markdown lives in \`projects/portal/src/app/docs/content\`. Each public document is registered once in the typed document registry; Angular uses that registry for routes, sidebar navigation, SEO metadata, and prerender routes.

Markdown is imported as text during the build and rendered by \`ngx-markdown\`, so prerendered pages contain the article content without a runtime HTTP request. When adding a page, also extend the SSG expectations and \`public/sitemap.xml\`.

## Release checks

Packaging changes require the release build and smoke test in addition to normal validation:

\`\`\`bash
bun run build:release
bun run script:package-npm
bun run package:smoke
bun run script:package-github
git diff --check
\`\`\`

The portal builds into \`dist/portal\`; the cross-platform npm package builds into \`dist/quick-commitlint\`.
`;export{n as default};

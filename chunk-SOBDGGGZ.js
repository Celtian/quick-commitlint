import"./chunk-7CGTOI24.js";var t=`# Development

Quick Commitlint uses Zig for the published binary and Node.js tooling for development and packaging.

## Requirements

- Zig 0.16.0
- Node.js 24
- Yarn 1.22.22

## Validate a change

\`\`\`bash
yarn install
yarn validate
\`\`\`

## Build and test the package

\`\`\`bash
yarn clean
yarn validate
yarn package
\`\`\`

## Benchmark

Run the cold-process benchmark against \`@commitlint/cli\`:

\`\`\`bash
yarn benchmark
\`\`\`

The documentation portal is an Angular 22 static site. Run it locally with \`yarn portal:start\` and validate it with \`yarn portal:validate\`.

## Documentation architecture

Documentation Markdown lives in \`projects/portal/src/app/docs/content\`. Each public document is registered once in the typed document registry; Angular uses that registry for routes, sidebar navigation, SEO metadata, and prerender routes.

Markdown is imported as text during the build and rendered by \`ngx-markdown\`, so prerendered pages contain the article content without a runtime HTTP request. When adding a page, also extend the SSG expectations and \`public/sitemap.xml\`.

## Release checks

Packaging changes require the release build and smoke test in addition to normal validation:

\`\`\`bash
yarn build:release
yarn script:package-npm
yarn package:smoke
yarn script:package-github
git diff --check
\`\`\`

The portal builds into \`dist/portal\`; the cross-platform npm package builds into \`dist/quick-commitlint\`.
`;export{t as default};

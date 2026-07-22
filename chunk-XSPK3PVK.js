import"./chunk-7CGTOI24.js";var a=`# Getting started

Quick Commitlint checks commit messages against a focused set of commitlint-compatible rules using a native Zig executable. A small Node.js launcher selects the executable bundled for the current platform, with no additional runtime npm dependencies.

## Install

With npm:

\`\`\`bash
npm install quick-commitlint --save-dev
\`\`\`

With Yarn:

\`\`\`bash
yarn add quick-commitlint --dev
\`\`\`

## Lint your first message

Pipe a Conventional Commit message to the command:

\`\`\`bash
echo "feat(parser): add fast validation" | quick-commitlint
\`\`\`

A valid message exits with status \`0\`. Rule errors exit with status \`1\`; command, file, UTF-8, and configuration errors exit with status \`2\`.

Quick Commitlint uses the \`conventional\` preset automatically. Add \`.quick-commitlint.json\` at the repository root to choose Angular or override individual rules:

\`\`\`json
{
  "preset": "angular",
  "rules": {
    "header-max-length": [2, "always", 80]
  }
}
\`\`\`

Continue with [Usage](docs/usage/), review the accepted [commit message format](docs/message-format/), or compare the complete [preset defaults](docs/presets/).

## Platform support

The package supports macOS arm64/x64, Linux arm64/x64, and Windows x64. The launcher requires Node.js 24 or 25 and uses it only to select and spawn the matching bundled Zig executable.
`;export{a as default};

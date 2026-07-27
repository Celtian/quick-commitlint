# Contributing

Use Zig 0.16.0, Node.js 24, and Bun 1.3.14. Install dependencies with `bun install` and run `bun run validate` before submitting a change. The pre-commit hook runs ESLint and Prettier fixes on staged TypeScript and Angular template files; it does not replace full validation. Behavior changes should include tests, and public interface changes should update the README.

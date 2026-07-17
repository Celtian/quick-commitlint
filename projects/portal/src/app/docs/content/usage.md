# Usage

Quick Commitlint reads one commit message from a file or from standard input.

## Read a commit message file

Pass the file as the only positional argument:

```bash
quick-commitlint .git/COMMIT_EDITMSG
```

## Read standard input

```bash
printf '%s\n' 'fix(cli): report invalid input' | quick-commitlint
```

## Use a Git commit hook

With Husky, add this command to `.husky/commit-msg`:

```sh
quick-commitlint "$1"
```

The command reports each warning or error and includes elapsed lint time. Warning-only results are successful, which makes severity `1` useful while introducing a rule.

## Message format

Input must be UTF-8 and may use LF or CRLF line endings. Length rules count Unicode code points. Case rules use ASCII semantics so international subjects remain valid.

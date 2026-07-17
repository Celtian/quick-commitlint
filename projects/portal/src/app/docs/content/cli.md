# CLI reference

```text
quick-commitlint [options] [commit-message-file]

-c, --config <path>  Use an explicit JSON configuration file.
-h, --help           Display usage information.
-V, --version        Display the installed version.
```

## Inputs

Provide one commit-message file, or omit it to read standard input. Supplying extra positional arguments is an error.

## Exit codes

| Code | Meaning                                        |
| ---- | ---------------------------------------------- |
| `0`  | Valid message or warnings only                 |
| `1`  | One or more rule errors                        |
| `2`  | Invalid command, file, UTF-8, or configuration |

## Version and help

```bash
quick-commitlint --version
quick-commitlint --help
```

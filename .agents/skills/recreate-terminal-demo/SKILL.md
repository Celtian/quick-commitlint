---
name: recreate-terminal-demo
description: Rebuild and verify this repository's animated README terminal demo from docs/terminal-demo.tape. Use when CLI commands, colored help text, diagnostics, README presentation, or docs/assets/terminal-demo.gif changes or becomes stale.
---

# Recreate Terminal Demo

Regenerate the README GIF from the current Zig executable and verify that the animation remains accurate, readable, compact, and safe to commit.

## Workflow

1. Inspect `docs/terminal-demo.tape`, the README hero image URL, and the current CLI behavior.
2. Update the tape only when commands, output, timing, or presentation need to change.
3. Run:

   ```bash
   .agents/skills/recreate-terminal-demo/scripts/render-demo.sh
   ```

   Approve Docker access if the official VHS image must be pulled.
4. Inspect `docs/assets/terminal-demo.gif` and every PNG printed by the script with the image viewing tool.
5. Confirm:
   - The colored help screen fits without wrapping or clipping.
   - The valid commit exits silently and the success marker is visible.
   - The invalid commit displays readable colored errors and the correct summary.
   - The animation loops cleanly and contains no setup or cleanup commands.
   - The GIF remains below 2 MiB.
6. Run:

   ```bash
   ZIG_GLOBAL_CACHE_DIR=/tmp/quick-commitlint-zig-cache yarn validate
   git diff --check
   git diff --cached --check
   ```

7. Report the GIF dimensions, duration, byte size, checksum, inspected frames, and validation results.

## Editing Guidance

- Build the current ReleaseFast Linux x86-64 CLI before recording; never fake terminal output.
- Keep hidden setup and cleanup commands inside `Hide`/`Show` blocks.
- Keep the committed asset at `docs/assets/terminal-demo.gif`.
- Keep the source tape at `docs/terminal-demo.tape`.
- Keep the README image URL absolute so npm can render it: `https://raw.githubusercontent.com/Celtian/quick-commitlint/master/docs/assets/terminal-demo.gif`.
- Preserve `*.gif binary` in `.gitattributes`.
- Prefer reducing pauses, dimensions, or framerate before accepting a GIF above 2 MiB.
- Do not change package versions, release metadata, public lint rules, or staging state merely to regenerate the demo.

## Resources

- `scripts/render-demo.sh`: build, render, validate, and extract inspection frames.

#!/usr/bin/env bash
set -euo pipefail

repo_root="${1:-$(git rev-parse --show-toplevel)}"
gif_path="docs/assets/terminal-demo.gif"
tape_path="docs/terminal-demo.tape"
frames_dir=".zig-cache/terminal-demo-frames"
max_bytes="${MAX_GIF_BYTES:-2097152}"
vhs_image="${VHS_IMAGE:-ghcr.io/charmbracelet/vhs}"

cd "$repo_root"

for command in docker file git sha256sum stat zig; do
  command -v "$command" >/dev/null || {
    echo "Missing required command: $command" >&2
    exit 1
  }
done

test -f "$tape_path" || {
  echo "Missing VHS tape: $tape_path" >&2
  exit 1
}

ZIG_GLOBAL_CACHE_DIR="${ZIG_GLOBAL_CACHE_DIR:-/tmp/quick-commitlint-zig-cache}" \
  zig build -Doptimize=ReleaseFast -Dtarget=x86_64-linux -Dcpu=baseline
docker run --rm -v "$repo_root:/vhs" "$vhs_image" "$tape_path"

test -f "$gif_path" || {
  echo "VHS did not create $gif_path" >&2
  exit 1
}

chmod 0644 "$gif_path"

mime_type="$(file -b --mime-type "$gif_path")"
test "$mime_type" = "image/gif" || {
  echo "Unexpected demo MIME type: $mime_type" >&2
  exit 1
}

gif_size="$(stat -c '%s' "$gif_path")"
if ((gif_size > max_bytes)); then
  echo "GIF is too large: $gif_size bytes (limit: $max_bytes)" >&2
  exit 1
fi

git check-attr binary -- "$gif_path" | grep -q 'binary: set' || {
  echo "$gif_path must be marked binary in .gitattributes" >&2
  exit 1
}

mkdir -p "$frames_dir"
for sample in "3:help" "8.5:valid" "15:invalid"; do
  timestamp="${sample%%:*}"
  name="${sample#*:}"
  docker run --rm --entrypoint ffmpeg -v "$repo_root:/vhs" "$vhs_image" \
    -loglevel error \
    -i "/vhs/$gif_path" \
    -ss "$timestamp" \
    -frames:v 1 \
    -update 1 \
    -y "/vhs/$frames_dir/$name.png"
done

duration="$(docker run --rm --entrypoint ffprobe -v "$repo_root:/vhs" "$vhs_image" \
  -v error \
  -show_entries format=duration \
  -of default=noprint_wrappers=1:nokey=1 \
  "/vhs/$gif_path")"
dimensions="$(file "$gif_path" | sed -n 's/.* \([0-9][0-9]* x [0-9][0-9]*\).*/\1/p')"
checksum="$(sha256sum "$gif_path" | cut -d' ' -f1)"

printf 'GIF: %s\n' "$gif_path"
printf 'Dimensions: %s\n' "$dimensions"
printf 'Duration: %ss\n' "$duration"
printf 'Size: %s bytes\n' "$gif_size"
printf 'SHA-256: %s\n' "$checksum"
printf 'Inspection frames:\n'
printf '  %s/help.png\n' "$frames_dir"
printf '  %s/valid.png\n' "$frames_dir"
printf '  %s/invalid.png\n' "$frames_dir"

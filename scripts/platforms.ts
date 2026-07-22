export type Platform = {
  id: string;
  os: NodeJS.Platform;
  arch: NodeJS.Architecture;
  target: string;
  binary: string;
};

export const platforms: Platform[] = [
  {
    id: 'darwin-arm64',
    os: 'darwin',
    arch: 'arm64',
    target: 'aarch64-macos',
    binary: 'quick-commitlint',
  },
  {
    id: 'darwin-x64',
    os: 'darwin',
    arch: 'x64',
    target: 'x86_64-macos',
    binary: 'quick-commitlint',
  },
  {
    id: 'linux-arm64',
    os: 'linux',
    arch: 'arm64',
    target: 'aarch64-linux-musl',
    binary: 'quick-commitlint',
  },
  {
    id: 'linux-x64',
    os: 'linux',
    arch: 'x64',
    target: 'x86_64-linux-musl',
    binary: 'quick-commitlint',
  },
  {
    id: 'win32-x64',
    os: 'win32',
    arch: 'x64',
    target: 'x86_64-windows',
    binary: 'quick-commitlint.exe',
  },
];

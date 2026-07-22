#!/usr/bin/env node
'use strict';

const { spawnSync } = require('node:child_process');
const { existsSync } = require('node:fs');
const { join } = require('node:path');

const supportedPlatforms = new Map([
  ['darwin-arm64', 'quick-commitlint'],
  ['darwin-x64', 'quick-commitlint'],
  ['linux-arm64', 'quick-commitlint'],
  ['linux-x64', 'quick-commitlint'],
  ['win32-x64', 'quick-commitlint.exe'],
]);

function getBinaryPath(platform = process.platform, arch = process.arch, baseDir = __dirname) {
  const id = `${platform}-${arch}`;
  const binary = supportedPlatforms.get(id);

  if (!binary) {
    throw new Error(
      `Unsupported platform ${id}. Supported platforms: ${[...supportedPlatforms.keys()].join(', ')}.`,
    );
  }

  return join(baseDir, 'native', id, binary);
}

function resolveBinary(platform = process.platform, arch = process.arch, baseDir = __dirname) {
  const id = `${platform}-${arch}`;
  const binaryPath = getBinaryPath(platform, arch, baseDir);
  if (!existsSync(binaryPath)) {
    throw new Error(`The package is missing its ${id} executable at ${binaryPath}.`);
  }

  return binaryPath;
}

function shouldUseExecve(platform = process.platform, getExecve = () => process.execve) {
  if (platform !== 'darwin' && platform !== 'linux') return false;
  return typeof getExecve() === 'function';
}

function run(args = process.argv.slice(2)) {
  const binaryPath = resolveBinary();
  if (shouldUseExecve()) {
    process.execve(binaryPath, [binaryPath, ...args], process.env);
  }

  const result = spawnSync(binaryPath, args, { stdio: 'inherit' });

  if (result.error) throw result.error;
  if (result.signal) {
    process.kill(process.pid, result.signal);
    return;
  }

  process.exitCode = result.status ?? 1;
}

if (require.main === module) {
  try {
    run();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`quick-commitlint: ${message}`);
    process.exitCode = 1;
  }
}

module.exports = { getBinaryPath, resolveBinary, run, shouldUseExecve };

'use strict';

const assert = require('node:assert/strict');
const { mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');
const { test } = require('node:test');

const { getBinaryPath, resolveBinary } = require('../npm/quick-commitlint.js');

test('resolves every supported platform to its bundled binary', () => {
  const cases = [
    ['darwin', 'arm64', 'darwin-arm64', 'quick-commitlint'],
    ['darwin', 'x64', 'darwin-x64', 'quick-commitlint'],
    ['linux', 'arm64', 'linux-arm64', 'quick-commitlint'],
    ['linux', 'x64', 'linux-x64', 'quick-commitlint'],
    ['win32', 'x64', 'win32-x64', 'quick-commitlint.exe'],
  ];

  for (const [platform, arch, id, binary] of cases) {
    const expected = join(__dirname, '..', 'npm', 'native', id, binary);
    assert.equal(getBinaryPath(platform, arch, join(__dirname, '..', 'npm')), expected);
  }
});

test('reports unsupported platforms clearly', () => {
  assert.throws(
    () => getBinaryPath('freebsd', 'x64'),
    /Unsupported platform freebsd-x64.*darwin-arm64.*win32-x64/,
  );
});

test('reports a missing supported executable clearly', () => {
  const baseDir = mkdtempSync(join(tmpdir(), 'quick-commitlint-launcher-'));
  try {
    assert.throws(() => resolveBinary('linux', 'x64', baseDir), /missing its linux-x64 executable/);
  } finally {
    rmSync(baseDir, { recursive: true, force: true });
  }
});

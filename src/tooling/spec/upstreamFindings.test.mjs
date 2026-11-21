import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { FINDINGS_FILE, readFindings, splitFindings, writeFindings } from '../../../scripts/spec/lib/upstream-findings.mjs';

const manifest = { version: 1, owned: ['src/owned.test.mjs'] };
const leak = (file) => ({ code: 'GATES-TEST-LEAK', file, message: 'leak' });

test('[coverage-gate-103] excuses a recorded finding of an upstream file', () => {
  const result = splitFindings({
    errors: [leak('src/up.test.mjs')],
    manifest,
    recorded: { 'src/up.test.mjs': ['GATES-TEST-LEAK'] },
  });
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.found, { 'src/up.test.mjs': new Set(['GATES-TEST-LEAK']) });
});

test('[coverage-gate-104] keeps the error of a finding that the record does not list', () => {
  const other = { code: 'TRACE-FAILED-TEST', file: 'src/up.test.mjs', message: 'failed' };
  const noFile = { code: 'TRACE-EMPTY-TEST-FILE', file: '', message: 'empty' };
  const errors = [leak('src/up.test.mjs'), leak('src/other.test.mjs'), leak('src/owned.test.mjs'), other, noFile];
  const result = splitFindings({ errors, manifest, recorded: { 'src/other.test.mjs': ['TRACE-EMPTY-TEST-FILE'] } });
  assert.deepEqual(
    result.errors.map((error) => `${error.code} ${error.file}`),
    [
      'GATES-TEST-LEAK src/up.test.mjs',
      'GATES-TEST-LEAK src/other.test.mjs',
      'GATES-TEST-LEAK src/owned.test.mjs',
      'TRACE-FAILED-TEST src/up.test.mjs',
      'TRACE-EMPTY-TEST-FILE ',
      'GATES-FINDING-STALE src/other.test.mjs',
    ],
  );
  assert.deepEqual(Object.keys(result.found).sort(), ['src/other.test.mjs', 'src/up.test.mjs']);
});

test('[coverage-gate-105] stops for a record that lists an owned file or a finding that is gone', () => {
  const result = splitFindings({
    errors: [leak('src/up.test.mjs')],
    manifest,
    recorded: {
      'src/owned.test.mjs': ['GATES-TEST-LEAK'],
      'src/up.test.mjs': ['GATES-TEST-LEAK', 'TRACE-EMPTY-TEST-FILE'],
      'src/gone.test.mjs': ['GATES-TEST-LEAK', 'TRACE-OUTSIDE-TEST-FILE'],
    },
  });
  assert.deepEqual(
    result.errors.map((error) => `${error.code} ${error.file}`),
    [
      'GATES-FINDING-OWNED src/owned.test.mjs',
      'GATES-FINDING-STALE src/up.test.mjs',
      'GATES-FINDING-STALE src/gone.test.mjs',
    ],
  );
});

test('[coverage-gate-106] reads no record when the file is absent and writes a sorted record', () => {
  const root = mkdtempSync(path.join(tmpdir(), 'gev-findings-'));
  try {
    mkdirSync(path.join(root, 'openspec/trace'), { recursive: true });
    assert.deepEqual(readFindings(root), {});
    writeFindings(root, {
      'src/b.test.mjs': new Set(['TRACE-EMPTY-TEST-FILE', 'GATES-TEST-LEAK']),
      'src/a.test.mjs': new Set(['GATES-TEST-LEAK']),
    });
    assert.equal(
      readFileSync(path.join(root, FINDINGS_FILE), 'utf8'),
      '{\n  "version": 1,\n  "files": {\n    "src/a.test.mjs": [\n      "GATES-TEST-LEAK"\n    ],\n    "src/b.test.mjs": [\n      "GATES-TEST-LEAK",\n      "TRACE-EMPTY-TEST-FILE"\n    ]\n  }\n}\n',
    );
    assert.deepEqual(readFindings(root), {
      'src/a.test.mjs': ['GATES-TEST-LEAK'],
      'src/b.test.mjs': ['GATES-TEST-LEAK', 'TRACE-EMPTY-TEST-FILE'],
    });
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

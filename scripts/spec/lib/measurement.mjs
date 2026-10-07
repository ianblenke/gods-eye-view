import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { contentHash } from './coverage.mjs';
import { listFilesAt, resolveCommit } from './git.mjs';
import { codeInventory, isCodeFile, isTestFile } from './inventory.mjs';
import { HISTORY_FILE } from './ledger.mjs';

const SNAPSHOT = '.gev-cache/spec/measurement.json';
const ALLOWED_PATHS = ['openspec/changes/', 'openspec/specs/', 'openspec/trace/'];

/** Return true for a protected ignored file. */
export function protectedInput(file, inventory) {
  if (isTestFile(file)) return true;
  if (/^scripts\/qa-.*\.mjs$/.test(file)) return true;
  if (file === 'package-lock.json') return true;
  if (file === 'package.json') return true;
  if (file === '.node-version') return true;
  if (file === 'Makefile') return true;
  if (/(^|\/)Dockerfile[^/]*$/.test(file)) return true;
  if (/(^|\/)[^/]*compose[^/]*\.ya?ml$/.test(file)) return true;
  if (file.startsWith('scripts/spec/')) return true;
  return inventory.has(file);
}

/** Write the snapshot and give its content hash. */
export function writeMeasurement(root, measured) {
  const text = JSON.stringify({ coverage: measured.coverage, records: measured.records, assertions: [...measured.assertions], inventory: measured.inventory, testFiles: measured.testFiles, untrue: [...measured.untrue] });
  writeFileSync(path.join(root, SNAPSHOT), text);
  return contentHash(text);
}

/** Refuse changed inputs before the document mode reads a snapshot. */
export function trustMeasurement(root, change, spawn = spawnSync) {
  const historyFile = path.join(root, HISTORY_FILE);
  const history = existsSync(historyFile) ? readFileSync(historyFile, 'utf8') : '';
  const line = history.split('\n').filter(Boolean).map(JSON.parse).findLast(item => item.change === change && ['coverage', 'untraced', 'measurement'].includes(item.kind));
  if (!line) return { reason: 'The change has no ratchet history line', files: [], commit: 'none' };
  if (line.dirty?.length > 0) return { reason: 'The ratchet ran with uncommitted input files, code files or test files', files: line.dirty, commit: line.commit };
  const commit = /^[a-fA-F0-9]{40}$/.test(line.commit) ? resolveCommit(root, line.commit) : null;
  if (!commit) return { reason: 'Git cannot find the ratchet commit', files: [], commit: line.commit };
  const difference = changedInputs(root, commit, spawn);
  if (difference.reason) return { ...difference, commit };
  const files = difference.files;
  if (files.length > 0) return { reason: 'Input files, code files or test files differ from the ratchet commit', files, commit };
  const absolute = path.join(root, SNAPSHOT);
  if (!existsSync(absolute)) return { reason: 'The ratchet snapshot is absent', files: [], commit };
  const text = readFileSync(absolute, 'utf8');
  if (contentHash(text) !== line.measurement) return { reason: 'The snapshot hash differs from history', files: [], commit };
  const snapshot = JSON.parse(text);
  return { commit, measured: { ...snapshot, assertions: new Map(snapshot.assertions), untrue: new Set(snapshot.untrue) } };
}

/** List changed input files, code files and test files. */
export function changedInputs(root, commit, spawn = spawnSync) {
  const options = { cwd: root, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 };
  const diff = spawn('git', ['diff', '--name-only', '--no-renames', '-z', commit, '--'], options);
  const others = spawn('git', ['ls-files', '--others', '--exclude-standard', '-z'], options);
  const ignored = spawn('git', ['ls-files', '--others', '--ignored', '--exclude-standard', '-z'], options);
  if (diff.status !== 0 || others.status !== 0 || ignored.status !== 0) return { reason: 'Git cannot compare input files, code files or test files', files: [] };
  const inventory = new Set(codeInventory(listFilesAt(root, commit)));
  const changed = [...diff.stdout.split('\0'), ...others.stdout.split('\0')].filter(file => file && (isTestFile(file) || isCodeFile(file) || !ALLOWED_PATHS.some(prefix => file.startsWith(prefix))));
  const protectedIgnored = ignored.stdout.split('\0').filter(file => file && !/(^|\/)node_modules\//.test(file) && !file.startsWith('.gev-cache/') && protectedInput(file, inventory));
  return { files: [...new Set([...changed, ...protectedIgnored])].sort() };
}

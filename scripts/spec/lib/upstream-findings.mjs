import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

export const FINDINGS_FILE = 'openspec/trace/upstream-test-findings.json';
/** The findings that the record can excuse, for a file that the fork does not own. */
export const EXCUSABLE_CODES = Object.freeze(['GATES-TEST-LEAK', 'TRACE-EMPTY-TEST-FILE', 'TRACE-OUTSIDE-TEST-FILE']);

/** The record: each upstream file with the codes that the gate excuses for it. */
export function readFindings(root) {
  const file = path.join(root, FINDINGS_FILE);
  return existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')).files : {};
}

export function writeFindings(root, found) {
  const files = Object.fromEntries(Object.keys(found).sort().map((file) => [file, [...found[file]].sort()]));
  writeFileSync(path.join(root, FINDINGS_FILE), `${JSON.stringify({ version: 1, files }, null, 2)}\n`);
}

/**
 * Split the errors of a run. `found` has each finding of an upstream file. `errors` has the
 * errors that remain: each finding that the record does not list, each other error, and a fault
 * of the record.
 */
export function splitFindings({ errors, isOwned, recorded }) {
  const found = {};
  const remaining = [];
  for (const error of errors) {
    if (!EXCUSABLE_CODES.includes(error.code) || !error.file || isOwned(error.file)) {
      remaining.push(error);
      continue;
    }
    (found[error.file] ??= new Set()).add(error.code);
    if (!recorded[error.file]?.includes(error.code)) remaining.push(error);
  }
  for (const [file, codes] of Object.entries(recorded)) {
    if (isOwned(file)) {
      remaining.push({ code: 'GATES-FINDING-OWNED', file, message: `${FINDINGS_FILE} lists the owned file ${file}` });
      continue;
    }
    for (const code of codes.filter((item) => !found[file]?.has(item))) {
      remaining.push({ code: 'GATES-FINDING-STALE', file, message: `${FINDINGS_FILE} lists ${code} for ${file}, and the run did not find it` });
    }
  }
  return { found, errors: remaining };
}

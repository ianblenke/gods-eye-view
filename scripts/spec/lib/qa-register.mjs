import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { changeFolder } from './review.mjs';

const QA_FILE = /^scripts\/qa-.*\.mjs$/;
const HEADER_MESSAGE = (file) => `${file}: add one first block with one nonempty line for each QA tag and valid covers items.`;
const TAGS = ['purpose', 'covers', 'run', 'needs'];

/** Read the first QA block and return its four values, or null. */
export function parseQaHeader(text) {
  const source = text.replace(/^#![^\r\n]*\r?\n/, '');
  const block = source.match(/^\/\*(?:\*?\r?\n)([\s\S]*?)\r?\n ?\*\//);
  if (!block) return null;
  const values = {};
  for (const raw of block[1].split(/\r?\n/)) {
    const line = raw.replace(/^ ?\* ?/, '');
    const tag = line.match(/^@(purpose|covers|run|needs) (\S.*)$/);
    if (!tag || Object.hasOwn(values, tag[1])) return null;
    values[tag[1]] = tag[2];
  }
  if (!TAGS.every((tag) => Object.hasOwn(values, tag))) return null;
  if (!/^\S[^.!?\r\n]*[.!?]$/.test(values.purpose)) return null;
  const covers = values.covers.startsWith('unmapped: ')
    ? (/^unmapped: [^,\s](?:[^,]*[^,\s])?$/.test(values.covers) ? [values.covers] : null)
    : values.covers.split(',');
  if (!covers || covers.length === 0 || covers.some((item) => !item.startsWith('unmapped: ') && !/^(?:pending:)?[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(item))) return null;
  return { purpose: values.purpose, covers, run: values.run, needs: values.needs };
}

/** Check tracked QA scripts and return their errors and valid header paths. */
export function readQaRegister({ root, tracked }) {
  const errors = [];
  const scripts = [];
  const validQaScripts = new Set();
  for (const file of tracked.filter((item) => QA_FILE.test(item)).sort()) {
    const header = parseQaHeader(readFileSync(path.join(root, file), 'utf8'));
    if (!header) {
      errors.push({ code: 'QA-HEADER', file, message: HEADER_MESSAGE(file) });
      continue;
    }
    validQaScripts.add(file);
    scripts.push({ file, ...header });
    for (const item of header.covers) {
      if (item.startsWith('unmapped: ')) continue;
      const pending = item.startsWith('pending:');
      const name = pending ? item.slice(8) : item;
      const folder = path.join(root, 'openspec/specs', name);
      const exists = existsSync(folder) && statSync(folder).isDirectory();
      if (pending && exists) errors.push({ code: 'QA-COVERS-LANDED', file, message: `${file}: replace ${item} with ${name}; its capability folder exists.` });
      if (!pending && !exists) errors.push({ code: 'QA-COVERS-UNKNOWN', file, message: `${file}: ${item} has no capability folder in openspec/specs/.` });
    }
  }
  errors.sort((a, b) => a.file.localeCompare(b.file) || a.code.localeCompare(b.code));
  return { errors, validQaScripts, scripts };
}

/** Return the QA advice lines for an active or archived change. */
export function qaAdvice({ root, change, scripts }) {
  if (!change) return [];
  const folder = changeFolder(root, change);
  const delta = folder ? path.join(root, folder, 'specs') : null;
  const capabilities = new Set(delta && existsSync(delta) ? readdirSync(delta) : []);
  const backfill = change.startsWith('backfill-') ? change.slice(9) : null;
  const lines = [];
  for (const script of scripts) {
    for (const item of script.covers) {
      const pending = item.startsWith('pending:');
      const name = pending ? item.slice(8) : item;
      const folder = path.join(root, 'openspec/specs', name);
      const exists = existsSync(folder) && statSync(folder).isDirectory();
      if (pending === exists) continue;
      if (capabilities.has(name) || (pending && name === backfill)) lines.push({ file: script.file, capability: name, text: `QA: ${script.file} covers ${name}: ${script.purpose}` });
    }
  }
  lines.sort((a, b) => a.file.localeCompare(b.file) || a.capability.localeCompare(b.capability));
  return lines.length ? [...new Set(lines.map((line) => line.text))] : ['QA: no script covers the capabilities of this change.'];
}

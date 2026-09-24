import { openSync, writeSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*-\d{3}$/;
const MAX_TAGS = 3;

/**
 * Read the scenario IDs at the start of a test name.
 *
 * @param {string} name - Test name, for example `[flights-004] shows a label`.
 * @returns {{tags: string[], title: string, error: null|'bad'|'too-many'}}
 */
export function parseTags(name) {
  const text = String(name);
  if (!text.startsWith('[')) return { tags: [], title: text, error: null };
  const match = text.match(/^\[([^\]]*)\]\s*/);
  const inner = match ? match[1] : '';
  const parts = inner.split(' ');
  if (!match || !parts.every((part) => ID.test(part))) return { tags: [], title: text, error: 'bad' };
  return {
    tags: parts,
    title: text.slice(match[0].length),
    error: parts.length > MAX_TAGS ? 'too-many' : null,
  };
}

function statusOf(data, outcome) {
  if (outcome === 'fail') return 'fail';
  if (data.skip) return 'skip';
  if (data.todo) return 'todo';
  return 'pass';
}

/**
 * Group node:test results by file and level. node:test reports the results of
 * subtests before the result of their parent, in the order of definition.
 */
export class TraceCollector {
  constructor({ cwd = process.cwd() } = {}) {
    this.cwd = cwd;
    this.pendingByFile = new Map();
  }

  /**
   * Add one result. Returns the finished records when a top-level test ends.
   *
   * @param {object} data - node:test event data.
   * @param {'pass'|'fail'} outcome
   * @returns {object[]}
   */
  add(data, outcome) {
    const file = data.file ? path.relative(this.cwd, data.file).split(path.sep).join('/') : '';
    const nesting = data.nesting || 0;
    const levels = this.pendingByFile.get(file) || [];
    this.pendingByFile.set(file, levels);

    const { tags, title, error } = parseTags(data.name);
    const node = {
      record: {
        file,
        name: data.name,
        title,
        kind: data.details?.type === 'suite' ? 'suite' : 'test',
        status: statusOf(data, outcome),
        tags,
        tagError: error,
        line: Number.isInteger(data.line) ? data.line : null,
        column: Number.isInteger(data.column) ? data.column : null,
      },
      children: levels[nesting + 1] || [],
    };
    levels[nesting + 1] = [];
    levels[nesting] = levels[nesting] || [];
    levels[nesting].push(node);

    if (nesting > 0) return [];
    levels[0] = [];
    const finished = [];
    const visit = (current, prefix) => {
      const fullName = prefix ? `${prefix} > ${current.record.name}` : current.record.name;
      for (const child of current.children) visit(child, fullName);
      finished.push({ ...current.record, fullName, leaf: current.children.length === 0 });
    };
    visit(node, '');
    return finished;
  }
}

/**
 * Find the destination Node paired with the `--test-reporter` that names this module.
 * Node matches each `--test-reporter` to the `--test-reporter-destination` that
 * immediately follows it, in argument order. Node keeps these flags in
 * `process.execArgv`, the Node-level options, not in `process.argv`, which only
 * has the file arguments left after Node consumes its own flags.
 *
 * @param {string[]} argv - `process.execArgv`.
 * @param {string} selfPath - Absolute path of this module, from `fileURLToPath(import.meta.url)`.
 * @returns {string|null}
 */
export function findOwnDestination(argv, selfPath) {
  const reporterFlag = '--test-reporter=';
  const destFlag = '--test-reporter-destination=';
  let pendingReporter = null;
  for (const arg of argv) {
    if (arg.startsWith(reporterFlag)) {
      pendingReporter = arg.slice(reporterFlag.length);
      continue;
    }
    if (arg.startsWith(destFlag)) {
      if (pendingReporter && path.resolve(pendingReporter) === selfPath) return arg.slice(destFlag.length);
      pendingReporter = null;
    }
  }
  return null;
}

/**
 * node:test reporter. Writes one JSON line for each test and suite.
 *
 * Node writes this generator's yielded output to its destination through its own
 * buffered, asynchronous stream, which `--test-force-exit` does not wait to drain.
 * Under real whole-project contention, that can drop already-finished tests' lines
 * before the process exits, so the same code can report a different untraced-name
 * set on otherwise identical runs. To avoid that race, this reporter also writes
 * each line itself, synchronously, to a `.sync` sibling of its own destination —
 * the same durability `test-guard.mjs` already relies on for its own exit-time
 * output. The gate reads that `.sync` file, not the one Node's own stream writes.
 *
 * Node's CLI always calls this with a real `AbortSignal` at `options.signal`. Only
 * that shape self-registers a destination: a direct, in-process call (as this
 * file's own tests make, to fix `cwd`) never passes one, even though
 * `process.execArgv` of the real, enclosing `node --test` run can legitimately
 * name this same module's own real destination at that moment. A test that
 * self-registered from `process.execArgv` alone, with no such check, would
 * otherwise truncate and corrupt the real, concurrently-running outer reporter's
 * `.sync` file the moment it ran as part of that same whole-project run, not
 * just in isolation.
 *
 * @param {AsyncIterable<{type: string, data: object}>} source
 * @param {{cwd?: string, signal?: AbortSignal}} [options]
 */
export default async function* traceReporter(source, options) {
  const collector = new TraceCollector(options);
  const isRealRun = options?.signal instanceof AbortSignal;
  const destination = isRealRun ? findOwnDestination(process.execArgv, fileURLToPath(import.meta.url)) : null;
  const syncPath = destination ? `${destination}.sync` : null;
  let fd = null;
  const ensureFd = () => {
    // Append, not write: the gate creates this file empty before any test process starts,
    // precisely so a test that writes into it directly (an adversarial trace test does, on
    // purpose) is never at risk of a later truncating open here wiping out what it wrote.
    if (syncPath && fd === null) fd = openSync(syncPath, 'a');
    return fd;
  };
  for await (const { type, data } of source) {
    if (type !== 'test:pass' && type !== 'test:fail') continue;
    const records = collector.add(data, type === 'test:pass' ? 'pass' : 'fail');
    for (const record of records) {
      const line = `${JSON.stringify(record)}\n`;
      const handle = ensureFd();
      if (handle !== null) writeSync(handle, line);
      yield line;
    }
  }
  ensureFd();
}

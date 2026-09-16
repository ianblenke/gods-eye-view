import path from 'node:path';

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
 * node:test reporter. Writes one JSON line for each test and suite.
 *
 * @param {AsyncIterable<{type: string, data: object}>} source
 * @param {{cwd?: string}} [options]
 */
export default async function* traceReporter(source, options = {}) {
  const collector = new TraceCollector(options);
  for await (const { type, data } of source) {
    if (type !== 'test:pass' && type !== 'test:fail') continue;
    const records = collector.add(data, type === 'test:pass' ? 'pass' : 'fail');
    for (const record of records) yield `${JSON.stringify(record)}\n`;
  }
}
